import React, { useMemo, useState, useEffect } from 'react';
import { openRazorpayCheckout } from '../../lib/razorpay';
import { Event, Club, Registration, User } from '../../types';
import { useSearchParams } from 'react-router-dom';
import { db } from '../../db';
import { printElementById } from '../../lib/printDocument';
import { copyEventRegistrationLink } from '../../lib/eventLinks';
import { formatDisplayDate, formatEventDateParts } from '../../lib/formatDate';
import { buildEventUpiString } from '../../lib/upiQr';
import { UpiAutoPaymentModal } from '../common/UpiAutoPaymentModal';
import { ClixQRCode } from '../common/ClixQRCode';
import {
  Zap,
  ArrowUpRight,
  Globe,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Share2,
  Download,
  X,
  CheckCircle2,
  Copy,
  CreditCard,
  Check,
  Search,
  Filter
} from 'lucide-react';

const CampusHeader: React.FC<{ liveCount: number; upcomingCount: number }> = ({ liveCount, upcomingCount }) => (
  <header className="uni-pill-card flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
    <div className="space-y-2 min-w-0">
      <span className="uni-badge">Campus events</span>
      <h1 className="uni-text-display">
        Discover & <span className="text-primary">register</span>
      </h1>
      <p className="uni-text-subtitle max-w-xl">
        Browse live and upcoming events from MITS clubs. Register and get your digital pass instantly.
      </p>
    </div>
    <div className="flex gap-4 shrink-0">
      <div className="uni-pill-card !p-4 text-center min-w-[88px]">
        <p className="uni-text-stat text-primary">{liveCount}</p>
        <p className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase">Today</p>
      </div>
      <div className="uni-pill-card !p-4 text-center min-w-[88px]">
        <p className="uni-text-stat">{upcomingCount}</p>
        <p className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase">Upcoming</p>
      </div>
    </div>
  </header>
);

const LiveMatrix: React.FC<any> = ({ liveEvents, clubs, savedEventIds, handleToggleSave, setSelectedEvent }) => (
  <section className="space-y-4">
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
      <h2 className="uni-text-title">Happening today</h2>
    </div>
    <div className="uni-grid-responsive sm-2 lg-3">
      {liveEvents.length > 0 ? (
        liveEvents.map((event: Event) => {
          const club = clubs.find((c: Club) => c.id === event.clubId);
          const isSaved = savedEventIds.includes(event.id);
          return (
            <article
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="uni-pill-card cursor-pointer hover:border-primary/40 transition-colors flex flex-col gap-3"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
                    {club?.name?.[0] || 'M'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-[var(--text-secondary)] truncate">{club?.name}</p>
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Live now</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    handleToggleSave(event.id);
                  }}
                  className={`p-2 rounded-full shrink-0 ${isSaved ? 'bg-primary text-white' : 'bg-[var(--primary-soft)] text-[var(--text-secondary)]'}`}
                >
                  <ShieldCheck size={18} />
                </button>
              </div>
              <h3 className="font-bold text-[var(--text-main)] line-clamp-2">{event.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] line-clamp-2 flex-1">{event.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
                <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                  <MapPin size={14} /> Campus
                </span>
                <ArrowUpRight size={18} className="text-primary" />
              </div>
            </article>
          );
        })
      ) : (
        <div className="col-span-full uni-pill-card py-12 text-center border-dashed">
          <Zap size={40} className="mx-auto mb-2 text-[var(--text-secondary)] opacity-40" />
          <p className="text-sm text-[var(--text-secondary)]">No events scheduled for today</p>
        </div>
      )}
    </div>
  </section>
);

