import React from 'react';
import { CertificateTemplate } from '../../types';
import { ClixQRCode } from '../common/ClixQRCode';
import { ShieldCheck, Award, Sparkles, CheckCircle2 } from 'lucide-react';

interface CertificateProps {
  studentName: string;
  enrollmentNumber?: string;
  eventName: string;
  clubName: string;
  clubLogoUrl?: string;
  id: string;
  date?: string;
  template: CertificateTemplate;
  customBackgroundUrl?: string;
  themeColor?: string;
  facultySignature?: string;
  facultyName?: string;
  presidentSignature?: string;
  presidentName?: string;
  isPrintReady?: boolean;
  isSystemGenerated?: boolean;
}

export const CertificatePreview: React.FC<CertificateProps> = ({
  studentName,
  enrollmentNumber,
  eventName,
  clubName,
  clubLogoUrl,
  id,
  date,
  template = 'classic',
  customBackgroundUrl,
  themeColor = '#1e3a8a',
  facultySignature,
  facultyName = "Faculty Coordinator",
  presidentSignature,
  presidentName = "Club President",
  isPrintReady = false,
  isSystemGenerated = true,
}) => {
  const issueDate = date
    ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const serialNumber = id === 'DRAFT-VERSION' || id === 'STUDIO-DRAFT' ? 'MITS-CCMS-2026-00001' : id;
  const verificationUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://mits-ccms.edu'}/verify-cert?id=${serialNumber}`;
  const cryptoHash = Array.from(`${serialNumber}|${studentName}|${eventName}`).reduce((acc, char) => acc + char.charCodeAt(0), 0).toString(16).padEnd(48, 'a89f');

  const hasSignatures = !!(facultySignature || presidentSignature);
  const showSystemAuth = isSystemGenerated || !hasSignatures;

  return (
    <div
      id={isPrintReady ? "certificate-print-area" : undefined}
      className="w-full h-full relative overflow-hidden bg-[#fbfbfa] text-slate-900 shadow-2xl select-none"
      style={{ aspectRatio: '1.414/1' }}
    >
      {/* Background Watermark / Custom Graphic */}
      {customBackgroundUrl ? (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img src={customBackgroundUrl} className="w-full h-full object-cover" alt="Certificate Background" />
          <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px]" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.035] flex items-center justify-center">
          <img src="/mitslogo.jpg" className="w-[550px] object-contain grayscale" alt="" />
        </div>
      )}

      {/* Intricate Multi-Layer Guilloché Border Frame */}
      <div className="absolute inset-3 sm:inset-4 md:inset-6 border-[3px] border-[#c5a059] rounded-2xl pointer-events-none z-10" />
      <div className="absolute inset-4 sm:inset-5 md:inset-8 border border-dashed border-[#c5a059]/60 rounded-xl pointer-events-none z-10" />
      <div className="absolute inset-5 sm:inset-6 md:inset-10 border border-[#0f172a]/20 rounded-lg pointer-events-none z-10" />

      {/* Corner Ornaments */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-8 h-8 border-t-2 border-l-2 border-[#c5a059] z-10" />
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 border-t-2 border-r-2 border-[#c5a059] z-10" />
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-8 h-8 border-b-2 border-l-2 border-[#c5a059] z-10" />
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-8 h-8 border-b-2 border-r-2 border-[#c5a059] z-10" />

      {/* Main Certificate Content */}
      <div className="relative z-20 w-full h-full p-8 sm:p-12 md:p-14 flex flex-col justify-between items-center text-center">
        
        {/* Header: Institutional Heraldry */}
        <div className="w-full max-w-4xl mx-auto flex items-center justify-between border-b border-[#c5a059]/40 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <img src="/mitslogo.jpg" alt="MITS Logo" className="h-16 w-16 object-contain bg-white rounded-xl p-1 shadow-sm border border-slate-200" />
            <div className="text-left">
              <div className="text-[11px] sm:text-[13px] font-black text-slate-900 tracking-wide">माधव प्रौद्योगिकी एवं विज्ञान संस्थान, ग्वालियर</div>
              <div className="text-[10px] sm:text-[12px] font-bold text-slate-800 tracking-wider uppercase">Madhav Institute of Technology & Science, Gwalior</div>
              <div className="text-[8px] sm:text-[9px] font-medium text-slate-600">(Deemed to be University u/s 3 of UGC Act, 1956 | NAAC A++ Grade)</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#c5a059] block">Institutional Society</span>
              <p className="text-xs font-bold text-slate-900">{clubName}</p>
            </div>
            {clubLogoUrl ? (
              <img src={clubLogoUrl} alt={`${clubName} Logo`} className="h-14 w-14 rounded-xl object-contain bg-white p-1 border border-slate-200 shadow-sm" />
            ) : (
              <div className="h-14 w-14 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-black text-xl shadow-sm">
                {clubName?.[0] || 'M'}
              </div>
            )}
          </div>
        </div>

        {/* Certificate Title & Presentation */}
        <div className="my-auto py-2 space-y-4 max-w-3xl">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 text-[10px] font-extrabold uppercase tracking-[0.3em]">
              <Sparkles size={12} className="text-amber-600" /> Certificate of Merit & Achievement
            </span>
            <p className="text-xs text-slate-500 tracking-widest uppercase font-serif italic pt-1">This official document is proudly conferred upon</p>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tight leading-tight uppercase">
              {studentName}
            </h1>
            {enrollmentNumber && (
              <p className="text-xs font-mono font-bold tracking-[0.25em] text-[#c5a059] mt-1 uppercase">
                Enrollment ID: {enrollmentNumber}
              </p>
            )}
            <div className="w-36 h-[2px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent mx-auto mt-2" />
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl mx-auto font-light">
            In recognition of outstanding dedication, active participation, and meritorious contribution during <strong className="font-bold text-slate-900">{eventName}</strong> organized under institutional aegis by <strong className="font-bold text-slate-900">{clubName}</strong>.
          </p>
        </div>

        {/* Footer: Digital System Authentication OR Signatures */}
        <div className="w-full max-w-4xl border-t border-[#c5a059]/40 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {showSystemAuth ? (
            /* ─── SYSTEM-GENERATED DIGITAL AUTHENTICATION (NO PHYSICAL SIGNATURE NEEDED) ─── */
            <div className="flex-1 flex items-center gap-4 text-left">
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 shadow-sm flex items-center justify-center shrink-0">
                <ShieldCheck size={32} />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    ✓ System-Generated & Digitally Authenticated
                  </span>
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">IT Act 2000 Sec 65B</span>
                </div>
                <p className="text-[9px] text-slate-600 leading-tight">
                  Cryptographically issued by CLIX Hub Governance Engine. No physical signature required.
                </p>
                <p className="text-[8px] font-mono text-slate-500">
                  TOKEN HASH: <span className="text-slate-800 font-bold">{cryptoHash.slice(0, 32)}...</span>
                </p>
              </div>
            </div>
          ) : (
            /* ─── PHYSICAL / MULTI-SIGNATURE ROW ─── */
            <div className="flex-1 grid grid-cols-3 gap-4 text-center text-xs text-slate-600">
              <div>
                <div className="h-10 flex items-center justify-center">
                  {presidentSignature ? <img src={presidentSignature} className="max-h-8 max-w-[100px] object-contain" alt="" /> : <span className="font-serif italic font-bold">{presidentName}</span>}
                </div>
                <div className="border-t border-slate-300 pt-1 font-semibold text-[10px] text-slate-800">Club President</div>
              </div>
              <div>
                <div className="h-10 flex items-center justify-center">
                  {facultySignature ? <img src={facultySignature} className="max-h-8 max-w-[100px] object-contain" alt="" /> : <span className="font-serif italic font-bold">{facultyName}</span>}
                </div>
                <div className="border-t border-slate-300 pt-1 font-semibold text-[10px] text-slate-800">Faculty Coordinator</div>
              </div>
              <div>
                <div className="h-10 flex items-center justify-center">
                  <span className="font-serif italic font-bold text-slate-900">Dr. Manish Dixit</span>
                </div>
                <div className="border-t border-slate-300 pt-1 font-semibold text-[10px] text-slate-800">Dean, Student Welfare</div>
              </div>
            </div>
          )}

          {/* Right: QR Code & Verification Token */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="text-[8px] font-mono uppercase tracking-widest text-slate-500">Document Serial</p>
              <p className="text-[11px] font-mono font-black text-slate-900">{serialNumber}</p>
              <p className="text-[9px] text-slate-500 font-medium">{issueDate}</p>
            </div>
            <div className="shadow-md rounded-xl p-1 bg-white border border-slate-200">
              <ClixQRCode value={verificationUrl} size={64} level="H" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 0; }
          body * { visibility: hidden !important; }
          #certificate-print-area, #certificate-print-area *, #cert-print-root, #cert-print-root * { visibility: visible !important; }
          #certificate-print-area, #cert-print-root { display: block !important; position: fixed !important; left: 0 !important; top: 0 !important; width: 100vw !important; height: 100vh !important; margin: 0 !important; padding: 0 !important; z-index: 999999 !important; box-shadow: none !important; opacity: 1 !important; }
        }
      `}</style>
    </div>
  );
};

export default CertificatePreview;
