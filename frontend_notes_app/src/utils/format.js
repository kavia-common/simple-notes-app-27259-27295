const dtf = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

/**
 * PUBLIC_INTERFACE
 * Format timestamp into short human-readable string.
 */
export function formatDateShort(ts) {
  try {
    return dtf.format(new Date(ts));
  } catch {
    return '';
  }
}
