import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Catch-all proxy for AODB API requests
 * Proxies requests from /api/aodb/* to the internal or UAT AODB API
 * Example: /api/aodb/flights?arr_dep=A -> http://aodb.cd/api/v1/flights?arr_dep=A
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get environment configuration
    const USE_INTERNAL = process.env.AODP_INTERNAL_NETWORK === "1";
    const INTERNAL_BASE = process.env.AODB_INTERNAL_API_BASE || "http://aodb.cd/api/v1";
    const UAT_BASE = process.env.AODB_UAT_API_BASE || "https://uat.dammamairports.sa/AODPAPI/api/v1";

    const PRIMARY_API = USE_INTERNAL ? INTERNAL_BASE : UAT_BASE;
    const FALLBACK_API = UAT_BASE;

    // Extract path segments from the catch-all route
    const { path: pathSegments, ...queryParams } = req.query;

    if (!pathSegments || !Array.isArray(pathSegments)) {
      return res.status(400).json({ error: 'Invalid path' });
    }

    // Reconstruct the path
    const path = pathSegments.join('/');

    // Build query string
    const queryString = new URLSearchParams(
      queryParams as Record<string, string>
    ).toString();

    // Build target URL
    const targetUrl = `${PRIMARY_API}/${path}${queryString ? `?${queryString}` : ''}`;

    console.log("========================================");
    console.log("AODB API PROXY");
    console.log("========================================");
    console.log("Source:", USE_INTERNAL ? "INTERNAL (aodb.cd)" : "UAT");
    console.log("Method:", req.method);
    console.log("Target URL:", targetUrl);
    console.log("========================================");

    const startTime = Date.now();

    // Make the request to the target API
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD'
        ? JSON.stringify(req.body)
        : undefined,
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      console.warn(`[WARNING] Primary API returned ${response.status}`);

      // Try fallback if using internal network and primary failed
      if (USE_INTERNAL && PRIMARY_API !== FALLBACK_API) {
        console.log("[FALLBACK] Attempting fallback to UAT API...");
        const fallbackUrl = `${FALLBACK_API}/${path}${queryString ? `?${queryString}` : ''}`;
        const fallbackStart = Date.now();

        const fallbackResponse = await fetch(fallbackUrl, {
          method: req.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: req.method !== 'GET' && req.method !== 'HEAD'
            ? JSON.stringify(req.body)
            : undefined,
        });

        const fallbackDuration = Date.now() - fallbackStart;

        if (!fallbackResponse.ok) {
          console.error("[ERROR] Fallback API also failed:", fallbackResponse.status);
          const data = await fallbackResponse.json().catch(() => ({ error: 'Failed to load data' }));
          return res.status(fallbackResponse.status).json(data);
        }

        const data = await fallbackResponse.json();
        console.log(`[SUCCESS] Fallback response in ${fallbackDuration}ms`);
        console.log("========================================\n");
        return res.status(200).json(data);
      }

      const data = await response.json().catch(() => ({ error: 'Failed to load data' }));
      return res.status(response.status).json(data);
    }

    const data = await response.json();
    console.log(`[SUCCESS] Response received in ${duration}ms`);
    console.log("========================================\n");

    return res.status(200).json(data);

  } catch (error: any) {
    console.error("[ERROR] Proxy failed:", error?.message || error);
    console.log("========================================\n");

    // Try fallback on error
    const USE_INTERNAL = process.env.AODP_INTERNAL_NETWORK === "1";
    const INTERNAL_BASE = process.env.AODB_INTERNAL_API_BASE || "http://aodb.cd/api/v1";
    const UAT_BASE = process.env.AODB_UAT_API_BASE || "https://uat.dammamairports.sa/AODPAPI/api/v1";
    const PRIMARY_API = USE_INTERNAL ? INTERNAL_BASE : UAT_BASE;
    const FALLBACK_API = UAT_BASE;

    if (USE_INTERNAL && PRIMARY_API !== FALLBACK_API) {
      try {
        const { path: pathSegments, ...queryParams } = req.query;
        if (pathSegments && Array.isArray(pathSegments)) {
          const path = pathSegments.join('/');
          const queryString = new URLSearchParams(
            queryParams as Record<string, string>
          ).toString();

          console.log("[FALLBACK] Attempting fallback to UAT API...");
          const fallbackUrl = `${FALLBACK_API}/${path}${queryString ? `?${queryString}` : ''}`;

          const fallbackResponse = await fetch(fallbackUrl, {
            method: req.method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: req.method !== 'GET' && req.method !== 'HEAD'
              ? JSON.stringify(req.body)
              : undefined,
          });

          if (fallbackResponse.ok) {
            const data = await fallbackResponse.json();
            console.log("[SUCCESS] Fallback succeeded");
            console.log("========================================\n");
            return res.status(200).json(data);
          }
        }
      } catch (fallbackError) {
        console.error("[ERROR] Fallback also failed:", fallbackError);
      }
    }

    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Proxy error'
    });
  }
}
