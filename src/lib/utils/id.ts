/**
 * Generator ID pendek berbasis time + random. Cukup untuk kebutuhan lokal
 * (tidak perlu collision-resistant secara kriptografik).
 */
export function makeId(prefix = ''): string {
  const rand = Math.random().toString(36).slice(2, 10);
  const time = Date.now().toString(36);
  return prefix ? `${prefix}_${time}${rand}` : `${time}${rand}`;
}
