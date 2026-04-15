import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function fixMediaUrls(html: string): string {
  if (!html) return html;

  // Replace absolute URLs with incorrect hostnames to relative URLs
  // Pattern: https://mc2-***.azurewebsites.net/en/-/media/... -> /en/-/media/...
  return html.replace(
    /https?:\/\/mc2-[^\/]+\.azurewebsites\.net(\/[a-z]{2})?(\/-\/media\/[^"\s]+)/gi,
    "$1$2",
  );
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
