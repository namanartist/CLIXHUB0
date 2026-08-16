import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Event, Club, Registration, Applicant } from '../../types';
import {
  Zap,
  Target,
  Calendar,
  ArrowRight,
  Award,
  Briefcase,
  Ticket,
  CheckCircle2,
  Wallet,
  Share2,
  Check,
  Copy,
  ShieldAlert,
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { PageShell } from '../ui/PageShell';
import { copyEventRegistrationLink } from '../../lib/eventLinks';

const MetricGrid: React.FC<{
  registrationsCount: number;
  certCount: number;
  applicantsCount: number;
  sparkData: { val: number }[];
  isMounted: boolean;
}> = ({ registrationsCount, certCount, applicantsCount, sparkData, isMounted }) => {
  const metrics = [
    { label: 'Registrations', val: registrationsCount, icon: Target, hue: '210' },
    { label: 'Certificates', val: certCount, icon: Award, hue: '160' },
    { label: 'Applications', val: applicantsCount, icon: Briefcase, hue: '280' },
    { label: 'Status', val: 'Active', icon: Zap, hue: '45' },
  ];
  return (
    <div className="uni-grid-responsive sm-2 lg-4">
      {metrics.map((metric, i) => (
        <div key={i} className="uni-pill-card relative overflow-hidden group uni-glass-hover">
          <div className="flex justify-between items-start relative z-10 gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1">
                {metric.label}
              </p>
              <p className="uni-text-stat truncate">{metric.val}</p>
            </div>
            <div
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: `hsla(${metric.hue}, 100%, 50%, 0.12)`,
                color: `hsl(${metric.hue}, 100%, 45%)`,
              }}
            >
              <metric.icon size={20} strokeWidth={2.5} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-16 opacity-10 pointer-events-none min-w-0 min-h-0">
            {isMounted && (
              <ResponsiveContainer width="100%" height={40} minWidth={0}>
                <AreaChart data={sparkData}>
                  <Area
                    type="monotone"
                    dataKey="val"
                    stroke={`hsl(${metric.hue}, 100%, 50%)`}
                    fill={`hsl(${metric.hue}, 100%, 50%)`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

interface Props {
  user: User;
  events: Event[];
  clubs: Club[];
  certCount: number;
  onRegister?: (eventId: string) => void | Promise<unknown>;
  isDarkMode: boolean;
  registrations: Registration[];
  applicants: Applicant[];
  onNavigateTab: (tab: string) => void;
}

const GlobalStudentDashboard: React.FC<Props> = ({
  user,
  events,
  certCount,
  registrations,
  applicants,
  onNavigateTab,
}) => {
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sparkData = useMemo(
    () => [{ val: 10 }, { val: 25 }, { val: 20 }, { val: 40 }, { val: 35 }, { val: 50 }, { val: 45 }, { val: 70 }],
    []
  );

  const upcomingEvent = useMemo(() => {
    if (!events?.length) return null;
    return events
      .filter(e => new Date(e.date) > new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [events]);

  const quickActions = [
    { icon: Ticket, label: 'Tickets', tab: 'tickets', hue: '210' },
    { icon: CheckCircle2, label: 'Certificates', tab: 'my-certificates', hue: '160' },
    { icon: Wallet, label: 'Payments', tab: 'payments', hue: '280' },
    { icon: Calendar, label: 'Events', tab: 'events', hue: '45' },
    { icon: ShieldAlert, label: 'Proposals', tab: 'proposal-workflow', hue: '120' },
  ];

  if (!user) {
    return (
      <div className="p-8 text-center text-[var(--text-secondary)] animate-pulse">Loading dashboard…</div>
    );
  }

  return (
    <PageShell
      badge="Student home"
      title={
        <>
          Welcome, <span className="text-primary">{user.name.split(' ')[0]}</span>
        </>
      }
      subtitle="Your events, clubs, tickets, and certificates at MITS — all in one place."
    >
      <MetricGrid
        registrationsCount={registrations?.length || 0}
        certCount={certCount || 0}
        applicantsCount={applicants?.length || 0}
        sparkData={sparkData}
        isMounted={isMounted}
      />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
          Next event
        </h2>
        {upcomingEvent ? (
          <div className="uni-pill-card flex flex-col sm:flex-row gap-4 items-stretch sm:items-center uni-glass-hover">
            <div className="w-16 h-16 shrink-0 rounded-xl bg-primary text-white flex flex-col items-center justify-center">
              <span className="text-[9px] font-bold uppercase opacity-90">
                {new Date(upcomingEvent.date).toLocaleString('default', { month: 'short' })}
              </span>
              <span className="text-xl font-extrabold leading-none">
                {new Date(upcomingEvent.date).getDate()}
              </span>
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-base sm:text-lg font-semibold text-[var(--text-main)] line-clamp-2 leading-snug">
                {upcomingEvent.title}
              </p>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2">
                {upcomingEvent.description}
              </p>
            </div>
            <div className="flex flex-row sm:flex-col gap-2 shrink-0">
              <button
                type="button"
                onClick={() => navigate(`/register/event/${upcomingEvent.id}`)}
                className="flex-1 sm:flex-none h-11 px-4 uni-pill uni-btn-primary text-white text-sm font-semibold flex items-center justify-center gap-2"
              >
                Register <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={async () => {
                  const ok = await copyEventRegistrationLink(upcomingEvent.id);
                  setLinkCopied(ok);
                  setTimeout(() => setLinkCopied(false), 2000);
                }}
                className="h-11 px-4 uni-pill border border-[var(--border-color)] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[var(--primary-soft)]"
              >
                {linkCopied ? <Check size={16} /> : <Share2 size={16} />}
                Share
              </button>
            </div>
          </div>
        ) : (
          <div className="uni-pill-card py-10 text-center border border-dashed border-[var(--border-color)]">
            <Calendar size={36} className="mx-auto mb-2 text-[var(--text-secondary)] opacity-50" />
            <p className="text-sm text-[var(--text-secondary)]">No upcoming events</p>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
          Quick access
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(action => (
            <button
              key={action.tab}
              type="button"
              onClick={() => onNavigateTab(action.tab)}
              className="uni-pill-card flex flex-col items-center gap-3 py-5 hover:border-primary/40 hover:scale-[1.03] active:scale-[0.98] transition-all uni-glass-hover"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  background: `hsla(${action.hue}, 100%, 50%, 0.12)`,
                  color: `hsl(${action.hue}, 100%, 45%)`,
                }}
              >
                <action.icon size={22} />
              </div>
              <span className="text-[11px] font-semibold text-[var(--text-main)]">{action.label}</span>
            </button>
          ))}
        </div>
      </section>
    </PageShell>
  );
};

export default GlobalStudentDashboard;
