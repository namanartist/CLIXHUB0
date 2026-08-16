import React, { useState } from 'react';
import { Applicant, Club } from '../../types';
import { printHtmlDocument } from '../../lib/printDocument';
import {
  Shield,
  CheckCircle2,
  Clock,
  ChevronDown,
  Copy,
  Check,
  Download,
  AlertCircle,
  Activity,
  Zap,
  MoreHorizontal,
  ArrowRight,
  Briefcase
} from 'lucide-react';

const ApplicationsHeader: React.FC = () => (
  <header className="space-y-3">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Shield size={16} /></div>
      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Recruitment Intelligence</span>
    </div>
    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--text-main)] leading-none">Application <span className="text-emphasis">Tracker</span></h1>
    <p className="text-[var(--text-secondary)] font-medium">Live status of your club membership applications and recruitment pipelines.</p>
  </header>
);

const EmptyState: React.FC = () => (
  <div className="p-20 border-2 border-dashed border-[var(--border-color)] rounded-[3rem] text-center space-y-6">
    <div className="w-20 h-20 rounded-[2rem] bg-[var(--primary-soft)] flex items-center justify-center mx-auto"><Briefcase size={36} className="text-slate-600" /></div>
    <div className="space-y-2"><p className="text-xl font-black text-[var(--text-secondary)] opacity-50 uppercase tracking-widest">No Active Applications</p><p className="text-slate-600 max-w-md mx-auto text-sm">Browse the Club Registry to find organizations and begin your journey as a student leader.</p></div>
    <button className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-105 transition-all">Explore Registry</button>
  </div>
);

