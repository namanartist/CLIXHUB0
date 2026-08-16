/**
 * Subdomain Detection & Routing Utility
 * Detects custom subdomains like `codecell.xyz.com` or `aarambh.mitsgwl.ac.in`
 * or `?subdomain=codecell` in development.
 */

export function getSubdomain(): string | null {
  if (typeof window === 'undefined') return null;

  // 1. Query parameter override (e.g. ?subdomain=codecell)
  const searchParams = new URLSearchParams(window.location.search);
  const querySub = searchParams.get('subdomain');
  if (querySub && querySub.trim()) {
    return querySub.trim().toLowerCase();
  }

  // 2. Hostname parsing
  const hostname = window.location.hostname;
  if (!hostname) return null;

  // Ignore IP addresses or single localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null;
  }

  const parts = hostname.split('.');

  // e.g. codecell.localhost (development subdomain testing)
  if (parts.length === 2 && parts[1] === 'localhost') {
    const sub = parts[0].toLowerCase();
    if (sub !== 'www' && sub !== 'app') return sub;
    return null;
  }

  // Production hostnames: e.g. codecell.xyz.com or codecell.mitsgwl.ac.in
  if (parts.length >= 3) {
    const sub = parts[0].toLowerCase();
    // Exclude system subdomains
    if (sub !== 'www' && sub !== 'app' && sub !== 'api' && sub !== 'admin') {
      return sub;
    }
  }

  return null;
}
