/**
 * Centralized API & Server Configuration Helper
 * Handles URL normalization across Localhost, Vercel Serverless, Render, Firebase, and Custom Domains.
 */

export function getApiBase(): string {
  const configured = import.meta.env.VITE_API_BASE;
  if (configured && typeof configured === 'string' && configured.trim().length > 0) {
    const clean = configured.trim().replace(/\/+$/, '');
    return clean.endsWith('/api') ? clean : `${clean}/api`;
  }

  // In browser environment, use relative '/api' which Vite proxies to localhost:4000
  // or matches the same-origin server in production
  if (typeof window !== 'undefined') {
    return '/api';
  }

  // In development Node environment
  return 'http://localhost:4000/api';
}

export function getSocketUrl(): string {
  const configured = import.meta.env.VITE_API_BASE;
  if (configured && typeof configured === 'string' && configured.trim().length > 0) {
    return configured.trim().replace(/\/+$/, '').replace(/\/api$/, '');
  }

  const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
  if (isVercel) {
    // Vercel serverless functions do not maintain persistent WebSockets
    return '';
  }

  if (typeof window !== 'undefined') {
    if (import.meta.env.PROD) {
      return window.location.origin;
    }
    // In dev mode across devices (phone, laptop, iPad on local network):
    return `${window.location.protocol}//${window.location.hostname}:4000`;
  }

  return 'http://localhost:4000';
}

export const API_BASE = getApiBase();

