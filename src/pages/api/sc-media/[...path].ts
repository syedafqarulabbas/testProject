import type { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';
import config from '../../../temp/config';

/**
 * Proxy for Sitecore /-/ paths (media, jssmedia, etc).
 * Uses explicit rejectUnauthorized: false to handle self-signed / incomplete
 * certificate chains on local Sitecore instances (kfiasc.dev.local).
 * Next.js rewrite proxy uses undici internally and ignores NODE_TLS_REJECT_UNAUTHORIZED.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path, ...queryParams } = req.query;
  const pathString = Array.isArray(path) ? path.join('/') : (path ?? '');

  const qs = new URLSearchParams(
    Object.entries(queryParams).reduce((acc, [k, v]) => {
      acc[k] = Array.isArray(v) ? v[0] : (v ?? '');
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  const targetUrl = new URL(
    `/-/${pathString}${qs ? `?${qs}` : ''}`,
    config.sitecoreApiHost
  );

  return new Promise<void>((resolve) => {
    const options = {
      hostname: targetUrl.hostname,
      port: targetUrl.port || 443,
      path: targetUrl.pathname + targetUrl.search,
      method: req.method ?? 'GET',
      headers: {
        accept: req.headers['accept'] ?? '*/*',
        cookie: req.headers['cookie'] ?? '',
        referer: req.headers['referer'] ?? '',
      },
      rejectUnauthorized: false,
    };

    const proxyReq = https.request(options, (proxyRes) => {
      res.status(proxyRes.statusCode ?? 200);

      const forward = [
        'content-type',
        'content-length',
        'content-disposition',
        'cache-control',
        'last-modified',
        'etag',
      ] as const;

      for (const header of forward) {
        const value = proxyRes.headers[header];
        if (value) res.setHeader(header, value);
      }

      const setCookie = proxyRes.headers['set-cookie'];
      if (setCookie) res.setHeader('Set-Cookie', setCookie);

      proxyRes.pipe(res);
      proxyRes.on('end', resolve);
    });

    proxyReq.on('error', (err) => {
      console.error('Failed to proxy', targetUrl.href, err);
      res.status(502).json({ error: 'Failed to proxy media request' });
      resolve();
    });

    proxyReq.end();
  });
}
