
export type FetchFlightsOpts = {
  tab?: "arrivals" | "departures";
  top?: number;
};

/**
 * Fetches flights via server-side proxy (/api/aodb/flights)
 * This avoids Mixed Content issues by keeping HTTP calls server-side
 */
export async function fetchFlights(opts: FetchFlightsOpts = {}) {
  const params = new URLSearchParams();
  if (opts.tab) params.set("arr_dep", opts.tab === "arrivals" ? "A" : "D");
  if (opts.top) params.set("top", String(opts.top));

  const queryString = params.size ? `?${params.toString()}` : "";
  const proxyUrl = `/api/aodb/flights${queryString}`;

  try {
    const res = await fetch(proxyUrl, { cache: "no-store" });

    if (!res.ok) {
      console.error("[ERROR] Proxy API failed:", res.status, res.statusText);
      throw new Error("Failed to load flights");
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("[ERROR] Proxy API failed:", err?.message || err);
    throw new Error("Failed to load flights");
  }
}

/**
 * Fetches single flight details via server-side proxy (/api/aodb/flight/{airline}/{number})
 * This avoids Mixed Content issues by keeping HTTP calls server-side
 */
export async function fetchSingleFlight(airline: string, number: string) {
  const proxyUrl = `/api/aodb/flight/${encodeURIComponent(airline)}/${encodeURIComponent(number)}`;

  try {
    const res = await fetch(proxyUrl, { cache: "no-store" });

    if (!res.ok) {
      console.error("[ERROR] Proxy API failed:", res.status, res.statusText);
      throw new Error("Failed to load flight");
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("[ERROR] Proxy API failed:", err?.message || err);
    throw new Error("Failed to load flight");
  }
}