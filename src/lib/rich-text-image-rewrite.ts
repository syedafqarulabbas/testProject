/**
 * Rewrites image sources in rich text HTML to use Next.js Image Optimization API
 * Converts: <img src="/-/media/..." /> or <img src="https://domain.com/-/media/..." />
 * To: <img src="/_next/image?url=%2F-%2Fmedia%2F...&w=1920&q=75" />
 */
export function rewriteRichTextImages(html: string): string {
  if (!html) return html;

  // Match <img> tags and extract src attribute
  return html.replace(
    /<img\s+([^>]*\s)?src="([^"]+)"([^>]*)>/gi,
    (match, before = '', src, after = '') => {
      let relativeSrc = src;

      // Handle absolute URLs that contain Sitecore media paths
      if (src.includes('/-/media/')) {
        // Extract the relative path from absolute URL
        const mediaPathMatch = src.match(/(\/-\/media\/[^"]*)/i);
        if (mediaPathMatch) {
          relativeSrc = mediaPathMatch[1];
        } else {
          return match;
        }
      } else if (!src.startsWith('/-/')) {
        // Skip non-Sitecore URLs
        return match;
      }

      // Extract width and height from the img tag if present
      const widthMatch = match.match(/\s+width="(\d+)"/i);
      const heightMatch = match.match(/\s+height="(\d+)"/i);

      let width = widthMatch ? parseInt(widthMatch[1]) : 1920;
      let height = heightMatch ? parseInt(heightMatch[1]) : 0;

      // Ensure width is within Next.js Image acceptable ranges
      // Use deviceSizes and imageSizes from next.config.js
      const validSizes = [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];

      // Find the closest valid size that's >= the requested width
      const closestSize = validSizes.find(s => s >= width) || 1920;
      width = closestSize;

      // Encode the URL for use in the query parameter
      const encodedUrl = encodeURIComponent(relativeSrc);

      // Build the Next.js Image optimization URL
      const optimizedSrc = `/_next/image?url=${encodedUrl}&w=${width}&q=75`;

      // Reconstruct the img tag with the optimized src
      return `<img ${before}src="${optimizedSrc}"${after}>`;
    }
  );
}
