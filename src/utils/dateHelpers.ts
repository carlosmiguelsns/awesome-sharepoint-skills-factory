export function formatRelativeDate(value: string): string {
  const date: Date = new Date(value);
  const diffMs: number = Date.now() - date.getTime();
  const diffDays: number = Math.max(0, Math.round(diffMs / 86400000));

  if (diffDays <= 0) {
    return 'Today';
  }

  if (diffDays === 1) {
    return '1 day ago';
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  const weeks: number = Math.max(1, Math.round(diffDays / 7));
  if (weeks === 1) {
    return '1 week ago';
  }

  return `${weeks} weeks ago`;
}

export function formatLongDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
}
