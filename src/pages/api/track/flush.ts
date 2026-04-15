import type { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';
import config from '../../../temp/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const targetUrl = new URL(
    `/sitecore/api/jss/track/flush?sc_apikey=${config.sitecoreApiKey}`,
    config.sitecoreApiHost
  );

  return new Promise<void>((resolve) => {
    const body = JSON.stringify(req.body);

    const options = {
      hostname: targetUrl.hostname,
      port: targetUrl.port || 443,
      path: targetUrl.pathname + targetUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Cookie': req.headers['cookie'] ?? '',
        // Forward Origin so Sitecore CORS check passes on the API key
        'Origin': req.headers['origin'] ?? config.sitecoreApiHost,
        'Referer': req.headers['referer'] ?? '',
      },
      rejectUnauthorized: false,
    };

    const proxyReq = https.request(options, (proxyRes) => {
      res.status(proxyRes.statusCode ?? 200);
      proxyRes.pipe(res);
      proxyRes.on('end', resolve);
    });

    proxyReq.on('error', (err) => {
      console.error('Error proxying track/flush:', err);
      res.status(500).json({ error: 'Failed to proxy request' });
      resolve();
    });

    proxyReq.write(body);
    proxyReq.end();
  });
}
