/**
 * Digital Wallet Utility
 * Generates structured pass data for Apple Wallet (.pkpass format / payload)
 * and Google Wallet (JWT pass payload & Add to Google Wallet button integration).
 */

export interface WalletPassData {
  id: string;
  type: 'ticket' | 'certificate' | 'id_card' | 'offer_letter';
  title: string;
  subtitle?: string;
  holderName: string;
  holderIdentifier?: string;
  organizationName: string;
  issueDate: string;
  expiryDate?: string;
  qrCodeUrl?: string;
  barcodeValue?: string;
  accentColor?: string;
  secondaryFields?: { label: string; value: string }[];
}

/**
 * Generate Google Wallet "Add to Google Wallet" link / payload structure
 */
export function generateGoogleWalletUrl(pass: WalletPassData): string {
  const payload = {
    iss: 'ccms-wallet-issuer@mitsgwl.ac.in',
    aud: 'google',
    typ: 'savetowallet',
    iat: Math.floor(Date.now() / 1000),
    payload: {
      genericObjects: [
        {
          id: `ccms.${pass.type}.${pass.id}`,
          classId: `ccms.class.${pass.type}`,
          logo: {
            sourceUri: {
              uri: 'https://mitsgwl.ac.in/logo.png'
            },
            contentDescription: {
              defaultValue: {
                language: 'en-US',
                value: pass.organizationName
              }
            }
          },
          cardTitle: {
            defaultValue: {
              language: 'en-US',
              value: pass.organizationName
            }
          },
          header: {
            defaultValue: {
              language: 'en-US',
              value: pass.title
            }
          },
          subheader: {
            defaultValue: {
              language: 'en-US',
              value: pass.subtitle || pass.holderName
            }
          },
          barcode: {
            type: 'QR_CODE',
            value: pass.barcodeValue || pass.id,
            alternateText: pass.id
          },
          hexBackgroundColor: pass.accentColor || '#0099ff'
        }
      ]
    }
  };

  const jsonStr = JSON.stringify(payload);
  const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
  return `https://pay.google.com/gp/v/save/${encoded}`;
}

/**
 * Generate Apple Wallet pass payload JSON for downloadable .pkpass file
 */
export function generateAppleWalletPassPayload(pass: WalletPassData): Record<string, any> {
  return {
    formatVersion: 1,
    passTypeIdentifier: 'pass.ac.in.mitsgwl.ccms',
    serialNumber: pass.id,
    teamIdentifier: 'MITSGWL2026',
    organizationName: pass.organizationName,
    description: pass.title,
    logoText: pass.organizationName,
    foregroundColor: 'rgb(255, 255, 255)',
    backgroundColor: pass.accentColor || 'rgb(15, 23, 42)',
    barcode: {
      message: pass.barcodeValue || pass.id,
      format: 'PKBarcodeFormatQR',
      messageEncoding: 'iso-8859-1'
    },
    generic: {
      primaryFields: [
        {
          key: 'title',
          label: 'DOCUMENT',
          value: pass.title
        }
      ],
      secondaryFields: [
        {
          key: 'holder',
          label: 'NAME',
          value: pass.holderName
        },
        {
          key: 'id',
          label: 'REGISTRATION ID',
          value: pass.holderIdentifier || pass.id
        }
      ],
      auxiliaryFields: (pass.secondaryFields || []).map((sf, idx) => ({
        key: `field_${idx}`,
        label: sf.label,
        value: sf.value
      }))
    }
  };
}

/**
 * Trigger browser download for Apple Wallet pass definition
 */
export function downloadAppleWalletPass(pass: WalletPassData): void {
  const passPayload = generateAppleWalletPassPayload(pass);
  const jsonBlob = new Blob([JSON.stringify(passPayload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(jsonBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${pass.title.toLowerCase().replace(/\s+/g, '_')}_pass.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
