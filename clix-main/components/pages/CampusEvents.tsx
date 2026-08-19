import React, { useMemo, useState, useEffect } from 'react';
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
  Filter,
  History,
  Award,
  Sparkles,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

/**
 * Reusable Event Banner Component with fallback styling
 */
const EventCardBanner: React.FC<{
  event: Event;
  club?: Club;
  heightClass?: string;
  isPast?: boolean;
}> = ({ event, club, heightClass = 'h-44 sm:h-48', isPast = false }) => {
  const bannerImage = event.bannerUrl || event.posterUrl || club?.bannerUrl;
  const themeColor = club?.themeColor || '#2563eb';
  const { day, month } = formatEventDateParts(event.date);

  return (
    <div className={`w-full ${heightClass} relative rounded-2xl overflow-hidden bg-slate-900 shrink-0 border border-[var(--border-color)] group`}>
      {bannerImage ? (
        <img
          src={bannerImage}
          alt={event.title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isPast ? 'grayscale-[35%] opacity-90' : ''}`}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center p-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${themeColor}dd 0%, #0f172a 100%)`
          }}
        >
          <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="text-center space-y-1 relative z-10">
            <span className="text-xs font-mono uppercase tracking-widest text-white/80 font-bold">{club?.name || 'MITS Club'}</span>
            <p className="text-base font-black text-white line-clamp-1">{event.title}</p>
          </div>
        </div>
      )}

      {/* Dark gradient overlay for badge readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* Top Left Club & Status Badges */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap z-10">
        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold tracking-wider flex items-center gap-1">
          {club?.name || 'Club'}
        </span>
        {isPast ? (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            <History size={11} /> Recap
          </span>
        ) : (
          <span className={`px-2.5 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-wider ${event.type === 'Free' ? 'bg-emerald-600/90' : 'bg-blue-600/90'}`}>
            {event.type === 'Free' ? 'Free' : `₹${event.fee || 0}`}
          </span>
        )}
      </div>

      {/* Bottom Floating Date Pill */}
      <div className="absolute bottom-3 right-3 z-10">
        <div className="px-3 py-1.5 rounded-xl bg-white/95 text-slate-900 text-center shadow-lg border border-white/40 flex items-center gap-2">
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{month}</span>
          <span className="text-sm font-black leading-none">{day}</span>
        </div>
      </div>
    </div>
  );
};

const CampusHeader: React.FC<{
  liveCount: number;
  upcomingCount: number;
  pastCount: number;
  activeFilter: 'all' | 'live' | 'upcoming' | 'past';
  setActiveFilter: (val: 'all' | 'live' | 'upcoming' | 'past') => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}> = ({ liveCount, upcomingCount, pastCount, activeFilter, setActiveFilter, searchTerm, setSearchTerm }) => (
  <header className="uni-pill-card space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
      <div className="space-y-2 min-w-0">
        <span className="uni-badge flex items-center gap-1.5 w-fit">
          <Sparkles size={12} className="text-primary" /> Campus Events & Memories
        </span>
        <h1 className="uni-text-display">
          Discover, Register & <span className="text-primary">Recalls</span>
        </h1>
        <p className="uni-text-subtitle max-w-xl">
          Browse live, upcoming events, and past event memory archives with digital passes and verifiable credentials.
        </p>
      </div>

      <div className="flex gap-2 sm:gap-3 shrink-0 flex-wrap">
        <div
          onClick={() => setActiveFilter('live')}
          className={`uni-pill-card !p-3.5 text-center min-w-[80px] cursor-pointer transition-all ${activeFilter === 'live' ? 'border-primary shadow-md shadow-primary/10' : ''}`}
        >
          <p className="uni-text-stat text-rose-500">{liveCount}</p>
          <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Live Today</p>
        </div>
        <div
          onClick={() => setActiveFilter('upcoming')}
          className={`uni-pill-card !p-3.5 text-center min-w-[80px] cursor-pointer transition-all ${activeFilter === 'upcoming' ? 'border-primary shadow-md shadow-primary/10' : ''}`}
        >
          <p className="uni-text-stat text-primary">{upcomingCount}</p>
          <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Upcoming</p>
        </div>
        <div
          onClick={() => setActiveFilter('past')}
          className={`uni-pill-card !p-3.5 text-center min-w-[80px] cursor-pointer transition-all ${activeFilter === 'past' ? 'border-primary shadow-md shadow-primary/10' : ''}`}
        >
          <p className="uni-text-stat text-amber-500">{pastCount}</p>
          <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Past Recaps</p>
        </div>
      </div>
    </div>

    {/* Filter & Search Bar */}
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[var(--border-color)]">
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] w-full sm:w-auto overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeFilter === 'all' ? 'bg-primary text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'}`}
        >
          All Events ({liveCount + upcomingCount + pastCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('live')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeFilter === 'live' ? 'bg-primary text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'}`}
        >
          Live ({liveCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('upcoming')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeFilter === 'upcoming' ? 'bg-primary text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'}`}
        >
          Upcoming ({upcomingCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('past')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeFilter === 'past' ? 'bg-primary text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'}`}
        >
          <History size={13} /> Past Recaps ({pastCount})
        </button>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by title, club, tag..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] outline-none focus:border-primary transition-all"
        />
      </div>
    </div>
  </header>
);

