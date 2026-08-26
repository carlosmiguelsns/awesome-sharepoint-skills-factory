export function titleCase(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

export function normalizeSearch(value: string): string {
  return value.trim().toLowerCase();
}

export function containsSearch(haystack: string, needle: string): boolean {
  return normalizeSearch(haystack).includes(normalizeSearch(needle));
}