const UpcomingEvents: React.FC<any> = ({
  upcomingEvents,
  clubs,
  savedEventIds,
  userRegistrations,
  handleToggleSave,
  setSelectedEvent,
  setShareQrEvent,
}) => (
  <section className="space-y-4">
    <div className="flex items-center gap-2">
      <Globe size={20} className="text-primary" />
      <h2 className="uni-text-title">Upcoming events</h2>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {upcomingEvents.map((event: Event) => {
        const club = clubs.find((c: Club) => c.id === event.clubId);
        const isSaved = savedEventIds.includes(event.id);
        const isRegistered = userRegistrations.some((r: Registration) => r.eventId === event.id);
        const { day, month } = formatEventDateParts(event.date);
        return (
          <article key={event.id} className="uni-pill-card flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-28 h-28 shrink-0 rounded-2xl bg-[var(--primary-soft)] border border-[var(--border-color)] flex flex-col items-center justify-center relative">
              <span className="text-xs font-bold text-[var(--text-secondary)] uppercase">{month}</span>
              <span className="text-2xl font-extrabold text-[var(--text-main)]">{day}</span>
            </div>
            <div className="flex-1 flex flex-col gap-3 min-w-0">
              <div className="flex justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-primary truncate">{club?.name}</p>
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(event)}
                    className="uni-text-title text-left hover:text-primary transition-colors line-clamp-2"
                  >
                    {event.title}
                  </button>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    title="Share registration link"
                    onClick={async e => {
                      e.stopPropagation();
                      await copyEventRegistrationLink(event.id);
                    }}
                    className="p-2 rounded-full bg-[var(--primary-soft)] text-[var(--text-secondary)] hover:text-primary"
                  >
                    <Share2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setShareQrEvent(event);
                    }}
                    className="p-2 rounded-full bg-[var(--primary-soft)] text-[var(--text-secondary)]"
                  >
                    <Globe size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleSave(event.id)}
                    className={`p-2 rounded-full ${isSaved ? 'bg-primary text-white' : 'bg-[var(--primary-soft)]'}`}
                  >
                    <ShieldCheck size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{event.description}</p>
              <div className="flex flex-wrap items-center justify-between gap-2 mt-auto">
                <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                  <CreditCard size={14} />
                  {event.type === 'Free' ? 'Free' : 'Paid'}
                </span>
                {isRegistered ? (
                  <span className="uni-pill px-3 py-1 text-xs font-semibold text-emerald-600 bg-emerald-500/10 flex items-center gap-1">
                    <Check size={14} /> Registered
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = `/register/event/${event.id}`;
                    }}
                    className="uni-pill px-4 py-2 text-sm font-semibold uni-btn-primary text-white"
                  >
                    Register
                  </button>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  </section>
);

