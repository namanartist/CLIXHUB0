/** Public shareable URL for event registration (login required to complete). */
export function getEventRegistrationUrl(eventId: string): string {
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  return `${base}/register/event/${eventId}`;
}

export async function copyEventRegistrationLink(eventId: string): Promise<boolean> {
  const url = getEventRegistrationUrl(eventId);
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}
