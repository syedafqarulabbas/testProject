import type { NextApiRequest, NextApiResponse } from "next";
import config from "../../temp/config";

/** Fallback MIME map when the upstream response omits Content-Type. */
const MIME_BY_EXT: Record<string, string> = {
  // Documents
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  txt: "text/plain",
  csv: "text/csv",
  // Images
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  // Video / audio
  mp4: "video/mp4",
  webm: "video/webm",
  mp3: "audio/mpeg",
  // Archives
  zip: "application/zip",
};

function getContentType(upstreamType: string | null, filename: string): string {
  // Prefer what the upstream server says (strip charset suffix if present)
  if (upstreamType) {
    return upstreamType.split(";")[0].trim();
  }
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return MIME_BY_EXT[ext] ?? "application/octet-stream";
}

const SITECORE_HOST = (config.sitecoreApiHost || process.env.SITECORE_API_HOST || "").replace(/\/$/, "");

/**
 * Proxy any file from a Sitecore media URL and force inline browser preview.
 * Usage: /api/previewfile?url=<encoded-file-url>
 *
 * Accepts both absolute and relative URLs. Self-referential URLs (where the
 * URL host matches the request host) are re-routed to SITECORE_API_HOST so
 * that server-side fetches don't loop back to 127.0.0.1 (which has no HTTPS
 * listener when TLS is terminated upstream).
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    res.status(400).json({ error: "Missing url parameter" });
    return;
  }

  let fileUrl: string;
  try {
    const decoded = decodeURIComponent(url);

    if (decoded.startsWith("/")) {
      // Relative path — resolve against the Sitecore host
      if (!SITECORE_HOST) {
        res.status(500).json({ error: "SITECORE_API_HOST is not configured" });
        return;
      }
      fileUrl = `${SITECORE_HOST}${decoded}`;
    } else {
      fileUrl = decoded;
    }

    const parsed = new URL(fileUrl);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Invalid protocol");
    }

    // Detect self-referential URLs: the URL points at this Next.js server
    // (e.g. https://uat.dammamairports.sa/-/media/...). On the server,
    // that hostname resolves to 127.0.0.1 but port 443 is not listening
    // locally when HTTPS is terminated by a reverse proxy. Re-route to
    // the Sitecore host directly so the fetch bypasses the loopback.
    const reqHost = (req.headers.host || "").split(":")[0].toLowerCase();
    const urlHost = parsed.hostname.toLowerCase();
    const isSelfRef =
      urlHost === reqHost ||
      urlHost === "localhost" ||
      urlHost === "127.0.0.1";

    if (isSelfRef) {
      if (!SITECORE_HOST) {
        res.status(500).json({ error: "SITECORE_API_HOST is not configured" });
        return;
      }
      fileUrl = `${SITECORE_HOST}${parsed.pathname}${parsed.search}`;
    }
  } catch {
    res.status(400).json({ error: "Invalid url parameter" });
    return;
  }

  try {
    const upstream = await fetch(fileUrl);

    if (!upstream.ok) {
      res.status(upstream.status).json({ error: "Failed to fetch file" });
      return;
    }

    const buffer = await upstream.arrayBuffer();

    const pathParts = new URL(fileUrl).pathname.split("/");
    const filename = pathParts[pathParts.length - 1] || "document";

    const contentType = getContentType(
      upstream.headers.get("content-type"),
      filename
    );

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.setHeader("Content-Length", buffer.byteLength);
    res.setHeader("Cache-Control", "public, max-age=300");

    res.status(200).send(Buffer.from(buffer));
  } catch (err) {
    console.error("pdf-preview proxy error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
