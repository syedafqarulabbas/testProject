import { Zone } from "./parkingTypes";


export function normalizeZones(data: any): Zone[] {
  let z: Zone[] | null = null;

  if (Array.isArray(data)) {
    const withZones = data.find((x: any) => Array.isArray(x?.zones));
    if (withZones) z = withZones.zones;
    else if (data.every((x: any) => typeof x?.id !== "undefined" && x?.counts))
      z = data as Zone[];
  } else if (Array.isArray(data?.zones)) {
    z = data.zones;
  } else if (Array.isArray(data?.[0]?.zones)) {
    z = data[0].zones;
  }

  return (z ?? []).map((x: any) => ({
    id: Number(x.id) || 0,
    name: String(x.name || "").toUpperCase(),
    counts: {
      available: Number(x.counts?.available ?? 0),
      occupied: Number(x.counts?.occupied ?? 0),
      total: Number(x.counts?.total ?? 0),
      vacant: Number(x.counts?.vacant ?? 0),
      out_of_service: Number(x.counts?.out_of_service ?? 0),
      reserved: Number(x.counts?.reserved ?? 0),
      timestamp: String(x.counts?.timestamp ?? ""),
    },
  })).sort((a, b) => (a.name > b.name ? 1 : -1));
}