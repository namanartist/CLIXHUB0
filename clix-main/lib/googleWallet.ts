/**
 * Google Wallet Integration Helper
 * Provides "Save to Google Wallet" functionality for Event Tickets and Verified Certificates.
 */

export interface GoogleWalletPassData {
  id: string;
  type: 'EVENT_TICKET' | 'GENERIC_PASS' | 'CERTIFICATE';
  title: string;
  subtitle?: string;
  recipientName: string;
  recipientId?: string;
  organizationName: string;
  date?: string;
  venue?: string;
  barcodeValue?: string;
}

/**
 * Generates a Google Wallet Save payload and handles wallet pass saving
 */
export function saveToGoogleWallet(passData: GoogleWalletPassData): void {
  try {
    const passPayload = {
      iss: 'clix-hub-mits@google-wallet.iam.gserviceaccount.com',
      aud: 'google',
      typ: 'savetowallet',
      iat: Math.floor(Date.now() / 1000),
      payload: {
        eventTicketObjects: passData.type === 'EVENT_TICKET' ? [{
          id: `pass_${passData.id}`,
          classId: `clix.event_${encodeURIComponent(passData.title.replace(/\s+/g, '_').toLowerCase())}`,
          state: 'ACTIVE',
          ticketHolderName: passData.recipientName,
          ticketNumber: passData.id,
          seatInfo: {
            gate: 'MAIN GATE',
            section: 'AUDITORIUM / HALL',
            row: 'GENERAL',
            seat: 'CONFIRMED'
          },
          barcode: {
            type: 'QR_CODE',
            value: passData.barcodeValue || passData.id,
            alternateText: passData.id
          },
          eventName: {
            defaultValue: {
              language: 'en-US',
              value: passData.title
            }
          },
          venue: {
            name: {
              defaultValue: {
                language: 'en-US',
                value: passData.venue || 'MITS Main Campus'
              }
            }
          }
        }] : undefined,
        genericObjects: passData.type !== 'EVENT_TICKET' ? [{
          id: `cert_${passData.id}`,
          classId: `clix.certificate_${encodeURIComponent(passData.organizationName.replace(/\s+/g, '_').toLowerCase())}`,
          cardTitle: {
            defaultValue: {
              language: 'en-US',
              value: passData.organizationName || 'CLIX Hub Verified Credential'
            }
          },
          header: {
            defaultValue: {
              language: 'en-US',
              value: passData.title
            }
          },
          subheader: {
            defaultValue: {
              language: 'en-US',
              value: passData.recipientName
            }
          },
          barcode: {
            type: 'QR_CODE',
            value: passData.barcodeValue || passData.id,
            alternateText: passData.id
          }
        }] : undefined
      }
    };

    const passBlob = new Blob([JSON.stringify(passPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(passBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `GoogleWallet_${passData.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      const walletWebUrl = `https://pay.google.com/gp/v/save/${encodeURIComponent(passData.id)}`;
      window.open(walletWebUrl, '_blank');
    }
  } catch (err) {
    console.error('Failed to generate Google Wallet pass:', err);
  }
}
