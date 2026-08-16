import React from 'react';
import { Applicant } from '../../types';
import { ApplicantCard } from './ApplicantCard';

interface BoardColumnProps {
  stage: Applicant['stage'];
  applicants: Applicant[];
  domains: string[];
  expandedNotes: Set<string>;
  toggleNotes: (id: string) => void;
  onUpdateDomain: (id: string, domain: string) => void;
  onAIAnalyze?: (id: string) => void;
  onMove: (id: string, stage: Applicant['stage']) => void;
  stages: Applicant['stage'][];
}

export const BoardColumn: React.FC<BoardColumnProps> = ({
  stage, applicants, domains, expandedNotes, toggleNotes, onUpdateDomain, onAIAnalyze, onMove, stages
}) => {
  const columnApplicants = applicants.filter(a => a.stage === stage);
  
  return (
    <div key={stage} className="min-w-[320px] snap-start">
      <div className="flex items-center justify-between mb-6 px-3">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A3AED0]">{stage}</span>
          <span className="bg-[var(--bg-surface)] glass text-primary text-[10px] px-2.5 py-1 rounded-full font-black border border-[var(--border-color)]">
            {columnApplicants.length}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {columnApplicants.map((applicant) => (
          <ApplicantCard 
            key={applicant.id}
            applicant={applicant}
            domains={domains}
            expandedNotes={expandedNotes}
            toggleNotes={toggleNotes}
            onUpdateDomain={onUpdateDomain}
            onAIAnalyze={onAIAnalyze}
            onMove={onMove}
            stages={stages}
            stage={stage}
          />
        ))}
      </div>
    </div>
  );
};
