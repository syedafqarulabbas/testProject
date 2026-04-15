import type { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';
import config from '../../../temp/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path, ...queryParams } = req.query;
  const pathString = Array.isArray(path) ? path.join('/') : path;

  const qs = new URLSearchParams(
    Object.entries(queryParams).reduce((acc, [k, v]) => {
      acc[k] = Array.isArray(v) ? v[0] : (v ?? '');
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  const targetUrl = new URL(
    `/layouts/${pathString}${qs ? `?${qs}` : ''}`,
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
      },
      rejectUnauthorized: false,
    };

    const proxyReq = https.request(options, (proxyRes) => {
      res.status(proxyRes.statusCode ?? 200);

      const contentType = proxyRes.headers['content-type'];
      if (contentType) res.setHeader('Content-Type', contentType);

      const setCookie = proxyRes.headers['set-cookie'];
      if (setCookie) res.setHeader('Set-Cookie', setCookie);

      proxyRes.pipe(res);
      proxyRes.on('end', resolve);
    });

    proxyReq.on('error', (err) => {
      console.error('Error proxying layouts request:', err);
      res.status(500).json({ error: 'Failed to proxy request' });
      resolve();
    });

    proxyReq.end();
  });
}
