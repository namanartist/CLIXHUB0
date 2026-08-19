/**
 * Subdomain Detection & Routing Utility
 * Detects custom subdomains like `acm.clixhub.in`, `robotics.clixhub.in`,
 * or `?subdomain=acm` in development.
 */

import { Club } from '../types';

export function getSubdomain(): string | null {
  if (typeof window === 'undefined') return null;

  // 1. Query parameter override (e.g. ?subdomain=acm or ?club=acm)
  const searchParams = new URLSearchParams(window.location.search);
  const querySub = searchParams.get('subdomain') || searchParams.get('club');
  if (querySub && querySub.trim()) {
    return querySub.trim().toLowerCase();
  }

  // 2. Path fallback: e.g. /c/acm or /club/acm
  const pathname = window.location.pathname;
  const pathMatch = pathname.match(/^\/(?:c|club|subdomain)\/([^/]+)/i);
  if (pathMatch && pathMatch[1]) {
    return pathMatch[1].trim().toLowerCase();
  }

  // 3. Hostname parsing
  const hostname = window.location.hostname;
  if (!hostname) return null;

  // Ignore raw IP addresses or standalone localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null;
  }

  const parts = hostname.split('.');

  // e.g. acm.localhost (development subdomain testing)
  if (parts.length === 2 && parts[1] === 'localhost') {
    const sub = parts[0].toLowerCase();
    if (sub !== 'www' && sub !== 'app') return sub;
    return null;
  }

  // Production hostnames: e.g. acm.clixhub.in or acm.mitsgwl.ac.in
  if (parts.length >= 3) {
    const sub = parts[0].toLowerCase();
    // Exclude system subdomains
    if (sub !== 'www' && sub !== 'app' && sub !== 'api' && sub !== 'admin' && sub !== 'mail') {
      return sub;
    }
  }

  return null;
}

/**
 * Returns the sanitized subdomain slug for a given club
 */
export function getClubSubdomainSlug(club: Club | { id: string; subdomain?: string }): string {
  if (club.subdomain && club.subdomain.trim()) {
    return club.subdomain.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
  }
  return club.id.replace(/^club-/, '').toLowerCase().replace(/[^a-z0-9-]/g, '');
}

/**
 * Generates the full subdomain URL (e.g., https://acm.clixhub.in)
 */
export function getClubSubdomainUrl(club: Club | string): string {
  const slug = typeof club === 'string' ? club.toLowerCase().replace(/^club-/, '') : getClubSubdomainSlug(club);
  
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1');
    if (isLocalhost) {
      return `${window.location.protocol}//${slug}.localhost:${window.location.port || '3000'}`;
    }
    // Production domain
    const hostParts = window.location.hostname.split('.');
    if (hostParts.length >= 2) {
      const baseDomain = hostParts.slice(-2).join('.');
      return `https://${slug}.${baseDomain}`;
    }
  }
  return `https://${slug}.clixhub.in`;
}

/**
 * Copies the club's dedicated subdomain URL to clipboard
 */
export async function copyClubSubdomainUrl(club: Club | string): Promise<boolean> {
  const url = getClubSubdomainUrl(club);
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch (err) {
    console.error('Failed to copy subdomain URL', err);
  }
  return false;
}
