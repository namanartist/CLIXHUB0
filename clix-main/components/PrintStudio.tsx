import React, { useState } from 'react';
import { Download, Printer, X, Check, Award, Ticket, FileText, QrCode, ShieldCheck, Sparkles, Smartphone, Edit3, Sliders } from 'lucide-react';
import { printHtmlDocument } from '../lib/printDocument';
import { generateGoogleWalletUrl, downloadAppleWalletPass } from '../lib/digitalWallet';
import { ClixQRCode } from './common/ClixQRCode';

export interface DocumentPrintItem {
  id: string;
  type: 'certificate' | 'ticket' | 'offer_letter' | 'registration';
  title: string;
  recipientName: string;
  recipientRoll?: string;
  organizationName?: string;
  date?: string;
  details?: Record<string, string>;
  templateId?: 'classic' | 'modern' | 'tech' | 'minimal' | 'elegant';
  status?: string;
  signatureNames?: string[];
  qrCodeValue?: string;
}

interface PrintStudioProps {
  item: DocumentPrintItem | null;
  onClose: () => void;
}

export const PrintStudio: React.FC<PrintStudioProps> = ({ item, onClose }) => {
  const [activeTemplate, setActiveTemplate] = useState<'classic' | 'modern' | 'tech' | 'minimal' | 'elegant'>(
    (item?.templateId as any) || 'modern'
  );
  const [isExporting, setIsExporting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Editable Document State
  const [recipientName, setRecipientName] = useState(item?.recipientName || '');
  const [recipientRoll, setRecipientRoll] = useState(item?.recipientRoll || '');
  const [docTitle, setDocTitle] = useState(item?.title || '');
  const [organizationName, setOrganizationName] = useState(item?.organizationName || 'CodeCell MITS');
  const [citationText, setCitationText] = useState(
    'For outstanding participation, leadership, and exemplary excellence in campus events and technical innovations'
  );
  const [presidentName, setPresidentName] = useState(item?.signatureNames?.[0] || 'Aryan Sharma');
  const [facultyName, setFacultyName] = useState(item?.signatureNames?.[1] || 'Dr. Priya Verma');
  const [deanName, setDeanName] = useState(item?.signatureNames?.[2] || 'Dr. Manish Dixit');

  if (!item) return null;

  const documentTitle = `${docTitle} - ${recipientName}`;

  const handlePrintOrPdf = () => {
    setIsExporting(true);
    const contentElement = document.getElementById('printable-studio-canvas');
    if (contentElement) {
      printHtmlDocument(contentElement.innerHTML, documentTitle, {
        landscape: item.type === 'certificate',
        delayMs: 300
      });
    }
    setTimeout(() => setIsExporting(false), 800);
  };

  const handleGoogleWallet = () => {
    const url = generateGoogleWalletUrl({
      id: item.id,
      type: item.type === 'certificate' ? 'certificate' : item.type === 'ticket' ? 'ticket' : 'offer_letter',
      title: docTitle,
      holderName: recipientName,
      holderIdentifier: recipientRoll,
      organizationName: organizationName,
      issueDate: item.date || new Date().toLocaleDateString(),
      barcodeValue: item.qrCodeValue || item.id,
      accentColor: '#0099ff'
    });
    window.open(url, '_blank');
  };

  const handleAppleWallet = () => {
    downloadAppleWalletPass({
      id: item.id,
      type: item.type === 'certificate' ? 'certificate' : item.type === 'ticket' ? 'ticket' : 'offer_letter',
      title: docTitle,
      holderName: recipientName,
      holderIdentifier: recipientRoll,
      organizationName: organizationName,
      issueDate: item.date || new Date().toLocaleDateString(),
      barcodeValue: item.qrCodeValue || item.id,
      accentColor: '#0f172a'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {item.type === 'certificate' ? <Award className="w-5 h-5" /> : item.type === 'ticket' ? <Ticket className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {docTitle}
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize font-medium">
                  {item.type.replace('_', ' ')} Studio
                </span>
              </h3>
              <p className="text-xs text-slate-400">Recipient: <span className="text-slate-200 font-medium">{recipientName}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {item.type !== 'ticket' && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                  isEditing
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? 'Close Editor' : 'Edit Content'}
              </button>
            )}

            <button
              onClick={handlePrintOrPdf}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Download PDF / Print
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Template Selector & Wallet Pass Buttons */}
        <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          {item.type === 'certificate' && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Style Template:</span>
              {(['modern', 'classic', 'tech', 'minimal', 'elegant'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTemplate(t)}
                  className={`px-3 py-1.5 rounded-lg font-medium capitalize transition ${
                    activeTemplate === t
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-blue-400" /> Digital Wallet:
            </span>
            <button
              onClick={handleGoogleWallet}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium hover:text-white transition flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Add to Google Wallet
            </button>
            <button
              onClick={handleAppleWallet}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium hover:text-white transition flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Add to Apple Wallet
            </button>
          </div>
        </div>

        {/* Live Content Editor Drawer */}
        {isEditing && (
          <div className="p-4 bg-slate-950 border-b border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs animate-in slide-in-from-top duration-300">
            <div>
              <label className="text-slate-400 font-semibold uppercase block mb-1">Recipient Name</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-slate-400 font-semibold uppercase block mb-1">Title / Event Name</label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-slate-400 font-semibold uppercase block mb-1">Organization / Club</label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-3">
              <label className="text-slate-400 font-semibold uppercase block mb-1">Citation / Description</label>
              <input
                type="text"
                value={citationText}
                onChange={(e) => setCitationText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-slate-400 font-semibold uppercase block mb-1">Club President Signature</label>
              <input
                type="text"
                value={presidentName}
                onChange={(e) => setPresidentName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-slate-400 font-semibold uppercase block mb-1">Faculty Coordinator Signature</label>
              <input
                type="text"
                value={facultyName}
                onChange={(e) => setFacultyName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-slate-400 font-semibold uppercase block mb-1">Dean / Authority Signature</label>
              <input
                type="text"
                value={deanName}
                onChange={(e) => setDeanName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Canvas / Preview Container */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950/60 flex items-center justify-center">
          <div
            id="printable-studio-canvas"
            className="w-full bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 transition-all p-8 relative"
            style={{ minHeight: item.type === 'certificate' ? '450px' : '520px' }}
          >
            {/* CERTIFICATE TEMPLATES */}
            {item.type === 'certificate' && (
              <div className="ccms-print-page p-8 sm:p-10 relative bg-[#fdfbf7] text-slate-900 border-[8px] border-[#c5a059] rounded-2xl shadow-xl overflow-hidden">
                {/* Guilloché Inner Frame */}
                <div className="absolute inset-2 border border-dashed border-[#c5a059]/70 rounded-xl pointer-events-none" />
                <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#c5a059]" />
                <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#c5a059]" />
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#c5a059]" />
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#c5a059]" />

                {/* Header Heraldry */}
                <div className="flex items-center justify-between border-b border-[#c5a059]/40 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <img src="/mitslogo.jpg" alt="MITS Logo" className="w-14 h-14 object-contain bg-white rounded-xl p-1 shadow border border-slate-200" />
                    <div className="text-left">
                      <h4 className="font-black text-xs sm:text-sm tracking-wide text-slate-900">माधव प्रौद्योगिकी एवं विज्ञान संस्थान, ग्वालियर</h4>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-800">Madhav Institute of Technology & Science, Gwalior</p>
                      <p className="text-[8px] text-slate-500 font-medium">(Deemed to be University u/s 3 of UGC Act, 1956 | NAAC A++ Grade)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#c5a059] block">Institutional Society</span>
                      <p className="text-xs font-bold text-slate-900">{organizationName}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-black text-lg shadow">
                      {organizationName?.[0] || 'M'}
                    </div>
                  </div>
                </div>

                {/* Presentation Title */}
                <div className="my-6 space-y-3">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.25em] bg-amber-500/10 border border-amber-500/30 text-amber-900">
                    <Sparkles className="w-3 h-3 text-amber-600" /> CERTIFICATE OF MERIT & ACHIEVEMENT
                  </span>
                  <p className="text-xs font-serif italic text-slate-500 uppercase tracking-widest">This official credential is proudly awarded to</p>
                  <h2 className="text-3xl sm:text-4xl font-serif font-black uppercase text-slate-900 tracking-tight">
                    {recipientName}
                  </h2>
                  {recipientRoll && (
                    <p className="text-xs font-mono font-bold tracking-[0.2em] text-[#c5a059]">ENROLLMENT ID: {recipientRoll}</p>
                  )}
                  <p className="text-xs sm:text-sm max-w-xl mx-auto text-slate-700 leading-relaxed font-light pt-1">
                    {citationText} in <strong className="font-bold text-slate-900">{docTitle}</strong> organized under institutional aegis by <strong className="font-bold text-slate-900">{organizationName}</strong>.
                  </p>
                </div>

                {/* Footer: Digital System Authentication */}
                <div className="mt-8 pt-4 border-t border-[#c5a059]/40 flex items-center justify-between gap-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                        ✓ Digitally Authenticated Record
                      </span>
                      <p className="text-[8px] text-slate-500 font-mono mt-0.5">
                        SECURE CLIX PROTOCOL · VALIDATED VIA CRYPTOGRAPHIC QR HASH
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">DOC SERIAL</p>
                      <p className="text-[10px] font-mono font-bold text-slate-900">{item.id}</p>
                      <p className="text-[8px] text-slate-500">{item.date || new Date().toLocaleDateString('en-IN')}</p>
                    </div>
                    <div className="shadow-md rounded-lg p-0.5 bg-white border border-slate-200">
                      <ClixQRCode value={`https://mits-ccms.edu/verify?docId=${item.id}&type=${item.type}`} size={56} level="H" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* EVENT TICKET TEMPLATE: REDESIGNED LUXURY BOARDING PASS / VIP ENTRY PASS */}
            {item.type === 'ticket' && (
              <div className="ccms-print-page max-w-2xl mx-auto bg-slate-950 text-white rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl relative">
                {/* Gradient Header Ribbon */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 flex items-center justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
                  <div className="relative z-10 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-white border border-white/30">
                        OFFICIAL GATE ADMIT PASS
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-[9px] font-bold text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" /> VERIFIED
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight">{docTitle}</h2>
                    <p className="text-xs text-blue-100 font-medium flex items-center gap-1.5">
                      Hosted by <strong className="text-white font-bold">{organizationName || 'MITS Institutional Club'}</strong>
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                    <Ticket className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Ticket Body: Two-Column Pass Layout */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900">
                  {/* Left 2 Cols: Attendee & Event Metadata */}
                  <div className="md:col-span-2 space-y-5">
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">AUTHORIZED ATTENDEE</p>
                      <h3 className="text-xl font-bold text-white tracking-tight">{recipientName}</h3>
                      <p className="text-xs font-mono text-blue-400 font-semibold">{recipientRoll || 'MITS ENROLLMENT VERIFIED'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-0.5">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">DATE & TIME</p>
                        <p className="font-bold text-slate-100">{item.date || 'Upcoming Schedule'}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-0.5">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">VENUE / HALL</p>
                        <p className="font-bold text-slate-100">{item.details?.['Venue'] || 'MITS Main Campus'}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-0.5">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">ENTRY GATE</p>
                        <p className="font-bold text-emerald-400">MAIN GATE / AUDITORIUM</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-0.5">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">PASS TIER</p>
                        <p className="font-bold text-amber-400">CONFIRMED SEAT</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Col: Perforated Stub with Dynamic QR & Barcode */}
                  <div className="md:border-l-2 border-dashed border-slate-800 md:pl-6 flex flex-col items-center justify-between text-center gap-4">
                    <div className="shadow-2xl rounded-2xl p-1 bg-white">
                      <ClixQRCode value={item.qrCodeValue || `https://mits-ccms.edu/verify?ticketId=${item.id}`} size={110} level="H" />
                    </div>
                    
                    <div className="space-y-1 w-full">
                      <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">ENTRY TOKEN ID</p>
                      <p className="text-xs font-mono font-black text-blue-400 bg-slate-950 py-1.5 px-2 rounded-lg border border-slate-800 select-all">
                        {item.id}
                      </p>
                      <p className="text-[8px] text-slate-500 font-mono">|||||| |||| |||||||| ||||</p>
                    </div>
                  </div>
                </div>

                {/* Footer Banner */}
                <div className="px-6 py-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400 font-medium">
                  <span>MITS Institutional Governance Protocol</span>
                  <span className="flex items-center gap-1 text-slate-300 font-bold">
                    <ShieldCheck className="w-3 h-3 text-primary" /> Powered by CLIX Hub
                  </span>
                </div>
              </div>
            )}

            {/* OFFER LETTER TEMPLATE */}
            {item.type === 'offer_letter' && (
              <div className="ccms-print-page p-8 bg-white text-slate-900 font-sans">
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6">
                  <div className="flex items-center gap-4">
                    <img src="/mitslogo.jpg" alt="MITS Logo" className="w-14 h-14 object-contain" />
                    <div>
                      <h2 className="text-lg font-black tracking-tight text-slate-900">MADHAV INSTITUTE OF TECHNOLOGY & SCIENCE</h2>
                      <p className="text-xs text-slate-600">A Grant-in-Aid Autonomous Institute Under Govt. of M.P.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-700">Ref: MITS/CCMS/OFFER/{item.id.slice(-6)}</p>
                    <p className="text-xs text-slate-500">Date: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="my-6">
                  <p className="text-sm font-bold">To,</p>
                  <p className="text-base font-bold text-blue-700">{recipientName}</p>
                  <p className="text-xs text-slate-600">{recipientRoll || 'Student Member'}</p>
                </div>

                <h3 className="text-center text-lg font-extrabold my-6 underline underline-offset-4 uppercase tracking-wide">
                  OFFER OF SELECTION & APPOINTMENT LETTER
                </h3>

                <p className="text-sm leading-relaxed text-slate-800 mb-4">
                  Dear <strong className="font-semibold">{recipientName}</strong>,
                </p>
                <p className="text-sm leading-relaxed text-slate-800 mb-4">
                  We are pleased to inform you that based on your performance and contributions, you have been selected for the position of <strong className="text-blue-900 font-bold">{docTitle}</strong> in <strong className="font-semibold">{organizationName}</strong> at Madhav Institute of Technology & Science, Gwalior for the academic session 2026-2027.
                </p>

                <div className="my-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                  <p className="font-bold text-slate-900">Key Responsibilities & Role Terms:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    <li>Lead technical project sprints, hackathons, and institutional showcases.</li>
                    <li>Uphold institutional compliance, student welfare ethics, and club guidelines.</li>
                    <li>Represent MITS Gwalior in inter-institutional competitions and industry forums.</li>
                  </ul>
                </div>

                <div className="mt-12 grid grid-cols-4 gap-4 text-xs pt-8 border-t border-slate-200 text-center items-end">
                  <div>
                    <p className="font-serif italic font-bold text-sm">{presidentName}</p>
                    <p className="text-slate-500">Club President</p>
                  </div>
                  <div>
                    <p className="font-serif italic font-bold text-sm">{facultyName}</p>
                    <p className="text-slate-500">Faculty Coordinator</p>
                  </div>
                  <div>
                    <p className="font-serif italic font-bold text-sm">{deanName}</p>
                    <p className="text-slate-500">Dean, Student Welfare</p>
                  </div>
                  <div className="flex flex-col items-center justify-end">
                    <div className="mb-1">
                      <ClixQRCode value={`https://mits-ccms.edu/verify?docId=${item.id}&type=${item.type}`} size={64} level="H" />
                    </div>
                    <p className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">VERIFIED PASSPORT</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
