import React from 'react';
import { X, QrCode, Printer, Download, ShieldCheck, Calendar, MapPin, Ticket, Sparkles } from 'lucide-react';
import { Registration, Event, Club } from '../../../../types';
import { printFirstAvailable, printEventPassHtml } from '../../../../lib/printDocument';
import { ClixQRCode } from '../../../common/ClixQRCode';

interface TicketPreviewModalProps {
  selectedReg: Registration;
  events: Event[];
  clubs: Club[];
  setIsPreviewModalOpen: (val: boolean) => void;
  handlePrint: (id: string) => void;
}

export const TicketPreviewModal: React.FC<TicketPreviewModalProps> = ({
  selectedReg,
  events,
  clubs,
  setIsPreviewModalOpen,
}) => {
  const event = events.find(e => e.id === selectedReg.eventId);
  const club = clubs.find(c => c.id === event?.clubId);
  const ticketId = selectedReg.ticketId || selectedReg.id;

  const onPrint = () => {
    const ok = printFirstAvailable(
      ['event-pass-print-area', 'print-ticket-area'],
      `MITS Pass - ${ticketId}`
    );
    if (!ok && event) {
      printEventPassHtml({
        clubName: club?.name || 'MITS Club',
        eventTitle: event.title,
        studentName: selectedReg.studentName,
        ticketId: ticketId,
        eventDate: event.date,
        qrData: ticketId,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-xl max-h-[95vh] overflow-y-auto custom-scrollbar p-2 sm:p-4 space-y-4">
        
        {/* Top Actions */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={12} /> Confirmed Gate Pass
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsPreviewModalOpen(false)}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 transition-all border border-white/10 cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* ─── REDESIGNED LUXURY BOARDING PASS TICKET ─── */}
        <div
          id="print-ticket-area"
          className="rounded-[2.5rem] overflow-hidden border border-slate-800 bg-slate-950 text-white shadow-2xl relative"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-white border border-white/30">
                  OFFICIAL ADMIT PASS
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-[9px] font-bold text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5" /> VERIFIED
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{event?.title || 'Campus Event'}</h2>
              <p className="text-xs text-blue-100 font-medium">
                Organized by <strong className="text-white font-bold">{club?.name || 'MITS Club'}</strong>
              </p>
            </div>
            <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner shrink-0">
              <Ticket className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Ticket Body: Two-Column Pass Layout */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-900">
            {/* Left 2 Cols: Attendee & Event Metadata */}
            <div className="sm:col-span-2 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">AUTHORIZED ATTENDEE</p>
                <h3 className="text-lg font-bold text-white tracking-tight">{selectedReg.studentName}</h3>
                <p className="text-xs font-mono text-blue-400 font-semibold">{selectedReg.studentRoll || 'MITS ENROLLMENT VERIFIED'}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-0.5">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">DATE & TIME</p>
                  <p className="font-bold text-slate-100">{event?.date ? new Date(event.date).toLocaleDateString('en-IN') : 'Upcoming'}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-0.5">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">VENUE</p>
                  <p className="font-bold text-slate-100">MITS Main Campus</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-0.5">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">ENTRY GATE</p>
                  <p className="font-bold text-emerald-400">MAIN GATE / AUDITORIUM</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-0.5">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">ACCESS TIER</p>
                  <p className="font-bold text-amber-400">CONFIRMED SEAT</p>
                </div>
              </div>
            </div>

            {/* Right Col: Perforated Stub with Dynamic QR & Barcode */}
            <div className="sm:border-l-2 border-dashed border-slate-800 sm:pl-6 flex flex-col items-center justify-between text-center gap-3">
              <div className="shadow-2xl rounded-2xl p-1 bg-white">
                <ClixQRCode value={ticketId} size={105} level="H" />
              </div>
              
              <div className="space-y-1 w-full">
                <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">ENTRY TOKEN ID</p>
                <p className="text-xs font-mono font-black text-blue-400 bg-slate-950 py-1.5 px-2 rounded-lg border border-slate-800 select-all">
                  {ticketId}
                </p>
                <p className="text-[8px] text-slate-500 font-mono">|||||| |||| |||||||| ||||</p>
              </div>
            </div>
          </div>

          {/* Footer Banner */}
          <div className="px-6 py-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400 font-medium">
            <span>Madhav Institute of Technology & Science</span>
            <span className="flex items-center gap-1 text-slate-300 font-bold">
              <ShieldCheck className="w-3 h-3 text-primary" /> Powered by CLIX Hub
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onPrint}
            className="flex-1 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer size={16} /> Print / Save Pass (PDF)
          </button>
          <button
            type="button"
            onClick={() => setIsPreviewModalOpen(false)}
            className="h-12 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
