import type { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';
import config from '../../../temp/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const targetUrl = new URL(
    `/sitecore/api/jss/track/event?sc_apikey=${config.sitecoreApiKey}&sc_site=${config.sitecoreSiteName}`,
    config.sitecoreApiHost
  );

  return new Promise<void>((resolve) => {
    // The JSS tracking SDK passes its full request-options object to the custom fetcher,
    // so req.body may arrive as { 0: {...}, method, headers, body: "[...]" }.
    // Unwrap the inner body string when that wrapper shape is detected.
    let payload: unknown = req.body;
    if (
      payload !== null &&
      typeof payload === 'object' &&
      !Array.isArray(payload) &&
      typeof (payload as Record<string, unknown>).body === 'string'
    ) {
      try {
        payload = JSON.parse((payload as Record<string, unknown>).body as string);
      } catch {
        // fall through and forward whatever we received
      }
    }
    const body = JSON.stringify(payload);

    const options = {
      hostname: targetUrl.hostname,
      port: targetUrl.port || 443,
      path: targetUrl.pathname + targetUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Cookie': req.headers['cookie'] ?? '',
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
      console.error('Error proxying track/event:', err);
      res.status(500).json({ error: 'Failed to proxy request' });
      resolve();
    });

    proxyReq.write(body);
    proxyReq.end();
  });
}
