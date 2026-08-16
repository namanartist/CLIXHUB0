/**
 * Dynamic NPCI UPI QR Code & String Generator for Event Fees & Club Payments
 * Conforms to standard National Payments Corporation of India (NPCI) UPI specification.
 */

export interface UpiQrOptions {
  upiId?: string;
  payeeName?: string;
  amount?: number;
  eventTitle?: string;
  clubName?: string;
  subdomain?: string;
}

/**
 * Extracts a valid VPA / UPI ID from string, handles fallback generation
 */
export function extractValidUpiId(rawInput?: string, fallbackSlug?: string): string {
  const trimmed = (rawInput || '').trim();

  // If already a valid VPA (contains @ and no protocol)
  if (trimmed && trimmed.includes('@') && !trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('upi://')) {
    return trimmed;
  }

  // If URI format was passed, extract pa parameter
  if (trimmed.startsWith('upi://')) {
    try {
      const match = trimmed.match(/pa=([^&]+)/);
      if (match && match[1]) {
        return decodeURIComponent(match[1]);
      }
    } catch {}
  }

  // Generate canonical MITS Gwalior institutional VPA
  const slug = (fallbackSlug || 'treasury')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 15);

  return `mits.${slug || 'treasury'}@okicici`;
}

/**
 * Builds standard NPCI UPI URI with exact locked event amount and transaction note.
 * Format: upi://pay?pa={upiId}&pn={payeeName}&am={amount}&cu=INR&tn={note}
 */
export function buildEventUpiString(options: UpiQrOptions): string {
  const cleanUpiId = extractValidUpiId(options.upiId, options.subdomain || options.clubName);
  const rawPayee = (options.clubName || options.payeeName || 'MITS Gwalior Club').trim();
  const payeeName = encodeURIComponent(rawPayee.replace(/[^a-zA-Z0-9 ]/g, ' ').trim() || 'MITS Club');
  
  const amountVal = Number(options.amount || 0);
  const amountParam = amountVal > 0 ? `&am=${amountVal.toFixed(2)}` : '';
  
  const cleanTitle = (options.eventTitle || 'Campus Event Pass').replace(/[^a-zA-Z0-9 ]/g, ' ').trim().slice(0, 30);
  const note = encodeURIComponent(`Pass: ${cleanTitle}`);
  
  return `upi://pay?pa=${cleanUpiId}&pn=${payeeName}${amountParam}&cu=INR&tn=${note}`;
}

/**
 * Generates high-resolution QR image URL for pre-filled dynamic UPI payments
 */
export function buildEventUpiQrImageUrl(options: UpiQrOptions, size = 300): string {
  const upiString = buildEventUpiString(options);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(upiString)}&margin=10`;
}