const EventDetailModal: React.FC<any> = ({
  selectedEvent, setSelectedEvent, setShareQrEvent, user, isProxyMode, setIsProxyMode, proxyData, setProxyData, isProcessingPayment, paymentSuccess, handleRegistrationClick, clubs = [],
}) => {
  const club = clubs.find((c: Club) => c.id === selectedEvent.clubId);
  const isPaid = selectedEvent.type === 'Paid' && (selectedEvent.fee || 0) > 0;

  return (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
    <div
      className="w-full max-w-2xl uni-pill-card p-6 md:p-8 max-h-[90vh] overflow-y-auto space-y-6"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0 space-y-2">
          <span className="uni-badge">Event details</span>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-main)]">{selectedEvent.title}</h2>
        </div>
        <button type="button" onClick={() => setSelectedEvent(null)} className="p-2.5 uni-pill bg-[var(--primary-soft)] shrink-0" aria-label="Close">
          <X size={20} />
        </button>
      </div>
      <div className="flex flex-wrap gap-3 text-sm">
        <span className="uni-pill px-4 py-2 bg-[var(--primary-soft)] flex items-center gap-2 text-[var(--text-secondary)]">
          <Calendar size={16} className="text-primary" /> {formatDisplayDate(selectedEvent.date)}
        </span>
        <span className="uni-pill px-4 py-2 bg-[var(--primary-soft)] text-[var(--text-secondary)]">
          {isPaid ? `Fee: ₹${selectedEvent.fee}` : 'Free Entry'}
        </span>
      </div>
      <p className="text-[var(--text-secondary)] leading-relaxed">{selectedEvent.description}</p>
      
      {isPaid && (
        <div className="p-4 rounded-3xl bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col sm:flex-row items-center gap-5">
          <div className="shrink-0 shadow-sm">
            <ClixQRCode 
              value={buildEventUpiString({
                upiId: club?.defaultUpiQrUrl || undefined,
                payeeName: club?.name,
                amount: selectedEvent.fee,
                eventTitle: selectedEvent.title,
                subdomain: club?.subdomain,
              })} 
              size={130} 
              level="H" 
              includeMargin={true} 
            />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">Prefilled UPI QR</span>
            <p className="text-sm font-bold text-[var(--text-main)]">Scan & Pay exact ₹{selectedEvent.fee}</p>
            <p className="text-xs text-[var(--text-secondary)]">Use any UPI app (GPay, PhonePe, Paytm, BHIM) with amount locked.</p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setShareQrEvent(selectedEvent)}
        className="w-full uni-pill py-3 border border-[var(--border-color)] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[var(--primary-soft)]"
      >
        <Share2 size={18} /> Share registration link
      </button>
      <div className="pt-4 border-t border-[var(--border-color)] space-y-4">
        <label className="flex items-center justify-between gap-3 cursor-pointer">
          <span className="text-sm font-medium text-[var(--text-main)]">Register on behalf of another student</span>
          <input type="checkbox" checked={isProxyMode} onChange={() => setIsProxyMode(!isProxyMode)} className="accent-[var(--primary)] w-5 h-5" />
        </label>
        {isProxyMode ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input type="text" value={proxyData.name} onChange={e => setProxyData({ ...proxyData, name: e.target.value })} placeholder="Name" className="h-11 px-4 uni-pill border border-[var(--border-color)] bg-[var(--bg-main)] text-sm" />
            <input type="text" value={proxyData.roll} onChange={e => setProxyData({ ...proxyData, roll: e.target.value.toUpperCase() })} placeholder="Roll no." className="h-11 px-4 uni-pill border border-[var(--border-color)] bg-[var(--bg-main)] text-sm uppercase" />
            <input type="text" value={proxyData.branch} onChange={e => setProxyData({ ...proxyData, branch: e.target.value })} placeholder="Branch" className="h-11 px-4 uni-pill border border-[var(--border-color)] bg-[var(--bg-main)] text-sm" />
          </div>
        ) : (
          <div className="uni-pill p-4 bg-[var(--primary-soft)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full uni-btn-primary text-white flex items-center justify-center font-bold">{user.name[0]}</div>
            <div>
              <p className="font-semibold text-[var(--text-main)]">{user.name}</p>
              <p className="text-xs text-[var(--text-secondary)]">{user.enrollmentNumber || user.id} · {user.branch || '—'}</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={handleRegistrationClick}
          disabled={isProcessingPayment}
          className="w-full h-12 uni-pill uni-btn-primary text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isProcessingPayment ? (
            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</>
          ) : paymentSuccess ? (
            <><CheckCircle2 size={20} /> Registered</>
          ) : (
            <><ShieldCheck size={20} /> {isPaid ? `Pay ₹${selectedEvent.fee} & Confirm` : 'Confirm registration'}</>
          )}
        </button>
      </div>
    </div>
  </div>
  );
};

