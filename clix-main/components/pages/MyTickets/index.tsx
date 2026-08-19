import React, { useState, useEffect } from 'react';
import { Registration, Event, Club } from '../../../types';
import { printElementById, printEventPassHtml, printFirstAvailable } from '../../../lib/printDocument';
import { TicketsHeader } from './Sections/TicketsHeader';
import { TicketsGrid } from './Sections/TicketsGrid';
import { TicketPreviewModal } from './Modals/TicketPreviewModal';
import { HiddenPrintAnchor } from './Sections/HiddenPrintAnchor';

interface Props {
  registrations: Registration[];
  events: Event[];
  clubs: Club[];
  isDarkMode: boolean;
}

const MyTickets: React.FC<Props> = ({ registrations, events, clubs, isDarkMode }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'past'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [printReg, setPrintReg] = useState<Registration | null>(null);
  const [pendingPrintTitle, setPendingPrintTitle] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingPrintTitle || !printReg) return;
    const timer = window.setTimeout(() => {
      const evt = events.find(e => e.id === printReg.eventId);
      const clb = clubs.find(c => c.id === evt?.clubId);
      const ok = printFirstAvailable(
        ['print-ticket-area', 'event-pass-print-area'],
        pendingPrintTitle
      );
      if (!ok && evt) {
        printEventPassHtml({
          clubName: clb?.name || 'MITS Club',
          eventTitle: evt.title,
          studentName: printReg.studentName,
          ticketId: printReg.ticketId || printReg.id,
          eventDate: evt.date,
          qrData: printReg.ticketId || printReg.id,
        });
      }
      setPendingPrintTitle(null);
    }, 200);
    return () => window.clearTimeout(timer);
  }, [pendingPrintTitle, printReg, events, clubs]);

  const queuePrint = (reg: Registration) => {
    setPrintReg(reg);
    setPendingPrintTitle(`MITS Event Pass - ${reg.ticketId || reg.id}`);
  };

  const handleDownload = (reg: Registration) => {
    const evt = events.find(e => e.id === reg.eventId);
    const clb = clubs.find(c => c.id === evt?.clubId);
    (window as any).openPrintStudio?.({
      id: reg.ticketId || reg.id,
      type: 'ticket',
      title: evt?.title || 'Event Pass',
      recipientName: reg.studentName,
      recipientRoll: reg.studentRoll,
      organizationName: clb?.name || 'CodeCell MITS',
      date: evt?.date || new Date().toLocaleDateString(),
      details: { Venue: evt?.venue || 'MITS Auditorium' },
      qrCodeValue: reg.ticketId || reg.id
    });
  };

  const handlePrint = (ticketId: string) => {
    const reg = registrations.find(r => (r.ticketId || r.id) === ticketId);
    if (reg) handleDownload(reg);
  };

  const handlePreview = (reg: Registration) => {
    setSelectedReg(reg);
    setIsPreviewModalOpen(true);
  };

  const now = new Date();

  const filteredRegistrations = registrations.filter(reg => {
    const event = events.find(e => e.id === reg.eventId);
    if (!event) return true; // Show pass even if event metadata is loading

    const eventDate = new Date(event.date);
    const isPast = !isNaN(eventDate.getTime()) && eventDate < now && eventDate.toDateString() !== now.toDateString();

    if (filter === 'active' && isPast) return false;
    if (filter === 'past' && !isPast) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        event.title.toLowerCase().includes(term) ||
        (clubs.find(c => c.id === event.clubId)?.name || '').toLowerCase().includes(term) ||
        reg.ticketId?.toLowerCase().includes(term) ||
        reg.studentName?.toLowerCase().includes(term)
      );
    }

    return true;
  }).sort((a, b) => {
    const dateA = new Date(events.find(e => e.id === a.eventId)?.date || '').getTime() || 0;
    const dateB = new Date(events.find(e => e.id === b.eventId)?.date || '').getTime() || 0;
    return filter === 'past' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-10 min-h-screen">
      <TicketsHeader
        isDarkMode={isDarkMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filter={filter}
        setFilter={setFilter}
        totalCount={registrations.length}
      />

      <TicketsGrid
        filteredRegistrations={filteredRegistrations}
        events={events}
        clubs={clubs}
        isDarkMode={isDarkMode}
        filter={filter}
        handlePreview={handlePreview}
        handleDownload={handleDownload}
      />

      {isPreviewModalOpen && selectedReg && (
        <TicketPreviewModal
          selectedReg={selectedReg}
          events={events}
          clubs={clubs}
          setIsPreviewModalOpen={setIsPreviewModalOpen}
          handlePrint={handlePrint}
        />
      )}

      <HiddenPrintAnchor selectedReg={printReg || selectedReg} events={events} clubs={clubs} />
    </div>
  );
};

export default MyTickets;