const LiveMatrix: React.FC<any> = ({ liveEvents, clubs, savedEventIds, handleToggleSave, setSelectedEvent }) => (
  <section className="space-y-4">
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
      <h2 className="uni-text-title flex items-center gap-2">
        Happening Today <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 font-black">Live Now</span>
      </h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {liveEvents.length > 0 ? (
        liveEvents.map((event: Event) => {
          const club = clubs.find((c: Club) => c.id === event.clubId);
          const isSaved = savedEventIds.includes(event.id);
          return (
            <article
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="uni-pill-card cursor-pointer hover:border-primary/50 transition-all flex flex-col gap-4 group"
            >
              {/* Event Visual Banner */}
              <EventCardBanner event={event} club={club} heightClass="h-44" />

              <div className="space-y-2 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-base text-[var(--text-main)] group-hover:text-primary transition-colors line-clamp-1">
                    {event.title}
                  </h3>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      handleToggleSave(event.id);
                    }}
                    className={`p-2 rounded-full shrink-0 ${isSaved ? 'bg-primary text-white' : 'bg-[var(--primary-soft)] text-[var(--text-secondary)]'}`}
                    title="Save event"
                  >
                    <ShieldCheck size={16} />
                  </button>
                </div>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed flex-1">
                  {event.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin size={13} className="text-primary" /> {event.venue || 'MITS Main Campus'}
                  </span>
                  <span className="text-primary font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Enter <ArrowUpRight size={15} />
                  </span>
                </div>
              </div>
            </article>
          );
        })
      ) : (
        <div className="col-span-full uni-pill-card py-12 text-center border-dashed">
          <Zap size={40} className="mx-auto mb-2 text-[var(--text-secondary)] opacity-40" />
          <p className="text-sm text-[var(--text-secondary)] font-medium">No events happening today. Browse upcoming events below.</p>
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
      <h2 className="uni-text-title">Upcoming Events</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {upcomingEvents.map((event: Event) => {
        const club = clubs.find((c: Club) => c.id === event.clubId);
        const isSaved = savedEventIds.includes(event.id);
        const isRegistered = userRegistrations.some((r: Registration) => r.eventId === event.id);

        return (
          <article
            key={event.id}
            onClick={() => setSelectedEvent(event)}
            className="uni-pill-card flex flex-col gap-4 cursor-pointer hover:border-primary/50 transition-all group"
          >
            {/* Visual Event Banner */}
            <EventCardBanner event={event} club={club} heightClass="h-44" />

            <div className="flex-1 flex flex-col gap-3">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-primary uppercase tracking-wider truncate">{club?.name || 'MITS Institutional'}</p>
                  <h3 className="text-base font-bold text-[var(--text-main)] group-hover:text-primary transition-colors line-clamp-1">
                    {event.title}
                  </h3>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    title="Share event"
                    onClick={e => {
                      e.stopPropagation();
                      setShareQrEvent(event);
                    }}
                    className="p-2 rounded-full bg-[var(--primary-soft)] text-[var(--text-secondary)] hover:text-primary"
                  >
                    <Share2 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      handleToggleSave(event.id);
                    }}
                    className={`p-2 rounded-full ${isSaved ? 'bg-primary text-white' : 'bg-[var(--primary-soft)] text-[var(--text-secondary)]'}`}
                  >
                    <ShieldCheck size={15} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed flex-1">
                {event.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
                <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1 font-medium">
                  <MapPin size={13} className="text-primary" /> {event.venue || 'MITS Auditorium'}
                </span>
                {isRegistered ? (
                  <span className="uni-pill px-3 py-1 text-xs font-semibold text-emerald-600 bg-emerald-500/10 flex items-center gap-1">
                    <Check size={13} /> Registered
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      window.location.href = `/register/event/${event.id}`;
                    }}
                    className="uni-pill px-4 py-1.5 text-xs font-bold uni-btn-primary text-white shadow-sm"
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

/**
 * Dedicated Past Events Recalls & Memories Component
 */
const PastEventsRecap: React.FC<{
  pastEvents: Event[];
  clubs: Club[];
  registrations: Registration[];
  setSelectedEvent: (e: Event) => void;
}> = ({ pastEvents, clubs, registrations, setSelectedEvent }) => (
  <section className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <History size={20} className="text-amber-500" />
        <h2 className="uni-text-title">Past Events & Memory Recalls</h2>
      </div>
      <span className="text-xs font-mono text-[var(--text-secondary)]">{pastEvents.length} Concluded Events</span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pastEvents.map((event: Event) => {
        const club = clubs.find((c: Club) => c.id === event.clubId);
        const attendeeCount = registrations.filter(r => r.eventId === event.id).length;

        return (
          <article
            key={event.id}
            onClick={() => setSelectedEvent(event)}
            className="uni-pill-card flex flex-col gap-4 cursor-pointer hover:border-amber-500/40 transition-all group"
          >
            {/* Visual Event Banner for Past Event */}
            <EventCardBanner event={event} club={club} heightClass="h-44" isPast={true} />

            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider">{club?.name || 'MITS Campus Event'}</span>
                <span className="text-[10px] font-mono font-bold text-[var(--text-secondary)] flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-500" /> Concluded
                </span>
              </div>

              <h3 className="text-base font-bold text-[var(--text-main)] group-hover:text-amber-500 transition-colors line-clamp-1">
                {event.title}
              </h3>

              <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed flex-1">
                {event.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)]">
                <span className="font-semibold text-[var(--text-main)]">
                  {attendeeCount > 0 ? `${attendeeCount} Attendees` : 'Verified Event'}
                </span>
                <span className="text-amber-500 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  View Recap <ArrowUpRight size={14} />
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  </section>
);

const EventDetailModal: React.FC<any> = ({
  selectedEvent,
  setSelectedEvent,
  setShareQrEvent,
  user,
  isProxyMode,
  setIsProxyMode,
  proxyData,
  setProxyData,
  isProcessingPayment,
  paymentSuccess,
  handleRegistrationClick,
  clubs = [],
}) => {
  const club = clubs.find((c: Club) => c.id === selectedEvent.clubId);
  const isPaid = selectedEvent.type === 'Paid' && (selectedEvent.fee || 0) > 0;
  const isPast = new Date(selectedEvent.date) < new Date() && new Date(selectedEvent.date).toDateString() !== new Date().toDateString();
  const bannerImage = selectedEvent.bannerUrl || selectedEvent.posterUrl || club?.bannerUrl;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 bg-black/70 backdrop-blur-md" onClick={() => setSelectedEvent(null)}>
      <div
        className="w-full max-w-2xl uni-pill-card p-0 max-h-[92vh] overflow-y-auto space-y-0 shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Banner with Gradient */}
        <div className="h-56 sm:h-64 w-full relative overflow-hidden bg-slate-900">
          {bannerImage ? (
            <img src={bannerImage} alt={selectedEvent.title} className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center p-8 text-center"
              style={{
                background: `linear-gradient(135deg, ${club?.themeColor || '#2563eb'} 0%, #0f172a 100%)`
              }}
            >
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-white/80 font-bold">{club?.name}</span>
                <h3 className="text-2xl font-black text-white">{selectedEvent.title}</h3>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={() => setSelectedEvent(null)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 backdrop-blur text-white hover:bg-black/80 transition-all z-10 cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Bottom Title on Banner */}
          <div className="absolute bottom-4 left-6 right-6 space-y-1 z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-0.5 rounded-full bg-white/20 backdrop-blur text-white text-[10px] font-black uppercase tracking-wider">
                {club?.name || 'MITS Club'}
              </span>
              {isPast && (
                <span className="px-3 py-0.5 rounded-full bg-amber-500/80 text-white text-[10px] font-black uppercase tracking-wider">
                  Past Event Recap
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{selectedEvent.title}</h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="uni-pill px-4 py-2 bg-[var(--primary-soft)] flex items-center gap-2 text-[var(--text-secondary)] font-semibold">
              <Calendar size={16} className="text-primary" /> {formatDisplayDate(selectedEvent.date)}
            </span>
            <span className="uni-pill px-4 py-2 bg-[var(--primary-soft)] flex items-center gap-2 text-[var(--text-secondary)] font-semibold">
              <MapPin size={16} className="text-primary" /> {selectedEvent.venue || 'MITS Main Campus'}
            </span>
            <span className="uni-pill px-4 py-2 bg-[var(--primary-soft)] text-[var(--text-secondary)] font-semibold">
              {isPaid ? `Fee: ₹${selectedEvent.fee}` : 'Free Entry'}
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Event Details & Agenda</h4>
            <p className="text-sm text-[var(--text-main)] leading-relaxed">{selectedEvent.description}</p>
          </div>

          {isPaid && !isPast && (
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
            className="w-full uni-pill py-3 border border-[var(--border-color)] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[var(--primary-soft)] cursor-pointer"
          >
            <Share2 size={18} /> Share event link
          </button>

          {!isPast ? (
            <div className="pt-4 border-t border-[var(--border-color)] space-y-4">
              <label className="flex items-center justify-between gap-3 cursor-pointer">
                <span className="text-sm font-medium text-[var(--text-main)]">Register on behalf of another student</span>
                <input type="checkbox" checked={isProxyMode} onChange={() => setIsProxyMode(!isProxyMode)} className="accent-[var(--primary)] w-5 h-5 cursor-pointer" />
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
                className="w-full h-12 uni-pill uni-btn-primary text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer shadow-lg shadow-blue-500/20"
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
          ) : (
            <div className="pt-4 border-t border-[var(--border-color)] text-center p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
              This event concluded on {formatDisplayDate(selectedEvent.date)}. Check your Certificates dashboard if you participated!
            </div>
          )}
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
        <button onClick={() => setSuccessTicket(null)} className="absolute top-0 right-0 p-4 bg-[var(--primary-soft)] border border-[var(--border-color)] rounded-2xl text-white hover:bg-rose-500 transition-all z-10 cursor-pointer">
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
                  <button type="button" onClick={() => handlePrint(successTicket.ticketId || successTicket.id)} className="uni-pill px-6 py-3 uni-btn-primary text-white text-sm font-semibold flex items-center gap-2 cursor-pointer">
                    <Download size={18} /> Print pass
                  </button>
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
        <button type="button" onClick={() => setShareQrEvent(null)} className="absolute top-4 right-4 p-2 uni-pill bg-[var(--primary-soft)] text-[var(--text-secondary)] cursor-pointer" aria-label="Close">
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
              <button type="button" onClick={() => handleCopyLink(shareUrl)} className="uni-pill px-4 py-2 uni-btn-primary text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer">
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
  const [activeFilter, setActiveFilter] = useState<'all' | 'live' | 'upcoming' | 'past'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchSaved = async () => {
      const saved = await db.getSavedEvents(user.id);
      setSavedEventIds(Array.isArray(saved) ? saved.map((s: any) => typeof s === 'string' ? s : s?.eventId || '') : []);
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
      const isPaidEvent = selectedEvent.type === 'Paid' && (selectedEvent.fee || 0) > 0;

      if (isPaidEvent) {
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

  // Filter events by search term
  const searchedEvents = useMemo(() => {
    if (!searchTerm.trim()) return events;
    const term = searchTerm.toLowerCase();
    return events.filter(e => {
      const club = clubs.find(c => c.id === e.clubId);
      return (
        e.title.toLowerCase().includes(term) ||
        (e.description || '').toLowerCase().includes(term) ||
        (club?.name || '').toLowerCase().includes(term) ||
        (e.venue || '').toLowerCase().includes(term) ||
        (e.tags || []).some(t => t.toLowerCase().includes(term))
      );
    });
  }, [events, clubs, searchTerm]);

  // Partition events into Live Today, Upcoming, and Past Recaps
  const liveEvents = useMemo(() => searchedEvents.filter(e => {
    if (!e.date) return false;
    const d = new Date(e.date);
    return !isNaN(d.getTime()) && d.toDateString() === new Date().toDateString();
  }), [searchedEvents]);
  
  const upcomingEvents = useMemo(() => searchedEvents.filter(e => {
    if (!e.date) return true;
    const d = new Date(e.date);
    if (isNaN(d.getTime())) return true;
    return d.getTime() >= Date.now() && d.toDateString() !== new Date().toDateString();
  }).sort((a, b) => new Date(a.date || '').getTime() - new Date(b.date || '').getTime()), [searchedEvents]);

  const pastEvents = useMemo(() => searchedEvents.filter(e => {
    if (!e.date) return false;
    const d = new Date(e.date);
    if (isNaN(d.getTime())) return false;
    return d.getTime() < Date.now() && d.toDateString() !== new Date().toDateString();
  }).sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime()), [searchedEvents]);

  return (
    <div className="space-y-8 md:space-y-10 text-[var(--text-main)]">
      <CampusHeader
        liveCount={liveEvents.length}
        upcomingCount={upcomingEvents.length}
        pastCount={pastEvents.length}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {(activeFilter === 'all' || activeFilter === 'live') && (
        liveEvents.length > 0 ? (
          <LiveMatrix
            liveEvents={liveEvents}
            clubs={clubs}
            savedEventIds={savedEventIds}
            handleToggleSave={handleToggleSave}
            setSelectedEvent={setSelectedEvent}
          />
        ) : activeFilter === 'live' ? (
          <div className="uni-pill-card py-16 text-center border-dashed">
            <Zap size={40} className="mx-auto mb-2 text-[var(--text-secondary)] opacity-40" />
            <p className="font-bold text-[var(--text-main)]">No Live Events Scheduled For Today</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Switch to "Upcoming" or "All Events" to view upcoming schedules.</p>
          </div>
        ) : null
      )}

      {(activeFilter === 'all' || activeFilter === 'upcoming') && (
        upcomingEvents.length > 0 ? (
          <UpcomingEvents
            upcomingEvents={upcomingEvents}
            clubs={clubs}
            savedEventIds={savedEventIds}
            userRegistrations={userRegistrations}
            handleToggleSave={handleToggleSave}
            setSelectedEvent={setSelectedEvent}
            setShareQrEvent={setShareQrEvent}
          />
        ) : activeFilter === 'upcoming' ? (
          <div className="uni-pill-card py-16 text-center border-dashed">
            <Globe size={40} className="mx-auto mb-2 text-primary opacity-40" />
            <p className="font-bold text-[var(--text-main)]">No Upcoming Events Found</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Check back soon or browse the past event recaps.</p>
          </div>
        ) : null
      )}

      {(activeFilter === 'all' || activeFilter === 'past') && (
        pastEvents.length > 0 ? (
          <PastEventsRecap
            pastEvents={pastEvents}
            clubs={clubs}
            registrations={registrations}
            setSelectedEvent={setSelectedEvent}
          />
        ) : activeFilter === 'past' ? (
          <div className="uni-pill-card py-16 text-center border-dashed">
            <History size={40} className="mx-auto mb-2 text-amber-500 opacity-40" />
            <p className="font-bold text-[var(--text-main)]">No Past Event Recaps Found</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Concluded events will appear here automatically.</p>
          </div>
        ) : null
      )}

      {selectedEvent && (
        <EventDetailModal
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          setShareQrEvent={setShareQrEvent}
          user={user}
          isProxyMode={isProxyMode}
          setIsProxyMode={setIsProxyMode}
          proxyData={proxyData}
          setProxyData={setProxyData}
          isProcessingPayment={isProcessingPayment}
          paymentSuccess={paymentSuccess}
          handleRegistrationClick={handleRegistrationClick}
          clubs={clubs}
        />
      )}

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

      {successTicket && (
        <SuccessTicketModal
          successTicket={successTicket}
          setSuccessTicket={setSuccessTicket}
          events={events}
          clubs={clubs}
          handlePrint={handlePrint}
        />
      )}

      {shareQrEvent && (
        <ShareQrModal
          shareQrEvent={shareQrEvent}
          setShareQrEvent={setShareQrEvent}
          clubs={clubs}
          handleCopyLink={handleCopyLink}
          copiedLink={copiedLink}
        />
      )}
    </div>
  );
};

export default CampusEvents;
