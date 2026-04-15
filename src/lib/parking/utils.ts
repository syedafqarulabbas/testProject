// lib/parking/utils.ts
export const percent = (num = 0, den = 0) =>
  den > 0 ? Math.max(0, Math.min(100, Math.round((num / den) * 100))) : 0;

export const hoursBetween = (a: Date, b: Date) =>
  Math.ceil((b.getTime() - a.getTime()) / 36e5);

export const parseDateTime = (d?: string, t?: string) =>
  d && t ? new Date(`${d}T${t}`) : null;