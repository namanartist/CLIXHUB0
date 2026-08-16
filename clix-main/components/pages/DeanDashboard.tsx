import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Globe,
  CheckCircle2,
  Clock,
  Award,
  FileText,
  Calendar,
  Users,
  ArrowRight,
  AlertCircle,
  BarChart3,
  MessageSquare,
  Check,
  X,
  Zap,
  ShieldCheck,
  TrendingUp,
  Building2,
} from 'lucide-react';
import { Club, User, Role, CertificateBatch, Event } from '../../types';

interface Props {
  currentUser: User;
  clubs: Club[];
  allUsers: User[];
  events: Event[];
  batches: CertificateBatch[];
  proposals: any[];
  onApproveProposal: (id: string, comment?: string) => void;
  onRejectProposal: (id: string, comment?: string) => void;
  onApproveBatch: (batch: CertificateBatch) => void;
  onRejectBatch: (batch: CertificateBatch) => void;
  onEnterClub: (id: string) => void;
  onNavigate: (tab: string) => void;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bg: string;
  sub?: string;
}> = ({ label, value, icon: Icon, color, bg, sub }) => (
  <div className="uni-pill-card border border-[var(--border-color)] p-6 flex items-center justify-between group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
    <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none">
      <Icon size={90} />
    </div>
    <div className="relative z-10">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-1">{label}</p>
      <p className="uni-text-stat font-extrabold text-[var(--text-main)]">{value}</p>
      {sub && <p className="text-[10px] text-[var(--text-secondary)] mt-1 font-medium">{sub}</p>}
    </div>
    <div className={`w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform relative z-10`}>
      <Icon size={22} />
    </div>
  </div>
);

// ─── Hero ─────────────────────────────────────────────────────────────────────
const DeanHero: React.FC<{ user?: User }> = ({ user }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="relative rounded-[2rem] overflow-hidden uni-glass-strong border border-[var(--glass-morphism-border)] p-8 md:p-12 shadow-[var(--glass-premium-shadow)]">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="uni-bg-orb uni-bg-orb--navy" />
        <div className="uni-bg-grid" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="uni-badge uni-badge-gold flex items-center gap-2">
              <GraduationCap size={12} /> Dean of Student Affairs
            </span>
            <span className="uni-badge flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Session
            </span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">{greeting}</p>
            <h1 className="uni-text-display font-extrabold text-[var(--text-main)]">
              {user?.name || 'Dean of Student Welfare'}
            </h1>
          </div>
          <p className="uni-text-subtitle text-[var(--text-secondary)]">{today}</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="uni-pill-card border border-[var(--border-color)] px-5 py-4 text-center min-w-[90px]">
            <p className="text-[8px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-1">Role</p>
            <p className="text-xs font-black text-[var(--text-main)]">Dean</p>
          </div>
          <div className="uni-pill-card border border-[var(--border-color)] px-5 py-4 text-center min-w-[90px]">
            <p className="text-[8px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-1">Authority</p>
            <p className="text-xs font-black text-emerald-500">Institutional</p>
          </div>
        </div>
      </div>
    </header>
  );
};

