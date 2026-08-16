import React, { useEffect, useState } from 'react';
import { Event, Club } from '../../types';
import Footer from '../../Footer';
import { LandingNavbar } from './LandingNavbar';
import { HeroSection } from './Sections/HeroSection';
import { StatsSection } from './Sections/StatsSection';
import { CoreGrid } from './Sections/CoreGrid';
import { EventHub } from './Sections/EventHub';
import { ProposalSection } from './Sections/ProposalSection';
import { ProposalModal } from './Modals/ProposalModal';
import { ProposalSuccessOverlay } from './Modals/ProposalSuccessOverlay';

interface Props {
  events: Event[];
  clubs: Club[];
  users?: any[];
  registrations?: any[];
  onLogin: () => void;
  onRegister: () => void;
  isDarkMode: boolean;
  onOpenDeveloper?: () => void;
  onOpenProfile?: () => void;
  onNavigate?: (page: string) => void;
  onProposeUnit?: (proposal: any) => Promise<{ success: boolean; id: string }>;
  onToggleTheme?: () => void;
}

const useCounter = (target: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const increment = Math.max(1, target / (duration / 16));
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);
  return { count, startCounting: () => setStarted(true) };
};

const LandingPage: React.FC<Props> = ({ events, clubs, users = [], registrations = [], onLogin, onRegister, isDarkMode, onOpenDeveloper, onOpenProfile, onNavigate, onProposeUnit, onToggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState<string | null>(null);
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);

  const [proposalData, setProposalData] = useState({
    type: 'Club' as 'Club' | 'Team',
    title: '',
    category: 'Technical',
    proposerName: '',
    proposerRoll: '',
    proposerEmail: '',
    missionStatement: '',
    estimatedMembers: 10
  });

  const realStudentsCount = users.length > 0 ? users.length : (registrations.length > 0 ? registrations.length : 0);
  const realClubsCount = clubs.length;
  const realEventsCount = events.length;

  const studentsCounter = useCounter(realStudentsCount);
  const clubsCounter = useCounter(realClubsCount);
  const eventsCounter = useCounter(realEventsCount);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) { studentsCounter.startCounting(); clubsCounter.startCounting(); eventsCounter.startCounting(); } }); },
      { threshold: 0.3 }
    );
    const el = document.getElementById('stats-section');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const upcomingEvents = [...events]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalData.title || !proposalData.proposerName || !proposalData.missionStatement) {
      alert("Please complete all required identity nodes.");
      return;
    }
    setIsSubmittingProposal(true);
    if (onProposeUnit) {
      const res = await onProposeUnit(proposalData);
      if (res.success) {
        setProposalSuccess(res.id);
        setIsProposalModalOpen(false);
        setProposalData({
          type: 'Club',
          title: '',
          category: 'Technical',
          proposerName: '',
          proposerRoll: '',
          proposerEmail: '',
          missionStatement: '',
          estimatedMembers: 10
        });
      }
    }
    setIsSubmittingProposal(false);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-primary selection:text-white uni-shell text-[var(--text-main)] transition-colors duration-700">
      <LandingNavbar
        isDarkMode={isDarkMode}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onLogin={onLogin}
        onRegister={onRegister}
        onNavigate={onNavigate}
        onToggleTheme={onToggleTheme}
      />

      <HeroSection onRegister={onRegister} onNavigate={onNavigate} />

      <StatsSection
        studentsCount={studentsCounter.count}
        clubsCount={clubsCounter.count}
        eventsCount={eventsCounter.count}
      />

      <CoreGrid onNavigate={onNavigate} />

      <EventHub
        isDarkMode={isDarkMode}
        upcomingEvents={upcomingEvents}
        onNavigate={onNavigate}
        onLogin={onLogin}
      />

      <ProposalSection setIsProposalModalOpen={setIsProposalModalOpen} />

      {isProposalModalOpen && (
        <ProposalModal
          setIsProposalModalOpen={setIsProposalModalOpen}
          proposalData={proposalData}
          setProposalData={setProposalData}
          isSubmittingProposal={isSubmittingProposal}
          handleProposalSubmit={handleProposalSubmit}
        />
      )}

      {proposalSuccess && (
        <ProposalSuccessOverlay
          proposalSuccess={proposalSuccess}
          setProposalSuccess={setProposalSuccess}
        />
      )}

      <Footer
        onOpenDeveloper={onOpenDeveloper || (() => { })}
        onOpenDeveloperProfile={() => onNavigate?.('developer-profile')}
        onOpenProfile={onOpenProfile}
        onNavigate={onNavigate || (() => { })}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default LandingPage;
