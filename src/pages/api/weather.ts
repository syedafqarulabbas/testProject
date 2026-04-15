import type { NextApiRequest, NextApiResponse } from 'next';

let cache: any = null;
let lastFetch = 0; // timestamp in ms

// Scheduled hours (24h format)
const FETCH_HOURS = [0, 6, 12, 18];

// Helper: get the latest scheduled slot before given hour
function getLatestSlot(hour: number): number {
  const slots = [...FETCH_HOURS].sort((a, b) => a - b);
  for (let i = slots.length - 1; i >= 0; i--) {
    if (hour >= slots[i]) return slots[i];
  }
  return slots[slots.length - 1]; // if before first slot, take last slot of previous day
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // disable browser caching completely
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const now = new Date();
  const currentHour = now.getHours();

  // Determine which slot this request belongs to
  const currentSlot = getLatestSlot(currentHour);

  // Determine the slot of last fetch
  const lastFetchSlot = lastFetch ? getLatestSlot(new Date(lastFetch).getHours()) : null;

  // Decide if we should fetch new data
  const shouldFetch = !cache || lastFetchSlot === null || lastFetchSlot !== currentSlot;

  console.log({
    lastFetch,
    now: now.getTime(),
    currentHour,
    currentSlot,
    lastFetchSlot,
    cacheExists: !!cache,
    shouldFetch,
  });

  if (!shouldFetch) {
    console.log('Returning cached weather (SERVER)');
    return res.status(200).json({ ...cache, cached: true, lastFetch, now: now.getTime() });
  }

  console.log('Fetching weather from WeatherAPI...');
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=Dammam&aqi=no`
    );

    const data = await response.json();
    cache = data;
    lastFetch = now.getTime();

    return res.status(200).json({ ...data, cached: false, lastFetch, now: now.getTime() });
  } catch {
    return res.status(200).json({
      location: { name: 'Dammam' },
      current: { temp_c: null, condition: { text: 'Unavailable', code: 0 } },
      last_updated: null,
      cached: false,
    });
  }
}
