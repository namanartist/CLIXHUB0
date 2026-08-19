import React, { useState } from 'react';
import { Event, Club, CertificateBatch, Proposal, Role, User } from '../../types';
import {
  Clock,
  Award,
  Calendar,
  ShieldCheck,
  Zap,
  Check,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface OversightHeaderProps {
  activeSubTab: 'events' | 'certificates' | 'proposals';
  setActiveSubTab: (val: 'events' | 'certificates' | 'proposals') => void;
  eventCount: number;
  batchCount: number;
  proposalCount: number;
}

const OversightHeader: React.FC<OversightHeaderProps> = ({ activeSubTab, setActiveSubTab, eventCount, batchCount, proposalCount }) => (
  <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
    <div className="space-y-1">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-main)] font-display">
        Institutional <span className="text-[var(--primary)] font-black">Approvals</span>
      </h1>
      <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed max-w-xl">
        Strategic oversight, identity authentication, and sign-off on proposed campus activities.
      </p>
    </div>
    <div className="flex bg-[var(--bg-surface)] p-1 rounded-2xl border border-[var(--border-color)] overflow-x-auto w-full md:w-auto shrink-0 max-w-full">
      <button 
        onClick={() => setActiveSubTab('events')} 
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
          activeSubTab === 'events' ? 'bg-[var(--primary)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'
        }`}
      >
        <Calendar size={14} /> Events ({eventCount})
      </button>
      <button 
        onClick={() => setActiveSubTab('certificates')} 
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
          activeSubTab === 'certificates' ? 'bg-[var(--primary)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'
        }`}
      >
        <Award size={14} /> Certificates ({batchCount})
      </button>
      <button 
        onClick={() => setActiveSubTab('proposals')} 
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
          activeSubTab === 'proposals' ? 'bg-[var(--primary)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'
        }`}
      >
        <ShieldCheck size={14} /> Proposals ({proposalCount})
      </button>
    </div>
  </header>
);

interface EventApprovalsProps {
  pendingEvents: Event[];
  clubs: Club[];
  onApproveEvent: (id: string) => void;
  onRejectEvent?: (id: string) => void;
}

interface ProposalApprovalsProps {
  pendingProposals: Proposal[];
  currentUser: User | null;
  proposalComments: Record<string, string>;
  setProposalComments: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onApproveProposal: (id: string, comment?: string) => any;
  onRejectProposal?: (id: string, comment?: string) => any;
}

const ProposalApprovals: React.FC<ProposalApprovalsProps> = ({ pendingProposals, currentUser, proposalComments, setProposalComments, onApproveProposal, onRejectProposal }) => (
  <div className="grid grid-cols-1 gap-6">
    {pendingProposals.length === 0 ? (
      <div className="p-16 border-2 border-dashed border-[var(--border-color)] rounded-[2rem] text-center space-y-4">
        <ShieldCheck size={40} className="mx-auto text-[var(--text-secondary)] opacity-20" />
        <p className="text-xs font-black opacity-40 uppercase tracking-widest text-[var(--text-main)]">
          No proposals in the pipeline.
        </p>
      </div>
    ) : (
      pendingProposals.map(proposal => (
        <div key={proposal.id} className="uni-pill-card p-6 border border-[var(--border-color)] shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.25em] text-[var(--text-secondary)]">
                {proposal.type} Genesis
              </p>
              <h3 className="mt-1 text-lg font-black text-[var(--text-main)] leading-snug">{proposal.title}</h3>
            </div>
            <span className="rounded-lg bg-[var(--primary-soft)] px-3 py-1 text-[8px] font-black uppercase tracking-widest text-[var(--primary)] border border-[var(--border-color)]">
              {proposal.category}
            </span>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-[var(--text-secondary)] font-medium">
            {proposal.missionStatement}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-[9px] text-[var(--text-secondary)] font-bold">
            <span className="rounded-lg bg-[var(--bg-main)] px-3 py-1 border border-[var(--border-color)]">
              Members: {proposal.estimatedMembers}
            </span>
            <span className="rounded-lg bg-[var(--bg-main)] px-3 py-1 border border-[var(--border-color)]">
              Proposed by: {proposal.proposerName} ({proposal.proposerRoll})
            </span>
            <span className="rounded-lg bg-[var(--bg-main)] px-3 py-1 border border-[var(--border-color)]">
              Status: {proposal.status === 'PendingDean' ? 'Awaiting Dean' : 'Dean Approved'}
            </span>
          </div>
          {proposal.deanResponse && (
            <p className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-600 dark:text-emerald-400 font-medium leading-relaxed italic">
              Dean Note: "{proposal.deanResponse}"
            </p>
          )}
          <div className="mt-6 space-y-4">
            {currentUser?.globalRole === Role.DEAN && proposal.status === 'PendingDean' && (
              <div className="space-y-2">
                <label className="block text-[8px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">
                  Optional Approval Statement / Notes
                </label>
                <textarea
                  value={proposalComments[proposal.id] || ''}
                  onChange={e => setProposalComments(prev => ({ ...prev, [proposal.id]: e.target.value }))}
                  className="w-full min-h-[90px] rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] p-4 text-xs font-semibold text-[var(--text-main)] outline-none focus:border-[var(--primary)]"
                  placeholder="Share directions or context for System Administrator review..."
                />
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => onApproveProposal(proposal.id, proposalComments[proposal.id] || undefined)} 
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-[9px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-emerald-700 active:scale-95 shadow-xl shadow-emerald-500/10 cursor-pointer"
                  >
                    <CheckCircle2 size={14} /> Approve Proposal Stage
                  </button>
                  <button 
                    type="button" 
                    onClick={() => onRejectProposal?.(proposal.id, proposalComments[proposal.id] || undefined)} 
                    className="px-5 py-3.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}
            {currentUser?.globalRole === Role.SUPER_ADMIN && proposal.status === 'PendingSystemAdmin' && (
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => onApproveProposal(proposal.id)} 
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3.5 text-[9px] font-black uppercase tracking-[0.2em] text-white transition hover:opacity-90 active:scale-95 shadow-xl shadow-blue-500/10 cursor-pointer"
                >
                  <CheckCircle2 size={14} /> Finalize Creation & Setup Dashboard
                </button>
                <button 
                  type="button" 
                  onClick={() => onRejectProposal?.(proposal.id)} 
                  className="px-5 py-3.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      ))
    )}
  </div>
);

const EventApprovals: React.FC<EventApprovalsProps> = ({ pendingEvents, clubs, onApproveEvent, onRejectEvent }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {pendingEvents.length === 0 ? (
      <div className="col-span-2 p-16 border-2 border-dashed border-[var(--border-color)] rounded-[2rem] text-center space-y-4">
        <ShieldCheck size={40} className="mx-auto text-[var(--text-secondary)] opacity-20" />
        <p className="text-xs font-black opacity-40 uppercase tracking-widest text-[var(--text-main)]">
          All events authorized. Queue clear.
        </p>
      </div>
    ) : (
      pendingEvents.map(e => {
        const club = clubs.find(c => c.id === e.clubId);
        return (
          <div key={e.id} className="uni-pill-card border border-[var(--border-color)] shadow-xl relative overflow-hidden group hover:border-[var(--primary)]/35 transition-all">
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-5 transition-all pointer-events-none">
              <Zap size={100} style={{ color: club?.themeColor || 'var(--primary)' }} />
            </div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md"
                  style={{ backgroundColor: club?.themeColor || 'var(--primary)' }}
                >
                  {club?.name[0]}
                </div>
                <div>
                  <span className="text-[7px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Origin Council</span>
                  <h4 className="text-xs font-black text-[var(--text-main)] leading-tight">{club?.name}</h4>
                </div>
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
                Awaiting Review
              </span>
            </div>
            <div className="space-y-2 mb-6 relative z-10">
              <h3 className="text-base font-black tracking-tight text-[var(--text-main)] leading-snug">
                {e.title}
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed italic font-medium line-clamp-3">
                "{e.description}"
              </p>
              <div className="text-[9px] font-bold text-[var(--text-secondary)] mt-2">
                Scheduled: {new Date(e.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <div className="flex gap-3 relative z-10">
              <button 
                onClick={() => onApproveEvent(e.id)} 
                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Check size={14} /> Authorize Event
              </button>
              <button 
                onClick={() => onRejectEvent?.(e.id)}
                className="p-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all shrink-0 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        );
      })
    )}
  </div>
);

interface CertificateApprovalsProps {
  pendingBatches: CertificateBatch[];
  clubs: Club[];
  events: Event[];
  onApproveBatch: (batch: CertificateBatch) => void;
  onRejectBatch: (batch: CertificateBatch) => void;
}

const CertificateApprovals: React.FC<CertificateApprovalsProps> = ({ pendingBatches, clubs, events, onApproveBatch, onRejectBatch }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {pendingBatches.length === 0 ? (
      <div className="col-span-2 p-16 border-2 border-dashed border-[var(--border-color)] rounded-[2rem] text-center space-y-4">
        <Award size={40} className="mx-auto text-[var(--text-secondary)] opacity-20" />
        <p className="text-xs font-black opacity-40 uppercase tracking-widest text-[var(--text-main)]">
          All certificates validated. Queue empty.
        </p>
      </div>
    ) : (
      pendingBatches.map(b => {
        const club = clubs.find(c => c.id === b.clubId);
        const event = events.find(e => e.id === b.eventId);
        return (
          <div key={b.id} className="uni-pill-card border border-[var(--border-color)] shadow-xl relative overflow-hidden group hover:border-[var(--primary)]/35 transition-all">
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md"
                  style={{ backgroundColor: club?.themeColor || 'var(--primary)' }}
                >
                  {club?.name[0]}
                </div>
                <div>
                  <span className="text-[7px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Origin Council</span>
                  <h4 className="text-xs font-black text-[var(--text-main)] leading-tight">{club?.name}</h4>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[8px] font-black uppercase tracking-widest text-sky-500 bg-sky-500/10 px-3 py-1.5 rounded-full border border-sky-500/20">
                  {b.certificates.length} Recipients
                </span>
                <span className="text-[7px] font-mono text-[var(--text-secondary)] uppercase">
                  Batch: {b.id.slice(0, 8)}
                </span>
              </div>
            </div>
            <div className="space-y-2 mb-6 relative z-10">
              <h3 className="text-base font-black tracking-tight text-[var(--text-main)] leading-snug">
                Certificates for {event?.title}
              </h3>
              <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed italic border-l-2 border-[var(--border-color)] pl-3">
                Digital validation batch submitted by {b.createdBy} on {new Date(b.createdAt).toLocaleDateString()}.
              </p>
            </div>
            <div className="flex gap-3 relative z-10">
              <button 
                onClick={() => onApproveBatch(b)} 
                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-emerald-500/10"
              >
                <CheckCircle2 size={14} /> Validate & Sign
              </button>
              <button 
                onClick={() => onRejectBatch(b)} 
                className="p-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        );
      })
    )}
  </div>
);

const ProtocolNotice: React.FC = () => (
  <div className="p-5 border border-[var(--border-color)] bg-[var(--primary-soft)] rounded-2xl flex items-start gap-4 shadow-sm">
    <AlertCircle className="text-[var(--primary)] mt-0.5 shrink-0 animate-pulse" size={20} />
    <div className="space-y-1">
      <h4 className="font-black text-xs uppercase tracking-widest text-[var(--text-main)]">
        Institutional Governance Notice
      </h4>
      <p className="text-[10px] text-[var(--text-secondary)] font-medium leading-relaxed max-w-3xl">
        All approved activities are automatically published in the live campus feed. Signed certificates are cryptographically verified and anchored permanently under the verification registry.
      </p>
    </div>
  </div>
);

interface Props { 
  events: Event[]; 
  clubs: Club[]; 
  batches: CertificateBatch[]; 
  proposals?: Proposal[]; 
  currentUser: User | null; 
  onApproveEvent: (id: string) => void; 
  onRejectEvent?: (id: string) => void;
  onApproveBatch: (batch: CertificateBatch) => void; 
  onRejectBatch: (batch: CertificateBatch) => void; 
  onApproveProposal?: (proposalId: string, comment?: string) => any; 
  onRejectProposal?: (proposalId: string, comment?: string) => any;
}

const FacultyOversight: React.FC<Props> = ({ 
  events, 
  clubs, 
  batches, 
  proposals = [], 
  currentUser, 
  onApproveEvent, 
  onRejectEvent,
  onApproveBatch, 
  onRejectBatch, 
  onApproveProposal,
  onRejectProposal
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'events' | 'certificates' | 'proposals'>('events');
  const [proposalComments, setProposalComments] = useState<Record<string, string>>({});
  
  const pendingEvents = events.filter(e => e.status === 'Pending');
  
  const roleStr = String(currentUser?.globalRole || '');
  const isFaculty = roleStr === Role.FACULTY || roleStr === 'Faculty' || roleStr === 'FACULTY';
  const isDean = roleStr === Role.DEAN || roleStr === 'Dean' || roleStr === 'DEAN';
  const isSuperAdmin = roleStr === Role.SUPER_ADMIN || roleStr === 'Super Admin' || roleStr === 'SUPER_ADMIN';

  const pendingBatches = batches.filter(b => { 
    if (isFaculty) return b.status === 'PendingFaculty'; 
    if (isDean || isSuperAdmin) return b.status === 'PendingDean'; 
    return false; 
  });
  
  const pendingProposals = proposals.filter(p => {
    if (isDean) return p.status === 'PendingDean';
    if (isSuperAdmin) return p.status === 'PendingSystemAdmin' || p.status === 'PendingDean';
    return p.status === 'PendingDean'; // Fallback for inspection
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <OversightHeader 
        activeSubTab={activeSubTab} 
        setActiveSubTab={setActiveSubTab} 
        eventCount={pendingEvents.length} 
        batchCount={pendingBatches.length} 
        proposalCount={pendingProposals.length} 
      />
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center text-[var(--primary)] shrink-0">
            {activeSubTab === 'events' ? <Clock size={16} /> : activeSubTab === 'certificates' ? <Award size={16} /> : <ShieldCheck size={16} />}
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest opacity-60 text-[var(--text-main)]">
            {activeSubTab === 'events' ? `Pending Activities Queue (${pendingEvents.length})` : 
             activeSubTab === 'certificates' ? `Certificate Authentication Queue (${pendingBatches.length})` : 
             `Genesis Proposal Approvals (${pendingProposals.length})`}
          </h2>
        </div>
        {activeSubTab === 'events' ? (
          <EventApprovals pendingEvents={pendingEvents} clubs={clubs} onApproveEvent={onApproveEvent} onRejectEvent={onRejectEvent} />
        ) : activeSubTab === 'certificates' ? (
          <CertificateApprovals pendingBatches={pendingBatches} clubs={clubs} events={events} onApproveBatch={onApproveBatch} onRejectBatch={onRejectBatch} />
        ) : (
          <ProposalApprovals 
            pendingProposals={pendingProposals} 
            currentUser={currentUser} 
            proposalComments={proposalComments} 
            setProposalComments={setProposalComments} 
            onApproveProposal={onApproveProposal ?? (() => Promise.resolve())} 
            onRejectProposal={onRejectProposal}
          />
        )}
      </div>
      <ProtocolNotice />
    </div>
  );
};

export default FacultyOversight;