// ─── Proposal Panel ──────────────────────────────────────────────────────────
const ProposalPanel: React.FC<{
  proposals: any[];
  onApprove: (id: string, comment?: string) => void;
  onReject: (id: string, comment?: string) => void;
}> = ({ proposals = [], onApprove, onReject }) => {
  const [commentMap, setCommentMap] = useState<Record<string, string>>({});
  const [activeFilter, setActiveFilter] = useState<'pending' | 'history'>('pending');

  const pending = (proposals || []).filter(p => p && p.status === 'PendingDean');
  const reviewed = (proposals || []).filter(p => p && (p.status === 'PendingSystemAdmin' || p.status === 'Approved' || p.status === 'Rejected'));

  const displayed = activeFilter === 'pending' ? pending : reviewed;

  const handlePrint = (prop: any) => {
    if ((window as any).openPrintStudio) {
      (window as any).openPrintStudio({
        type: 'offer_letter',
        title: `PROPOSAL BLUEPRINT: ${prop.title.toUpperCase()}`,
        recipientName: prop.proposerName,
        recipientEmail: prop.proposerEmail,
        clubName: prop.title,
        eventName: `Genesis Proposal (${prop.category})`,
        date: new Date(prop.timestamp || Date.now()).toLocaleDateString(),
        customFields: [
          { label: 'Application ID', value: prop.id },
          { label: 'Unit Title', value: prop.title },
          { label: 'Proposal Type', value: prop.type },
          { label: 'Proposer', value: `${prop.proposerName} (${prop.proposerRoll || 'N/A'})` },
          { label: 'Estimated Members', value: String(prop.estimatedMembers) },
          { label: 'Status', value: prop.status },
          { label: 'Dean Notes', value: prop.deanResponse || 'Pending' },
          { label: 'Mission', value: prop.missionStatement },
        ]
      });
    } else {
      window.print();
    }
  };

  return (
    <div className="uni-pill-card border border-[var(--border-color)] overflow-hidden flex flex-col justify-between">
      <div>
        <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.15em] text-[var(--text-main)]">Unit Proposals</h3>
              <p className="text-[10px] text-[var(--text-secondary)]">Dean endorsement & governance queue</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-[var(--border-color)]">
            <button
              type="button"
              onClick={() => setActiveFilter('pending')}
              className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${activeFilter === 'pending' ? 'bg-amber-500 text-black shadow' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'}`}
            >
              Pending ({pending.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('history')}
              className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${activeFilter === 'history' ? 'bg-amber-500 text-black shadow' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'}`}
            >
              History ({reviewed.length})
            </button>
          </div>
        </div>

        <div className="divide-y divide-[var(--border-color)] max-h-[480px] overflow-y-auto">
          {displayed.length === 0 ? (
            <div className="py-16 text-center">
              <CheckCircle2 size={36} className="mx-auto text-emerald-500 opacity-30 mb-3" />
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-60">
                {activeFilter === 'pending' ? 'No pending proposals in Dean queue' : 'No reviewed proposals logged'}
              </p>
            </div>
          ) : (
            displayed.map((prop: any) => (
              <div key={prop.id} className="p-5 hover:bg-[var(--primary-soft)] transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-[var(--primary-soft)] text-[var(--primary)] border border-[var(--border-color)]">
                      {prop.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                      prop.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      prop.status === 'PendingSystemAdmin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                      prop.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                      'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {prop.status === 'PendingDean' ? 'Awaiting Dean' : prop.status === 'PendingSystemAdmin' ? 'Endorsed (Awaiting Admin)' : prop.status}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-[var(--text-secondary)] font-mono">
                    {new Date(prop.timestamp || Date.now()).toLocaleDateString('en-IN')}
                  </span>
                </div>

                <div>
                  <h4 className="font-black text-[var(--text-main)] text-sm">{prop.title}</h4>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mt-1">{prop.missionStatement}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[9px] text-[var(--text-secondary)] bg-[var(--bg-main)] p-2.5 rounded-xl border border-[var(--border-color)]">
                  <div>
                    <span className="opacity-50 block font-mono text-[8px]">PROPOSER:</span>
                    <strong className="text-[var(--text-main)]">{prop.proposerName}</strong> ({prop.proposerRoll || 'N/A'})
                  </div>
                  <div>
                    <span className="opacity-50 block font-mono text-[8px]">CATEGORY / SECTOR:</span>
                    <strong className="text-[var(--text-main)]">{prop.category}</strong> · {prop.estimatedMembers} est. members
                  </div>
                </div>

                {prop.deanResponse && (
                  <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-[10px] text-emerald-400 font-medium">
                    Dean Note: {prop.deanResponse}
                  </p>
                )}

                {prop.status === 'PendingDean' && (
                  <div className="space-y-2 pt-1">
                    <input
                      type="text"
                      value={commentMap[prop.id] || ''}
                      onChange={e => setCommentMap(prev => ({ ...prev, [prop.id]: e.target.value }))}
                      placeholder="Add Dean endorsement note (e.g. Recommended for Technical Council)..."
                      className="w-full h-9 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-3 text-[10px] text-[var(--text-main)] outline-none focus:border-amber-500"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onApprove(prop.id, commentMap[prop.id])}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer"
                      >
                        <Check size={12} /> Approve & Provision Unit
                      </button>
                      <button 
                        type="button"
                        onClick={() => onReject(prop.id, commentMap[prop.id])}
                        className="px-3.5 py-2.5 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[9px] font-bold"
                      >
                        <X size={12} /> Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Certificate Approvals ───────────────────────────────────────────────────
const CertApprovalPanel: React.FC<{
  batches: CertificateBatch[];
  clubs: Club[];
  onApprove: (batch: CertificateBatch) => void;
  onReject: (batch: CertificateBatch) => void;
}> = ({ batches = [], clubs = [], onApprove, onReject }) => {
  const pending = (batches || []).filter(b => b && b.status === 'PendingDean');

  return (
    <div className="uni-pill-card border border-[var(--border-color)] overflow-hidden">
      <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <Award size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.15em] text-[var(--text-main)]">Certificate Approvals</h3>
            <p className="text-[10px] text-[var(--text-secondary)]">Batches awaiting your sign-off</p>
          </div>
        </div>
        {pending.length > 0 && (
          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20 text-[9px] font-black uppercase tracking-widest">
            {pending.length} Pending
          </span>
        )}
      </div>

      <div className="divide-y divide-[var(--border-color)]">
        {pending.length === 0 ? (
          <div className="py-12 text-center">
            <Award size={32} className="mx-auto text-purple-500 opacity-30 mb-3" />
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-50">
              No certificates pending
            </p>
          </div>
        ) : (
          pending.map(batch => {
            const club = (clubs || []).find(c => c && c.id === batch.clubId);
            const certCount = (batch.certificates || []).length;
            return (
              <div key={batch.id} className="p-5 hover:bg-[var(--primary-soft)] transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-black text-[var(--text-main)] text-sm">{club?.name || 'Unknown Club'}</p>
                    <p className="text-[9px] text-[var(--text-secondary)] font-medium mt-0.5">
                      {certCount} certificates · Created {new Date(batch.createdAt || Date.now()).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/20 text-[8px] font-black uppercase tracking-widest whitespace-nowrap">
                    Pending Dean
                  </span>
                </div>
                <p className="text-[10px] text-[var(--text-secondary)] mb-4">
                  Created by <strong className="text-[var(--text-main)]">{batch.createdBy || 'Staff'}</strong>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => onApprove(batch)}
                    className="flex-1 py-2.5 bg-[var(--primary)] text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95"
                  >
                    <ShieldCheck size={12} /> Approve Batch
                  </button>
                  <button
                    onClick={() => onReject(batch)}
                    className="px-3 py-2.5 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// ─── Clubs Overview ──────────────────────────────────────────────────────────
const ClubsOverview: React.FC<{
  clubs: Club[];
  allUsers: User[];
  onEnterClub: (id: string) => void;
}> = ({ clubs = [], allUsers = [], onEnterClub }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center">
          <Building2 size={16} />
        </div>
        <h2 className="uni-text-title text-[var(--text-main)]">All Organisations</h2>
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
        {(clubs || []).length} Total
      </span>
    </div>
    <div className="uni-grid-responsive sm-2 lg-3">
      {(clubs || []).map(club => {
        if (!club) return null;
        const president = (allUsers || []).find(u => u && u.id === club.leadership?.presidentId);
        const faculty = (allUsers || []).find(u => u && u.id === club.facultyCoordinatorId);
        const memberCount = (allUsers || []).filter(u => u && (u.clubMemberships || []).some(m => m && m.clubId === club.id)).length;
        const displayName = club.name || 'Organization';

        return (
          <div
            key={club.id}
            className="uni-pill-card border border-[var(--border-color)] p-5 group hover:-translate-y-1 hover:border-[var(--primary)]/30 transition-all duration-300 cursor-pointer"
            onClick={() => onEnterClub(club.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg shadow-md flex-shrink-0"
                style={{ backgroundColor: club.themeColor || '#2563eb' }}
              >
                {displayName[0] || 'C'}
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-[var(--primary-soft)] text-[var(--primary)]">
                {club.category || 'General'}
              </span>
            </div>
            <h4 className="font-black text-[var(--text-main)] text-sm mb-1 leading-tight">{displayName}</h4>
            <p className="text-[9px] text-[var(--text-secondary)] mb-4 truncate">{club.tagline || club.subdomain || 'Campus Organization'}</p>
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[var(--border-color)] text-[9px]">
              <div>
                <p className="text-[var(--text-secondary)] font-bold uppercase tracking-widest mb-0.5">President</p>
                <p className="font-black text-[var(--text-main)] truncate">{president?.name || (club.leadership as any)?.President || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-[var(--text-secondary)] font-bold uppercase tracking-widest mb-0.5">Faculty</p>
                <p className="font-black text-[var(--text-main)] truncate">{faculty?.name || (club.leadership as any)?.['Faculty Advisor'] || (club.facultyCoordinatorNames && club.facultyCoordinatorNames[0]) || 'Unassigned'}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[9px] font-bold text-[var(--text-secondary)]">
                <Users size={10} /> {memberCount} members
              </span>
              <ArrowRight size={14} className="text-[var(--text-secondary)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ─── Quick Actions ────────────────────────────────────────────────────────────
const QuickActions: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const actions = [
    { label: 'Protocol Approvals', desc: 'Events & Certificates', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', tab: 'approvals' },
    { label: 'Institutional KPIs', desc: 'Analytics & Reports', icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-500/10', tab: 'reports' },
    { label: 'Communication', desc: 'Messages & Broadcasts', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-500/10', tab: 'chat' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="uni-text-title text-[var(--text-main)] px-1">Quick Actions</h2>
      <div className="uni-grid-responsive sm-2 lg-3">
        {actions.map(a => (
          <button
            key={a.tab}
            onClick={() => onNavigate(a.tab)}
            className="uni-pill-card border border-[var(--border-color)] p-5 flex items-center gap-4 group hover:-translate-y-1 hover:border-[var(--primary)]/30 transition-all duration-300 text-left w-full"
          >
            <div className={`w-11 h-11 rounded-2xl ${a.bg} ${a.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
              <a.icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-[var(--text-main)] text-xs truncate">{a.label}</p>
              <p className="text-[9px] text-[var(--text-secondary)]">{a.desc}</p>
            </div>
            <ArrowRight size={14} className="text-[var(--text-secondary)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const DeanDashboard: React.FC<Props> = ({
  currentUser,
  clubs = [],
  allUsers = [],
  events = [],
  batches = [],
  proposals = [],
  onApproveProposal,
  onRejectProposal,
  onApproveBatch,
  onRejectBatch,
  onEnterClub,
  onNavigate,
}) => {
  const pendingProposals = useMemo(() => (proposals || []).filter(p => p && p.status === 'PendingDean'), [proposals]);
  const pendingBatches = useMemo(() => (batches || []).filter(b => b && b.status === 'PendingDean'), [batches]);
  const activeEvents = useMemo(() => (events || []).filter(e => e && e.status === 'Approved'), [events]);
  const totalStudents = useMemo(() => (allUsers || []).filter(u => u && u.globalRole === Role.STUDENT).length, [allUsers]);

  const stats = [
    {
      label: 'Total Organisations',
      value: (clubs || []).length,
      icon: Globe,
      color: 'text-[var(--primary)]',
      bg: 'bg-[var(--primary-soft)]',
      sub: 'Active clubs',
    },
    {
      label: 'Pending Proposals',
      value: pendingProposals.length,
      icon: FileText,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      sub: 'Awaiting your review',
    },
    {
      label: 'Cert Batches',
      value: pendingBatches.length,
      icon: Award,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      sub: 'Pending sign-off',
    },
    {
      label: 'Active Events',
      value: activeEvents.length,
      icon: Calendar,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      sub: `${totalStudents} students enrolled`,
    },
  ];

  return (
    <div className="space-y-8 pb-8 animate-in fade-in duration-500">
      {/* Hero */}
      <DeanHero user={currentUser} />

      {/* Stats */}
      <div className="uni-grid-responsive sm-2 lg-4">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActions onNavigate={onNavigate} />

      {/* Action Panels — 2 col on large */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProposalPanel proposals={proposals} onApprove={onApproveProposal} onReject={onRejectProposal} />
        <CertApprovalPanel
          batches={batches}
          clubs={clubs}
          onApprove={onApproveBatch}
          onReject={onRejectBatch}
        />
      </div>

      {/* Clubs Overview */}
      <ClubsOverview clubs={clubs} allUsers={allUsers} onEnterClub={onEnterClub} />
    </div>
  );
};

export default DeanDashboard;
