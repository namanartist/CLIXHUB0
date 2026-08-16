/** Parse ISO, date-only, or locale date strings safely. */
export function parseDateInput(value: string | undefined | null): Date {
  if (!value) return new Date(NaN);
  const trimmed = String(value).trim();
  const d = new Date(trimmed);
  if (!Number.isNaN(d.getTime())) return d;
  const m = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return new Date(NaN);
}

export function formatDisplayDate(
  value: string | undefined | null,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = parseDateInput(value);
  if (Number.isNaN(d.getTime())) return value ? String(value) : '—';
  return d.toLocaleDateString(undefined, options ?? {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDisplayDateTime(value: string | undefined | null): string {
  const d = parseDateInput(value);
  if (Number.isNaN(d.getTime())) return value ? String(value) : '—';
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export function formatLogTimestamp(value: string): string {
  return formatDisplayDateTime(value);
}

export function formatTimeShort(value: string): string {
  const d = parseDateInput(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatEventDateParts(value: string) {
  const d = parseDateInput(value);
  if (Number.isNaN(d.getTime())) {
    return { day: '—', month: '—', full: String(value) };
  }
  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: d.toLocaleString('default', { month: 'short' }),
    full: formatDisplayDate(value),
  };
}