const SuccessTicketModal: React.FC<any> = ({ successTicket, setSuccessTicket, events, clubs, handlePrint }) => {
  const event = events.find((e: Event) => e.id === successTicket.eventId);
  const club = clubs.find((c: Club) => c.id === event?.clubId);
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-transparent/95 backdrop-blur-3xl">
      <div className="w-full max-w-4xl animate-in zoom-in-95 duration-500 relative py-20 flex flex-col items-center">
        <button onClick={() => setSuccessTicket(null)} className="absolute top-0 right-0 p-4 bg-[var(--primary-soft)] border border-[var(--border-color)] rounded-2xl text-white hover:bg-rose-500 transition-all z-10">
          <X size={24} />
        </button>

        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 uni-pill px-5 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
            <CheckCircle2 size={20} />
            Registration confirmed
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-main)]">Your event pass</h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">Show this pass at the venue or print a copy for entry.</p>
        </div>

        <div className="w-full max-w-2xl bg-white rounded-[3.5rem] p-12 text-black flex flex-col gap-10 shadow-[0_0_100px_rgba(37,99,235,0.2)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/50 pb-5 mb-5">
            <div className="flex items-center gap-4">
              {club?.logoUrl ? (
                <img src={club.logoUrl} alt={`${club.name} logo`} className="h-16 w-16 rounded-2xl object-contain bg-white border border-slate-200" />
              ) : (
                <div className="h-16 w-16 rounded-2xl bg-black text-white flex items-center justify-center text-3xl font-black">{club?.name?.[0] || 'A'}</div>
              )}
              <div>
                <div className="hindi-name">माधव प्रौद्योगिकी एवं विज्ञान संस्थान, ग्वालियर</div>
                <div className="english-name">Madhav Institute of Technology & Science, Gwalior</div>
                <div className="document-subtitle">(Deemed to be University u/s 3 of UGC Act, 1956 | NAAC A++ Grade)</div>
              </div>
            </div>
            <img src="/mitslogo.jpg" alt="MITS Logo" className="h-20 w-auto object-contain" />
          </div>
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center text-3xl font-black rounded-2xl">
                  {club?.name?.[0] || 'A'}
                </div>

                <div className="pt-8 border-t-2 border-black border-dashed grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Mission Subject</p>
                    <p className="text-2xl font-black">{event?.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Agent Identity</p>
                    <p className="text-2xl font-black">{successTicket.studentName}</p>
                  </div>
                </div>

                <div className="flex justify-between items-end border-t-2 border-black pt-8">
                  <div>
                    <p className="text-xs font-bold opacity-30 uppercase tracking-[0.2em] mb-1">Pass ID</p>
                    <p className="text-sm font-mono font-black">{successTicket.ticketId || 'Pending_Approval'}</p>
                  </div>
                  <button type="button" onClick={() => handlePrint(successTicket.ticketId || successTicket.id)} className="uni-pill px-6 py-3 uni-btn-primary text-white text-sm font-semibold flex items-center gap-2">
                    <Download size={18} /> Print pass
                  </button>
                </div>
              </div>

              <p className="mt-8 text-xs text-[var(--text-secondary)] text-center max-w-md">
                Valid with student ID at the event venue. Clix Hub digital pass.
              </p>

              <div id="print-ticket-area" className="fixed inset-0 z-[-1] opacity-0 pointer-events-none overflow-hidden">
                <div className="w-[1000px] bg-white text-black p-12 flex flex-col gap-10">
                  <div className="border-[12px] border-black p-12 rounded-[4rem] relative overflow-hidden bg-white min-h-[600px] flex flex-col justify-between">
                    <div className="absolute top-0 left-0 w-full h-10 bg-black flex items-center justify-center">
                      <p className="text-[10px] font-black uppercase text-[var(--text-main)] tracking-[1em]">MITS Institutional Entry Protocol</p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mt-10">
                      <div className="flex items-center gap-6">
                        {club?.logoUrl ? (
                          <img src={club.logoUrl} alt={`${club?.name} logo`} className="w-20 h-20 rounded-3xl object-contain bg-white border border-black p-2" />
                        ) : (
                          <div className="w-20 h-20 rounded-3xl bg-black text-white flex items-center justify-center text-5xl font-black">{club?.name?.[0] || 'M'}</div>
                        )}
                        <div>
                          <div className="hindi-name">माधव प्रौद्योगिकी एवं विज्ञान संस्थान, ग्वालियर</div>
                          <div className="english-name">Madhav Institute of Technology & Science, Gwalior</div>
                          <div className="document-subtitle">(Deemed to be University u/s 3 of UGC Act, 1956 | NAAC A++ Grade)</div>
                        </div>
                      </div>
                      <img src="/mitslogo.jpg" alt="MITS Logo" className="h-20 w-auto object-contain" />
                    </div>
                    <div className="flex justify-between items-start mt-10">
                      <div className="space-y-6">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 bg-black text-white flex items-center justify-center text-5xl font-black rounded-3xl">
                            {club?.name?.[0] || 'M'}
                          </div>
                          <div className="grid grid-cols-2 gap-16 pt-12 mt-12 border-t-4 border-black border-dashed">
                            <div>
                              <p className="text-[12px] font-black uppercase tracking-widest opacity-40">Mission Identifier</p>
                              <h3 className="text-4xl font-black tracking-tighter leading-tight">{event?.title}</h3>
                            </div>
                            <div className="space-y-4 text-right">
                              <p className="text-[12px] font-black uppercase tracking-widest opacity-40">Agent Identity</p>
                              <h3 className="text-3xl font-black tracking-tight">{successTicket.studentName}</h3>
                              <p className="font-mono text-sm font-black opacity-40">{successTicket.ticketId || successTicket.id}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShareQrModal: React.FC<any> = ({ shareQrEvent, setShareQrEvent, clubs, handleCopyLink, copiedLink }) => {
  const club = clubs.find((c: Club) => c.id === shareQrEvent.clubId);
  const shareUrl = `${window.location.origin}/register/event/${shareQrEvent.id}`;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-sm" onClick={() => setShareQrEvent(null)}>
      <div className="w-full max-w-md uni-pill-card p-8 text-center relative" onClick={e => e.stopPropagation()}>
        <button type="button" onClick={() => setShareQrEvent(null)} className="absolute top-4 right-4 p-2 uni-pill bg-[var(--primary-soft)] text-[var(--text-secondary)]" aria-label="Close">
          <X size={20} />
        </button>
        <div className="space-y-6 pt-2">
          <div className="space-y-1">
            <span className="uni-badge">Share event</span>
            <h3 className="text-xl font-bold text-[var(--text-main)] mt-2">{shareQrEvent.title}</h3>
            <p className="text-sm text-[var(--text-secondary)]">{club?.name || 'MITS club'} · scan or copy link to register</p>
          </div>
          <div className="inline-block shadow-lg">
            <ClixQRCode value={shareUrl} size={220} level="H" includeMargin={true} />
          </div>
          <div className="space-y-2 text-left">
            <p className="text-xs font-medium text-[var(--text-secondary)] ml-1">Registration link</p>
            <div className="flex gap-2 p-1.5 uni-pill bg-[var(--primary-soft)] border border-[var(--border-color)]">
              <input type="text" readOnly value={shareUrl} className="flex-1 bg-transparent px-3 outline-none text-xs text-[var(--text-main)] min-w-0" />
              <button type="button" onClick={() => handleCopyLink(shareUrl)} className="uni-pill px-4 py-2 uni-btn-primary text-white text-xs font-semibold flex items-center gap-1.5 shrink-0">
                {copiedLink ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Props {
  events: Event[];
  clubs: Club[];
  registrations: Registration[];
  onRegister: (eventId: string, proxyStudent?: { name: string, roll: string, branch: string }) => Promise<Registration | undefined>;
  isDarkMode: boolean;
  user: User;
}

const CampusEvents: React.FC<Props> = ({ events, clubs, registrations, onRegister, isDarkMode, user }) => {
  const userRegistrations = registrations.filter(r => r.studentId === user.id);
  const [savedEventIds, setSavedEventIds] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [upiPaymentEvent, setUpiPaymentEvent] = useState<Event | null>(null);
  const [shareQrEvent, setShareQrEvent] = useState<Event | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isProxyMode, setIsProxyMode] = useState(false);
  const [proxyData, setProxyData] = useState({ name: '', roll: '', branch: '' });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [successTicket, setSuccessTicket] = useState<Registration | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchSaved = async () => {
      const saved = await db.getSavedEvents(user.id);
      setSavedEventIds(saved.map(s => s.eventId));
    };
    fetchSaved();
  }, [user.id]);

  useEffect(() => {
    const joinEventId = searchParams.get('join');
    if (joinEventId && events.length > 0) {
      window.location.href = `/register/event/${joinEventId}`;
    }
  }, [searchParams, events]);

  const handleToggleSave = async (eventId: string) => {
    await db.toggleSavedEvent(user.id, eventId);
    setSavedEventIds(prev => prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]);
  };

  const handleRegistrationClick = async () => {
    if (!selectedEvent) return;
    if (isProxyMode) {
      if (!proxyData.name || !proxyData.roll || !proxyData.branch) return alert("Complete all proxy details.");
      const reg = await onRegister(selectedEvent.id, proxyData);
      if (reg) setSuccessTicket(reg);
      setProxyData({ name: '', roll: '', branch: '' });
      setIsProxyMode(false); setSelectedEvent(null);
    } else {
      const club = clubs.find(c => c.id === selectedEvent.clubId);
      const isPaidEvent = selectedEvent.type === 'Paid' && (selectedEvent.fee || 0) > 0;
      const rzpApiKey = club?.paymentGatewayConfig?.apiKey || import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (isPaidEvent) {
        // Open UPI Auto-Confirmation Modal
        setUpiPaymentEvent(selectedEvent);
      } else {
        const reg = await onRegister(selectedEvent.id);
        if (reg) setSuccessTicket(reg);
        setSelectedEvent(null);
      }
    }
  };

  const handlePrint = (ticketId: string) => {
    printElementById('print-ticket-area', `MITS Event Pass - ${ticketId}`, { width: 1000, height: 900 });
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const liveEvents = useMemo(() => events.filter(e => new Date(e.date).toDateString() === new Date().toDateString()), [events]);
  const upcomingEvents = useMemo(() => events.filter(e => new Date(e.date) > new Date() && new Date(e.date).toDateString() !== new Date().toDateString()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [events]);

  return (
    <div className="space-y-6 md:space-y-8 text-[var(--text-main)]">
      <CampusHeader liveCount={liveEvents.length} upcomingCount={upcomingEvents.length} />
      <LiveMatrix liveEvents={liveEvents} clubs={clubs} savedEventIds={savedEventIds} handleToggleSave={handleToggleSave} setSelectedEvent={setSelectedEvent} />
      <UpcomingEvents upcomingEvents={upcomingEvents} clubs={clubs} savedEventIds={savedEventIds} userRegistrations={userRegistrations} handleToggleSave={handleToggleSave} setSelectedEvent={setSelectedEvent} setShareQrEvent={setShareQrEvent} />
      {selectedEvent && <EventDetailModal selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} setShareQrEvent={setShareQrEvent} user={user} isProxyMode={isProxyMode} setIsProxyMode={setIsProxyMode} proxyData={proxyData} setProxyData={setProxyData} isProcessingPayment={isProcessingPayment} paymentSuccess={paymentSuccess} handleRegistrationClick={handleRegistrationClick} clubs={clubs} />}
      {upiPaymentEvent && (
        <UpiAutoPaymentModal
          event={upiPaymentEvent}
          club={clubs.find(c => c.id === upiPaymentEvent.clubId)}
          user={user}
          onConfirm={async (utr) => {
            const reg = await onRegister(upiPaymentEvent.id, { transactionId: utr } as any);
            if (reg) setSuccessTicket(reg);
            setUpiPaymentEvent(null);
            setSelectedEvent(null);
            return reg;
          }}
          onClose={() => setUpiPaymentEvent(null)}
        />
      )}
      {successTicket && <SuccessTicketModal successTicket={successTicket} setSuccessTicket={setSuccessTicket} events={events} clubs={clubs} handlePrint={handlePrint} />}
      {shareQrEvent && <ShareQrModal shareQrEvent={shareQrEvent} setShareQrEvent={setShareQrEvent} clubs={clubs} handleCopyLink={handleCopyLink} copiedLink={copiedLink} />}
    </div>
  );
};

export default CampusEvents;
