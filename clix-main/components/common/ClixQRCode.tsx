import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export interface ClixQRCodeProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
  className?: string;
  showLogo?: boolean;
  logoSrc?: string;
  logoSize?: number;
  fgColor?: string;
  bgColor?: string;
}

/**
 * Universal Clix Hub QR Code Component
 * Embedded with official CLIX branding, high error correction (H level),
 * and automatic center excavation for 100% camera and scanner readability.
 */
export const ClixQRCode: React.FC<ClixQRCodeProps> = ({
  value,
  size = 180,
  level = 'H',
  includeMargin = true,
  className = '',
  showLogo = true,
  logoSrc = '/logo.png',
  logoSize,
  fgColor = '#000000',
  bgColor = '#FFFFFF',
}) => {
  const calculatedLogoSize = logoSize || Math.max(22, Math.round(size * 0.22));

  return (
    <div className={`relative inline-flex items-center justify-center p-2 bg-white rounded-2xl shadow-sm ${className}`}>
      <QRCodeSVG
        value={value || 'https://mitsgwl.ac.in'}
        size={size}
        level={level}
        fgColor={fgColor}
        bgColor={bgColor}
        includeMargin={includeMargin}
        imageSettings={
          showLogo
            ? {
                src: logoSrc,
                x: undefined,
                y: undefined,
                height: calculatedLogoSize,
                width: calculatedLogoSize,
                excavate: true,
              }
            : undefined
        }
      />
    </div>
  );
};

export default ClixQRCode;
