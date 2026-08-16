import React, { useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Event, Club, Registration, User } from '../../types';
import { PublicLightShell } from '../ui/PublicLightShell';
import { getEventRegistrationUrl, copyEventRegistrationLink } from '../../lib/eventLinks';
import { printEventPassHtml } from '../../lib/printDocument';
import { openRazorpayCheckout } from '../../lib/razorpay';
import { buildEventUpiString } from '../../lib/upiQr';
import { UpiAutoPaymentModal } from '../common/UpiAutoPaymentModal';
import { ClixQRCode } from '../common/ClixQRCode';
import {
  Calendar,
  MapPin,
  Share2,
  Check,
  Copy,
  LogIn,
  Ticket,
  Printer,
  ArrowLeft,
  Sparkles,
  CreditCard,
} from 'lucide-react';

interface Props {
  events: Event[];
  clubs: Club[];
  registrations: Registration[];
  user: User | null;
  onRegister: (eventId: string) => Promise<Registration | undefined>;
}

const EventRegistrationPage: React.FC<Props> = ({
  events,
  clubs,
  registrations,
  user,
  onRegister,
}) => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [successReg, setSuccessReg] = useState<Registration | null>(null);

  const event = useMemo(() => events.find(e => e.id === eventId), [events, eventId]);
  const club = useMemo(
    () => (event ? clubs.find(c => c.id === event.clubId) : undefined),
    [event, clubs]
  );

  const registrationCount = useMemo(
    () => (event ? registrations.filter(r => r.eventId === event.id).length : 0),
    [registrations, event]
  );

  const eventDate = useMemo(() => (event ? new Date(event.date) : null), [event]);
  const formattedDate = eventDate
    ? eventDate.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    : '';
  const formattedTime = eventDate
    ? eventDate.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    })
    : '';
  const eventHasEnded = eventDate ? eventDate.getTime() < Date.now() : false;

  const organizers = useMemo(() => {
    if (!event) return [];
    const list: Array<{ role: string; name: string }> = [];
    if (event.eventCoordinatorName) list.push({ role: 'Event Coordinator', name: event.eventCoordinatorName });
    if (event.facultyCoordinatorName) list.push({ role: 'Faculty Coordinator', name: event.facultyCoordinatorName });
    if (list.length === 0 && club) {
      if (club.leadership?.President) list.push({ role: 'Primary Lead', name: club.leadership.President });
      if (club.leadership?.Secretary) list.push({ role: 'Event Secretary', name: club.leadership.Secretary });
      if (club.facultyCoordinatorNames?.length) list.push({ role: 'Faculty Coordinator', name: club.facultyCoordinatorNames[0] });
    }
    return list;
  }, [club, event]);

  const alreadyRegistered = useMemo(() => {
    if (!user || !event) return false;
    return registrations.some(
      r =>
        r.eventId === event.id &&
        (r.studentId === user.id || r.studentRoll === user.enrollmentNumber)
    );
  }, [registrations, event, user]);

  const [showUpiModal, setShowUpiModal] = useState(false);

  const shareUrl = eventId ? getEventRegistrationUrl(eventId) : '';

  const handleCopyLink = async () => {
    if (!eventId) return;
    const ok = await copyEventRegistrationLink(eventId);
    setCopied(ok);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegister = async () => {
    if (!event) return;
    if (!user) {
      navigate(`/auth?returnTo=${encodeURIComponent(`/register/event/${event.id}`)}`);
      return;
    }
    if (alreadyRegistered) return;

    const isPaidEvent = event.type === 'Paid' && (event.fee || 0) > 0;
    const rzpKey = club?.paymentGatewayConfig?.apiKey || import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (isPaidEvent) {
      setLoading(true);
      await openRazorpayCheckout(
        {
          key: rzpKey,
          amount: event.fee || 0,
          name: club?.name || 'MITS Gwalior Event',
          description: `Entry Pass: ${event.title}`,
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone || '9876543210',
          },
          theme: {
            color: club?.themeColor || '#2563eb',
          },
        },
        async (paymentId) => {
          const reg = await onRegister(event.id, { transactionId: paymentId });
          if (reg) setSuccessReg(reg);
          setLoading(false);
        },
        (err) => {
          setLoading(false);
          alert(`Payment Cancelled: ${err?.message || err || 'Incomplete'}`);
        }
      );
    } else {
      setLoading(true);
      try {
        const reg = await onRegister(event.id);
        if (reg) setSuccessReg(reg);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePrintPass = () => {
    if (!successReg || !event) return;
    printEventPassHtml({
      clubName: club?.name || 'MITS Club',
      eventTitle: event.title,
      studentName: successReg.studentName,
      ticketId: successReg.ticketId || successReg.id,
      eventDate: new Date(event.date).toLocaleDateString(),
      qrData: successReg.ticketId || successReg.id,
    });
  };

  if (!event) {
    return (
      <PublicLightShell>
        <div className="max-w-md mx-auto py-16 text-center space-y-4">
          <div className="uni-pill-card">
            <h1 className="uni-text-title font-bold">Event not found</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              This registration link may be invalid or expired.
            </p>
            <Link
              to="/"
              className="inline-block mt-6 uni-pill px-6 py-3 uni-btn-primary text-white text-sm font-semibold"
            >
              Go home
            </Link>
          </div>
        </div>
      </PublicLightShell>
    );
  }

  const qrUrl = successReg
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(successReg.ticketId || successReg.id)}`
    : '';

  return (
    <PublicLightShell>
      <div className="max-w-6xl mx-auto py-6 md:py-10 space-y-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="uni-pill px-4 py-2 text-sm flex items-center gap-2 border border-[var(--border-color)] bg-white text-[var(--text-secondary)] hover:text-[var(--text-main)]"
        >
          <ArrowLeft size={18} /> Back
        </button>

        {!successReg ? (
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-[2rem] border border-[var(--border-color)] bg-white shadow-lg">
                <div className="relative h-64 bg-[var(--primary-soft)]">
                  {event.bannerUrl ? (
                    <img
                      src={event.bannerUrl}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-[var(--bg-main)] flex items-center justify-center text-[var(--text-secondary)]">
                      <Calendar size={72} />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${eventHasEnded ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {eventHasEnded ? 'Event ended' : event.status === 'Approved' ? 'Open for registration' : event.status}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-white border border-white/15">
                        <Sparkles size={12} /> {club?.name || 'MITS Club'}
                      </span>
                    </div>
                    <h1 className="mt-4 text-3xl font-extrabold text-white leading-tight">{event.title}</h1>
                    <p className="mt-2 max-w-2xl text-sm text-white/80">{event.description}</p>
                  </div>
                </div>
                <div className="grid gap-4 p-6 sm:grid-cols-2">
                  <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-2">Event Date</p>
                    <p className="text-base font-bold text-[var(--text-main)]">{formattedDate}</p>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">{formattedTime}</p>
                  </div>
                  <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-2">Registrations</p>
                    <p className="text-base font-bold text-[var(--text-main)]">{registrationCount} attendees</p>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">{event.type === 'Free' ? 'Free entry' : `Fee: ₹${event.fee ?? 0}`}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <section className="uni-pill-card border border-[var(--border-color)] p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-bold text-[var(--text-main)]">Document summary / verification</h2>
                    <span className="text-xs uppercase tracking-[0.28em] text-[var(--text-secondary)]">Verified</span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">{event.description}</p>
                </section>

                <section className="uni-pill-card border border-[var(--border-color)] p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-bold text-[var(--text-main)]">Venue details</h2>
                    <div className="inline-flex items-center gap-2 rounded-full bg-[var(--bg-main)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] border border-[var(--border-color)]">
                      <MapPin size={14} /> {event.location || 'Stage Ground'}
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
                    Please arrive 10 minutes before the scheduled start time. Venue details may be updated by the organizing team.
                  </p>
                </section>

                <section className="uni-pill-card border border-[var(--border-color)] p-6">
                  <h2 className="text-xl font-bold text-[var(--text-main)]">Contact organizing team</h2>
                  <div className="mt-4 space-y-3">
                    {organizers.length > 0 ? (
                      organizers.map((organizer, idx) => (
                        <div key={idx} className="rounded-3xl bg-[var(--bg-main)] p-4 border border-[var(--border-color)]">
                          <p className="text-sm font-semibold text-[var(--text-main)]">{organizer.name}</p>
                          <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">{organizer.role}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[var(--text-secondary)]">Reach out to the club coordinator for event updates.</p>
                    )}
                  </div>
                </section>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="sticky top-6 space-y-4">
                <div className="uni-pill-card border border-[var(--border-color)] p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-secondary)]">Registration</p>
                      <h2 className="mt-2 text-2xl font-bold text-[var(--text-main)]">{event.type === 'Free' ? 'Free Event' : `₹${event.fee ?? 0}`}</h2>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-[var(--bg-main)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] border border-[var(--border-color)]">
                      {event.type === 'Free' ? 'Free' : 'Paid'}
                    </div>
                  </div>

                  {event.type === 'Paid' && (event.fee || 0) > 0 && (
                    <div className="mt-6 p-4 rounded-3xl bg-[var(--bg-main)] border border-[var(--border-color)] text-center space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Scan & Pay Exact Fee via Any UPI App</p>
                      <div className="inline-block shadow-md">
                        <ClixQRCode 
                          value={buildEventUpiString({
                            upiId: club?.defaultUpiQrUrl || undefined,
                            payeeName: club?.name,
                            amount: event.fee,
                            eventTitle: event.title,
                            subdomain: club?.subdomain,
                          })} 
                          size={180} 
                          level="H" 
                          includeMargin={true} 
                        />
                      </div>
                      <p className="text-xs font-bold text-emerald-600">Amount Prefilled: ₹{event.fee}</p>
                    </div>
                  )}

                  <div className="mt-6 space-y-3">
                    {alreadyRegistered ? (
                      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                        <Check size={16} className="inline-block mr-2" /> You are already registered.
                      </div>
                    ) : null}
                    {!user ? (
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/auth?returnTo=${encodeURIComponent(`/register/event/${event.id}`)}`)
                        }
                        className="w-full rounded-full bg-primary px-5 py-4 text-sm font-bold text-white transition-all hover:opacity-90"
                      >
                        <LogIn size={18} /> Sign in to register
                      </button>
                    ) : event.type === 'Paid' && (event.fee || 0) > 0 ? (
                      <div className="space-y-2">
                        <button
                          type="button"
                          disabled={loading || alreadyRegistered}
                          onClick={() => setShowUpiModal(true)}
                          className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 px-5 py-4 text-sm font-bold text-white transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <ShieldCheck size={18} /> Scan & Auto-Confirm UPI (₹{event.fee})
                        </button>
                        <button
                          type="button"
                          disabled={loading || alreadyRegistered}
                          onClick={handleRegister}
                          className="w-full rounded-full bg-primary px-5 py-3 text-xs font-bold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2 hover:opacity-90 cursor-pointer"
                        >
                          <CreditCard size={14} /> Pay via Razorpay Gateway
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={loading || alreadyRegistered}
                        onClick={handleRegister}
                        className="w-full rounded-full bg-primary px-5 py-4 text-sm font-bold text-white transition-all disabled:opacity-60"
                      >
                        {loading ? 'Registering…' : alreadyRegistered ? 'Already registered' : 'Register now'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="uni-pill-card border border-[var(--border-color)] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-4">Shareable link</p>
                  <div className="flex flex-col gap-3">
                    <input
                      readOnly
                      value={shareUrl}
                      aria-label="Event registration shareable link"
                      className="w-full rounded-full border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm text-[var(--text-main)]"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--text-main)] border border-[var(--border-color)] hover:bg-[var(--primary-soft)] transition-all"
                    >
                      {copied ? <><Check size={16} className="inline-block text-emerald-600" /> Copied</> : <><Copy size={16} className="inline-block" /> Copy link</>}
                    </button>
                  </div>
                </div>

                <div className="uni-pill-card border border-[var(--border-color)] p-6 text-sm text-[var(--text-secondary)]">
                  <p className="font-semibold text-[var(--text-main)] mb-2">Privacy</p>
                  <p>Discussion is private. Only registered members and organizing team can view interaction details.</p>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in">
            <div className="uni-pill-card text-center space-y-3 border-emerald-200 bg-emerald-50/50">
              <Check size={36} className="mx-auto text-emerald-600" />
              <h2 className="text-xl font-bold text-[var(--text-main)]">You're registered!</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                {successReg.status === 'Approved'
                  ? 'Your pass is ready — print or save as PDF below.'
                  : 'Registration saved. Your pass activates when payment is approved.'}
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-950 text-white shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-blue-200 bg-white/10 px-2 py-0.5 rounded">
                    OFFICIAL GATE PASS
                  </span>
                  <h3 className="mt-1 text-lg font-black text-white">{event.title}</h3>
                  <p className="text-xs text-blue-100">{club?.name}</p>
                </div>
                <div className="p-1 rounded-xl bg-white shadow-lg">
                  <ClixQRCode value={successReg.ticketId || successReg.id} size={90} level="H" />
                </div>
              </div>

              <div className="p-5 bg-slate-900 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">ATTENDEE</p>
                  <p className="font-bold text-white text-sm">{successReg.studentName}</p>
                  <p className="text-[10px] font-mono text-blue-400">{successReg.studentRoll || 'MITS STUDENT'}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">TICKET CODE</p>
                  <p className="font-mono text-xs font-bold text-emerald-400">{successReg.ticketId || successReg.id}</p>
                  <p className="text-[10px] text-slate-400">STATUS: CONFIRMED</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handlePrintPass}
                className="w-full rounded-full bg-primary px-5 py-4 text-sm font-semibold text-white transition-all hover:opacity-90"
              >
                <Printer size={18} /> Print / Save PDF
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard/tickets')}
                className="w-full rounded-full border border-[var(--border-color)] bg-white px-5 py-4 text-sm font-semibold text-[var(--text-main)]"
              >
                My tickets
              </button>
            </div>
          </div>
        )}

        {showUpiModal && event && user && (
          <UpiAutoPaymentModal
            event={event}
            club={club}
            user={user}
            onConfirm={async (utr) => {
              const reg = await onRegister(event.id, { transactionId: utr } as any);
              if (reg) setSuccessReg(reg);
              setShowUpiModal(false);
              return reg;
            }}
            onClose={() => setShowUpiModal(false)}
          />
        )}
      </div>
    </PublicLightShell>
  );
};

export default EventRegistrationPage;
