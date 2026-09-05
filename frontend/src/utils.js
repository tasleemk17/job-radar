export function relativeTime(isoDate) {
  if (!isoDate) return 'Date unknown';
  const then = new Date(isoDate).getTime();
  const now = Date.now();
  const diffMs = now - then;
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'Just posted';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return new Date(isoDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function formatSalary(min, max) {
  if (!min && !max) return null;
  const fmt = (n) => `₹${Math.round(n / 1000)}k`;
  if (min && max && min !== max) return `${fmt(min)}–${fmt(max)}/yr`;
  return `${fmt(min || max)}/yr`;
}

export function stripHtml(text = '') {
  return text.replace(/<[^>]*>/g, '');
}
