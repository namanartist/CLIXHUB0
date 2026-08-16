import React, { useState } from 'react';
import { Applicant, ClubRole } from '../../types';
import { BoardHeader } from './BoardHeader';
import { BoardColumn } from './BoardColumn';

interface RecruitmentBoardProps {
  applicants: Applicant[];
  onMove: (id: string, stage: Applicant['stage']) => void;
  onUpdateDomain: (id: string, domain: string) => void;
  onNewCycle?: () => void;
  onAIAnalyze?: (id: string) => void;
  clubRole: ClubRole | null;
  clubThemeColor: string;
}

const RecruitmentBoard: React.FC<RecruitmentBoardProps> = ({ 
  applicants, 
  onMove, 
  onUpdateDomain, 
  onNewCycle, 
  onAIAnalyze,
  clubRole, 
  clubThemeColor 
}) => {
  const stages: Applicant['stage'][] = ['Applied', 'Screening', 'Interview', 'Offer', 'Selected'];
  const domains = ['Tech', 'Management', 'Content', 'Social Media'];
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  
  const isPresident = clubRole === ClubRole.PRESIDENT;

  const toggleNotes = (id: string) => {
    const newSet = new Set(expandedNotes);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedNotes(newSet);
  };

  return (
    <div className="p-8">
      <BoardHeader isPresident={isPresident} onNewCycle={onNewCycle} />

      <div className="flex gap-6 overflow-x-auto pb-8 snap-x custom-scrollbar">
        {stages.map((stage) => (
          <BoardColumn 
            key={stage}
            stage={stage}
            applicants={applicants}
            domains={domains}
            expandedNotes={expandedNotes}
            toggleNotes={toggleNotes}
            onUpdateDomain={onUpdateDomain}
            onAIAnalyze={onAIAnalyze}
            onMove={onMove}
            stages={stages}
          />
        ))}
      </div>
    </div>
  );
};

export default RecruitmentBoard;