const ApplicationCard: React.FC<any> = ({ app, club, stages, getStageColor, getStageProgress, getStageHint, trackingId, handleCopy, copiedId, expandedId, setExpandedId, handleDownloadOffer }) => {
  const isExpanded = expandedId === app.id;
  const currentStageIdx = stages.indexOf(app.stage);

  return (
    <div className={`uni-pill-card uni-pill-card border border-[var(--border-color)] p-8 md:p-12 transition-all hover:border-primary/30 shadow-2xl relative overflow-hidden group`}>
      <div className="absolute top-0 right-0 p-12 opacity-0 group-hover:opacity-5 transition-all pointer-events-none"><Zap size={200} className="text-primary" /></div>
      <div className="relative z-10 flex flex-col gap-10">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-[var(--primary-soft)] border border-[var(--border-color)] flex items-center justify-center text-3xl font-black text-[var(--text-main)] italic shadow-2xl">{club?.name?.[0] || 'C'}</div>
            <div>
              <h3 className="text-3xl font-black text-[var(--text-main)] tracking-tighter uppercase italic">{club?.name || 'Unknown Club'}</h3>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className={`px-4 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStageColor(app.stage)}`}>{app.stage} Protocol</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">ID: {app.id.slice(0, 8)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none px-6 py-3 bg-[var(--primary-soft)] rounded-2xl border border-[var(--border-color)] flex items-center justify-between gap-4">
              <span className="text-[10px] font-mono font-bold text-[var(--text-secondary)]">{trackingId}</span>
              <button onClick={() => handleCopy(trackingId)} className="text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors">{copiedId === trackingId ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}</button>
            </div>
          </div>
        </div>

        {app.stage !== 'Rejected' ? (
          <div className="space-y-8">
            <div className="flex justify-between items-end mb-4 px-2">
              <div className="space-y-1"><p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Mission Deployment</p><p className="text-xs font-bold text-[var(--text-secondary)]">{getStageHint(app.stage)}</p></div>
              <p className="text-2xl font-black font-display text-[var(--text-main)] italic">{getStageProgress(app.stage)}%</p>
            </div>
            <div className="h-4 bg-[var(--primary-soft)] rounded-full overflow-hidden border border-[var(--border-color)] flex p-1">
              <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${getStageProgress(app.stage)}%` }} />
            </div>
            <div className="grid grid-cols-5 gap-2 px-2">
              {stages.map((s: string, i: number) => (
                <div key={s} className="flex flex-col items-center gap-3">
                  <div className={`w-3 h-3 rounded-full border-2 transition-all ${i <= currentStageIdx ? 'bg-primary border-primary shadow-[0_0_10px_#3b82f6]' : 'border-white/10 bg-transparent'}`} />
                  <span className={`text-[8px] font-black uppercase tracking-widest ${i <= currentStageIdx ? 'text-white' : 'text-slate-700'}`}>{s}</span>
                </div>
              ))}
            </div>
            {(app.stage === 'Offer' || app.stage === 'Selected') && (
              <button type="button" onClick={() => handleDownloadOffer(app.id)} className="w-full py-4 uni-pill bg-emerald-600 text-white font-semibold text-sm shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                <Download size={18} /> Download offer letter
              </button>
            )}
          </div>
        ) : (
          <div className="p-10 rounded-[2.5rem] bg-rose-500/5 border border-rose-500/10 flex flex-col sm:flex-row items-center gap-8 animate-in fade-in duration-500">
            <div className="p-4 bg-rose-500/10 rounded-2xl text-rose-500"><AlertCircle size={32} /></div>
            <div className="flex-1 text-center sm:text-left"><h4 className="text-xl font-black text-rose-500 uppercase italic tracking-tighter">Mission Terminated</h4><p className="text-sm text-[var(--text-secondary)] mt-1">{getStageHint('Rejected')}</p></div>
          </div>
        )}

        <button onClick={() => setExpandedId(isExpanded ? null : app.id)} className="w-full flex items-center justify-between pt-4 border-t border-[var(--border-color)] text-slate-600 hover:text-[var(--text-main)] transition-colors"><span className="text-[9px] font-black uppercase tracking-widest">Application Details</span><ChevronDown size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} /></button>

        {isExpanded && (
          <div className="mt-6 p-6 rounded-2xl bg-white/3 border border-[var(--border-color)] space-y-6 animate-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div><p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">Domain Applied</p><p className="text-sm font-black text-[var(--text-main)]">{app.domain}</p></div>
              <div><p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">Branch</p><p className="text-sm font-black text-[var(--text-main)]">{app.branch || 'N/A'}</p></div>
              <div><p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">Roll Number</p><p className="text-sm font-black text-[var(--text-main)]">{app.rollNumber}</p></div>
              <div><p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">Cycle</p><p className="text-sm font-black text-[var(--text-main)]">{app.recruitmentCycle || new Date().getFullYear()}</p></div>
            </div>
            <div><p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-2">Why I Want to Join</p><p className="text-sm text-[var(--text-secondary)] leading-relaxed italic">"{app.whyJoin}"</p></div>
          </div>
        )}
      </div>
    </div>
  );
};

interface Props { applicants: Applicant[]; clubs: Club[]; userName: string; isDarkMode: boolean; onUpdateStatus?: (appId: string, stage: Applicant['stage']) => void; }

const MyApplications: React.FC<Props> = ({ applicants, clubs, userName, onUpdateStatus }) => {
  const myApps = applicants.filter(a => a.name === userName);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const stages: Applicant['stage'][] = ['Applied', 'Screening', 'Interview', 'Offer', 'Selected'];

  const getStageColor = (stage: Applicant['stage']) => {
    switch (stage) {
      case 'Applied': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Screening': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Interview': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'Offer': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Selected': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Rejected': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStageHint = (stage: Applicant['stage']) => {
    switch (stage) {
      case 'Applied': return 'Identity logged in recruitment pipeline. Awaiting initial screening by club leadership.';
      case 'Screening': return 'Leadership is reviewing your intent statement and skills portfolio.';
      case 'Interview': return 'Technical and cultural rounds are being scheduled.';
      case 'Offer': return 'Congratulations! Your offer letter is being generated.';
      case 'Selected': return 'Welcome to the council! Final onboarding will begin within 48 hours.';
      case 'Rejected': return 'Feedback cycle closed. You can re-apply in the next recruitment cycle.';
      default: return 'Synchronizing status with the institutional mainframe...';
    }
  };

  const handleDownloadOffer = (appId: string) => {
    const app = applicants.find(a => a.id === appId);
    if (!app) return;
    const club = clubs.find(c => c.id === app.clubId);

    (window as any).openPrintStudio?.({
      id: app.id,
      type: 'offer_letter',
      title: `${app.domain} Domain Member`,
      recipientName: app.name,
      recipientRoll: app.rollNumber,
      organizationName: club?.name || 'Club Leadership Cell',
      date: new Date().toLocaleDateString(),
      details: { Domain: app.domain, Stage: app.stage }
    });
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <ApplicationsHeader />
      {myApps.length === 0 ? <EmptyState /> : (
        <div className="grid grid-cols-1 gap-8">
          {myApps.map((app) => (
            <ApplicationCard key={app.id} app={app} club={clubs.find(c => c.id === app.clubId)} stages={stages} getStageColor={getStageColor} getStageProgress={(stage: any) => { const idx = stages.indexOf(stage); return idx < 0 ? 0 : Math.round((idx / (stages.length - 1)) * 100); }} getStageHint={getStageHint} trackingId={`MITS-${app.clubId?.replace('club-', '').toUpperCase().slice(0, 4)}-${app.id.slice(-6).toUpperCase()}`} handleCopy={(id: any) => { navigator.clipboard.writeText(id); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); }} copiedId={copiedId} expandedId={expandedId} setExpandedId={setExpandedId} onUpdateStatus={onUpdateStatus} handleDownloadOffer={handleDownloadOffer} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
