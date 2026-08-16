import React from 'react';
import { Sparkles, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Applicant } from '../../types';

interface ApplicantCardProps {
  applicant: Applicant;
  domains: string[];
  expandedNotes: Set<string>;
  toggleNotes: (id: string) => void;
  onUpdateDomain: (id: string, domain: string) => void;
  onAIAnalyze?: (id: string) => void;
  onMove: (id: string, stage: Applicant['stage']) => void;
  stages: Applicant['stage'][];
  stage: Applicant['stage'];
}

export const ApplicantCard: React.FC<ApplicantCardProps> = ({
  applicant, domains, expandedNotes, toggleNotes, onUpdateDomain, onAIAnalyze, onMove, stages, stage
}) => (
  <div key={applicant.id} className="bg-[var(--bg-surface)] glass border border-[var(--border-color)] p-6 rounded-[1.5rem] shadow-sm hover:shadow-xl transition-all group relative">
    <div className="flex justify-between items-start mb-4">
      <select 
        value={applicant.domain}
        onChange={(e) => onUpdateDomain(applicant.id, e.target.value)}
        className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase cursor-pointer outline-none border-none ${
          applicant.domain === 'Tech' ? 'bg-blue-500/10 text-blue-400' : 
          applicant.domain === 'Management' ? 'bg-orange-500/10 text-orange-400' :
          'bg-purple-500/10 text-purple-400'
        }`}
      >
        {domains.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
      <button 
        onClick={() => onAIAnalyze?.(applicant.id)}
        className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm"
        title="Analyze Candidate"
      >
        <Sparkles size={14} />
      </button>
    </div>

    <h4 className="font-black text-[var(--text-main)] text-lg mb-1">{applicant.name}</h4>
    <p className="text-[11px] text-[#A3AED0] mb-6 font-bold uppercase tracking-wider">{applicant.rollNumber} • {applicant.branch}</p>

    <div className="bg-[#0B1437] rounded-2xl p-4 mb-4 border border-[var(--border-color)]">
      <p className="text-[9px] text-[#A3AED0] font-black uppercase tracking-widest mb-2 opacity-50">Intent Statement</p>
      <p className="text-xs text-[var(--text-main)]/80 font-medium italic line-clamp-3">"{applicant.whyJoin}"</p>
    </div>

    {applicant.notes && (
      <div className="mb-4">
        <button 
          onClick={() => toggleNotes(applicant.id)}
          className="flex items-center gap-2 text-[9px] font-black text-primary uppercase tracking-widest hover:text-primary-hover transition-colors"
        >
          {expandedNotes.has(applicant.id) ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
          {expandedNotes.has(applicant.id) ? 'Hide Backend Intel' : 'Show Backend Intel'}
        </button>
        {expandedNotes.has(applicant.id) && (
          <div className="mt-2 bg-primary/5 p-3 rounded-xl border border-primary/10 animate-in fade-in slide-in-from-top-1">
            <p className="text-[10px] text-primary/80 font-medium">{applicant.notes}</p>
          </div>
        )}
      </div>
    )}
    
    <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
      <button 
        onClick={() => {
          const idx = stages.indexOf(stage);
          if (idx > 0) onMove(applicant.id, stages[idx - 1]);
        }}
        disabled={stage === 'Applied'}
        className="p-2 rounded-xl text-[var(--text-secondary)] opacity-50 hover:text-[var(--text-main)] disabled:opacity-0"
      >
        <ChevronLeft size={18} />
      </button>
      <button 
        onClick={() => {
          const idx = stages.indexOf(stage);
          const nextStage = stages[idx + 1];
          if (idx < stages.length - 1) onMove(applicant.id, nextStage);
        }}
        disabled={stage === 'Selected'}
        className="p-2 rounded-xl text-primary hover:bg-primary/10 disabled:opacity-0"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  </div>
);
