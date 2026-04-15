// app/api/pgs/zones/route.ts
import { NextResponse } from "next/server";

// Force server runtime and disable any static optimization/caching
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE = process.env.PGS_BASE_URL || "https://kfiapgsapi.mawgif.com";


export async function GET() {
  // Extra hard no-cache on the response (helps with some CDNs)
  const nocacheHeaders = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };

  try {
    const basicB64 = process.env.PGS_BASIC_B64 || "";

    const headers: Record<string, string> = {
      Accept: "application/json, text/plain, */*",
      "Accept-Version": "1",
      "User-Agent": "KFIA-Web/PGS (Next.js)",
    "Authorization": "Basic ZGFjbzpEQENvITc0NSM=",
    };
    if (basicB64) headers.Authorization = `Basic ${basicB64}`;

    // Guard against hanging upstream
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const upstream = await fetch(`${BASE}/api/PGS/zones`, {
      method: "GET",
      headers,
      cache: "no-store",
      next: { revalidate: 0 },
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (!upstream.ok) {
      const body = await upstream.text().catch(() => "");
      return NextResponse.json(
        {
          ok: false,
          error: `Upstream ${upstream.status}`,
          debug: {
            sentHeaders: {
              Accept: headers.Accept,
              "Accept-Version": headers["Accept-Version"],
              "User-Agent": headers["User-Agent"],
              Authorization_prefix: headers.Authorization?.split(" ")[0] ?? null,
              Authorization_token_len:
                headers.Authorization?.split(" ")[1]?.length ?? null,
              Authorization_token_present: Boolean(
                headers.Authorization?.split(" ")[1]
              ),
            },
            upstreamHeaders: {
              "www-authenticate": upstream.headers.get("www-authenticate"),
              "content-type": upstream.headers.get("content-type"),
            },
            bodyPreview: body.slice(0, 200),
            baseURL: BASE,
          },
        },
        { status: 502, headers: nocacheHeaders }
      );
    }

    // Try JSON first; fall back to text if content-type lies
    let data: unknown;
    const ct = upstream.headers.get("content-type") || "";
    if (ct.includes("json")) {
      data = await upstream.json();
    } else {
      const text = await upstream.text();
      try {
        data = JSON.parse(text);
      } catch {
        // If truly not JSON, still return something useful
        data = { raw: text };
      }
    }

    return NextResponse.json(
      { ok: true, data },
      { status: 200, headers: nocacheHeaders }
    );
  } catch (e: any) {
    // Surface aborts/timeouts clearly
    const isAbort = e?.name === "AbortError";
    return NextResponse.json(
      {
        ok: false,
        error: isAbort ? "Upstream request timed out" : e?.message || "Unexpected error",
      },
      { status: isAbort ? 504 : 500, headers: nocacheHeaders }
    );
  }
}