import React, { useState, useEffect, useMemo } from 'react';
import { Event, Registration, User, Venue } from '../../types';
import { db } from '../../db';
import { printElementById } from '../../lib/printDocument';
import { ClixQRCode } from '../common/ClixQRCode';
import {
  Calendar,
  Search,
  Activity,
  Plus,
  CheckCircle2,
  X,
  ShieldCheck,
  MoreHorizontal,
  MoreVertical,
  ArrowLeft,
  ArrowRight,
  Download,
  Trash2,
  Clock,
  MapPin,
  Zap,
  UserPlus,
  Printer,
  Send,
  AlertCircle,
  Eye,
  Filter,
  Users,
  Edit3,
  IndianRupee,
  Sparkles
} from 'lucide-react';

const EventMetrics: React.FC<any> = ({ total, approved, pending, attendance }) => {
  const metrics = [
    { label: 'Total Operations', value: total, icon: Activity, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Verified Nodes', value: approved, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'In Queue', value: pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Pulse Sync', value: `${attendance}%`, icon: Zap, color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((m, i) => (
        <div key={i} className="uni-pill-card p-8 uni-pill-card border border-[var(--border-color)] flex items-center justify-between group transition-all hover:border-blue-500/30">
          <div><p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#A3AED0] mb-2">{m.label}</p><p className="text-3xl font-black text-[var(--text-main)] tracking-tighter italic">{m.value}</p></div>
          <div className={`w-12 h-12 rounded-2xl ${m.bg} ${m.color} flex items-center justify-center group-hover:scale-110 transition-transform`}><m.icon size={22} /></div>
        </div>
      ))}
    </div>
  );
};

const EventCard: React.FC<any> = ({ event, registrationCount, setSelectedEvent, handleDelete, handleEdit }) => (
  <div onClick={() => setSelectedEvent(event)} className="uni-pill-card border border-[var(--border-color)] rounded-[2rem] p-8 group relative cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[350px]">
    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-all pointer-events-none"><Calendar size={150} className="text-primary" /></div>
    <div className="space-y-6 relative z-10">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${event.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>{event.status}</div>
          {event.type === 'Paid' ? (
            <div className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/10 text-blue-500 border border-blue-500/20">₹{event.fee || 0}</div>
          ) : (
            <div className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Free</div>
          )}
        </div>
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
          <button 
            aria-label="Edit event" 
            onClick={(e) => { e.stopPropagation(); handleEdit(event); }} 
            className="w-8 h-8 rounded-lg bg-[var(--bg-main)] text-[var(--text-secondary)] flex items-center justify-center hover:text-primary hover:bg-primary/10 transition-all"
            title="Edit event"
          >
            <Edit3 size={15} />
          </button>
          <button 
            aria-label="Delete event" 
            onClick={(e) => handleDelete(e, event.id)} 
            className="w-8 h-8 rounded-lg bg-[var(--bg-main)] text-[var(--text-secondary)] flex items-center justify-center hover:text-rose-500 hover:bg-rose-500/10 transition-all"
            title="Delete event"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-2xl font-extrabold tracking-tight text-[var(--text-main)] group-hover:text-primary transition-colors">{event.title}</h3>
        <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed line-clamp-3">{event.description}</p>
      </div>
    </div>
    <div className="relative z-10 pt-6 border-t border-[var(--border-color)] flex flex-col gap-4">
      <div className="flex items-center gap-2"><Calendar size={14} className="text-primary" /><span className="text-xs font-bold text-[var(--text-secondary)]">{new Date(event.date).toLocaleDateString()}</span></div>
      <div className="flex items-center gap-2"><Users size={14} className="text-primary" /><span className="text-xs font-bold text-[var(--text-secondary)]">{registrationCount} Attendees</span></div>
      {event.venue && (
        <div className="flex items-center gap-2"><MapPin size={14} className="text-primary" /><span className="text-xs font-bold text-[var(--text-secondary)]">{event.venue}</span></div>
      )}
      {event.eventCoordinatorName && (
        <div className="flex items-center gap-2"><Users size={14} className="text-primary" /><span className="text-xs font-bold text-[var(--text-secondary)]">Lead: {event.eventCoordinatorName}</span></div>
      )}
      {event.facultyCoordinatorName && (
        <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-primary" /><span className="text-xs font-bold text-[var(--text-secondary)]">Faculty: {event.facultyCoordinatorName}</span></div>
      )}
    </div>
    <div className="w-10 h-10 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all"><ArrowRight size={18} /></div>
  </div>
);

const EventListView: React.FC<any> = ({ events, registrations, setIsModalOpen, setSelectedEvent, handleDelete, handleEdit, handleCreateNew }) => (
  <div className="p-6 md:p-10 max-w-[1700px] mx-auto space-y-10 animate-in fade-in duration-700">
    <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Calendar size={20} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-main)]">Event Management</h1>
        </div>
        <p className="text-sm text-[var(--text-secondary)] max-w-xl">
          Create and manage organizational events, configure free or paid UPI ticketing, track attendees, and distribute passes.
        </p>
      </div>
      <button onClick={handleCreateNew} className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2">
        <Plus size={18} /> Create Event
      </button>
    </header>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {events.map(event => (
        <EventCard 
          key={event.id} 
          event={event} 
          registrationCount={registrations.filter(r => r.eventId === event.id).length} 
          setSelectedEvent={setSelectedEvent} 
          handleDelete={handleDelete} 
          handleEdit={handleEdit} 
        />
      ))}
    </div>
  </div>
);

const EventDetailView: React.FC<any> = ({ selectedEvent, setSelectedEvent, filteredRegs, participantSearch, setParticipantSearch, openTicketView, handleGenerateTicket, handleMassGenerate, setIsAddParticipantOpen, handleEdit }) => (
  <div className="p-6 md:p-10 max-w-[1700px] mx-auto space-y-8 animate-in slide-in-from-right-10 duration-500">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <button aria-label="Back to events" onClick={() => setSelectedEvent(null)} className="w-10 h-10 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--primary-soft)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-main)]"><ArrowLeft size={20} /></button>
        <div>
          <h2 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">{selectedEvent.title}</h2>
        </div>
      </div>
      <button 
        type="button" 
        onClick={() => handleEdit(selectedEvent)} 
        className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-md"
      >
        <Edit3 size={15} /> Edit Event
      </button>
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-1 space-y-6">
        <section className="uni-pill-card p-8 uni-pill-card border border-[var(--border-color)] space-y-6 shadow-sm">
          <div className="w-full h-40 rounded-2xl bg-[var(--primary-soft)] border border-[var(--border-color)] flex items-center justify-center relative overflow-hidden">
            {selectedEvent.posterUrl || selectedEvent.bannerUrl ? (
              <img src={selectedEvent.posterUrl || selectedEvent.bannerUrl} alt={selectedEvent.title} className="w-full h-full object-cover" />
            ) : (
              <h4 className="text-5xl font-black text-primary opacity-20 uppercase">{selectedEvent.title[0]}</h4>
            )}
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">Event Details</h3>
            <p className="text-sm text-[var(--text-main)] leading-relaxed">{selectedEvent.description}</p>
            <div className="grid grid-cols-1 gap-3 pt-4 border-t border-[var(--border-color)]">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">Status</p>
                  <p className="text-sm font-bold text-emerald-500">{selectedEvent.status}</p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">Entry Fee</p>
                  <p className="text-sm font-bold text-[var(--text-main)]">{selectedEvent.type === 'Free' ? 'Free Access' : `₹${selectedEvent.fee}`}</p>
                </div>
              </div>
              {selectedEvent.eventCoordinatorName && (
                <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">Event Coordinator</p>
                  <p className="text-sm font-bold text-[var(--text-main)]">{selectedEvent.eventCoordinatorName}</p>
                </div>
              )}
              {selectedEvent.facultyCoordinatorName && (
                <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">Faculty Coordinator</p>
                  <p className="text-sm font-bold text-[var(--text-main)]">{selectedEvent.facultyCoordinatorName}</p>
                </div>
              )}
            </div>
          </div>
          <button onClick={() => setIsAddParticipantOpen(true)} className="w-full py-4 bg-[var(--text-main)] text-[var(--bg-main)] rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl"><UserPlus size={16} /> Add Attendee</button>
        </section>
      </div>
      <div className="xl:col-span-2 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[var(--text-main)] tracking-tight">Attendees List</h3>
            <p className="text-xs font-medium text-[var(--text-secondary)]">{filteredRegs.length} registered attendees.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
              <input value={participantSearch} onChange={e => setParticipantSearch(e.target.value)} placeholder="Search attendees..." className="w-full pl-10 pr-4 py-3 uni-pill-card border border-[var(--border-color)] rounded-xl outline-none focus:border-primary text-sm font-medium text-[var(--text-main)] transition-colors" />
            </div>
            <button onClick={handleMassGenerate} className="px-5 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-sm hover:-translate-y-0.5 transition-transform flex items-center gap-2"><Zap size={16} /> Generate Tickets</button>
          </div>
        </div>
        <div className="uni-pill-card uni-pill-card border border-[var(--border-color)] overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-[var(--bg-main)]/50 border-b border-[var(--border-color)]">
              <tr className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                <th className="px-8 py-4">Attendee Name</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Ticket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredRegs.map((reg: Registration) => (
                <tr key={reg.id} className="hover:bg-[var(--primary-soft)] transition-colors group">
                  <td className="px-8 py-4">
                    <div>
                      <p className="font-bold text-[var(--text-main)] text-sm">{reg.studentName}</p>
                      <p className="text-xs font-medium text-[var(--text-secondary)]">{reg.studentRoll}</p>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    {reg.status === 'Pending' ?
                      <button onClick={() => handleGenerateTicket(reg)} className="px-3 py-1.5 bg-amber-500/10 text-amber-500 rounded-lg text-xs font-bold border border-amber-500/20 hover:bg-amber-600 hover:text-white transition-colors">Approve</button> :
                      <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5 w-fit"><ShieldCheck size={14} /> Approved</span>}
                  </td>
                  <td className="px-8 py-4 text-right">
                    {reg.ticketId ?
                      <button aria-label="View ticket" onClick={() => openTicketView(reg)} className="ml-auto p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-primary hover:bg-primary hover:text-white transition-colors"><Printer size={16} /></button> :
                      <p className="text-xs font-medium text-[var(--text-secondary)]">Not Generated</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

const AddParticipantModal: React.FC<any> = ({
  isOpen,
  onClose,
  newParticipant,
  setNewParticipant,
  onSubmit,
  studentSearch,
  setStudentSearch,
  existingStudents = [],
  selectedExistingStudent,
  setSelectedExistingStudent,
}) => {
  const filteredStudents = useMemo(() => {
    const query = (studentSearch || '').trim().toLowerCase();
    if (!query) return existingStudents.slice(0, 5);
    return existingStudents.filter((student: any) =>
      [student.name, student.roll, student.branch, student.email].some(
        val => val?.toLowerCase().includes(query)
      )
    );
  }, [existingStudents, studentSearch]);

  const handleSelectStudent = (student: any) => {
    setSelectedExistingStudent(student);
    setNewParticipant({
      name: student.name || '',
      roll: student.roll || student.enrollmentNo || '',
      branch: student.branch || student.department || '',
    });
  };

  const handleRollChange = (rollVal: string) => {
    const formattedRoll = rollVal.toUpperCase();
    setNewParticipant({ ...newParticipant, roll: formattedRoll });

    // Automatically fetch participant details if enrollment number matches student directory
    const matched = existingStudents.find((s: any) => 
      (s.roll && s.roll.toUpperCase() === formattedRoll) ||
      (s.enrollmentNo && s.enrollmentNo.toUpperCase() === formattedRoll) ||
      (s.id && s.id.toUpperCase() === formattedRoll)
    );

    if (matched) {
      setSelectedExistingStudent(matched);
      setNewParticipant({
        name: matched.name || newParticipant.name,
        roll: formattedRoll,
        branch: matched.branch || matched.department || newParticipant.branch,
      });
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative max-w-2xl w-full bg-[var(--bg-surface)] uni-pill-card border border-[var(--border-color)] p-8 sm:p-10 shadow-2xl animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">Add Attendee</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Enter enrollment number or search student to auto-fetch details.</p>
          </div>
          <button aria-label="Close attendee modal" onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--bg-main)] transition-colors text-[var(--text-secondary)]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Student Search & Quick Select */}
          <div className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="student-search" className="text-xs font-bold text-[var(--text-secondary)] ml-2 flex items-center gap-1.5">
                <Search size={14} className="text-primary" /> Auto-Search Student Directory
              </label>
              <input
                id="student-search"
                type="text"
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                className="w-full px-6 py-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)] outline-none focus:border-primary text-sm font-medium text-[var(--text-main)] transition-colors"
                placeholder="Type name, enrollment number (e.g. 0901CS211045), or branch"
              />
            </div>

            {selectedExistingStudent ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-600">Auto-Fetched Participant</span>
                  </div>
                  <p className="text-sm font-bold text-[var(--text-main)]">{selectedExistingStudent.name} ({selectedExistingStudent.roll})</p>
                  <p className="text-xs text-[var(--text-secondary)]">{selectedExistingStudent.branch} · Verified MITS Account</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedExistingStudent(null)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-[var(--text-main)] border border-[var(--border-color)] transition-colors"
                >
                  Change
                </button>
              </div>
            ) : filteredStudents.length > 0 ? (
              <div className="grid gap-2 max-h-48 overflow-y-auto pr-1">
                {filteredStudents.map((student: any) => (
                  <button
                    type="button"
                    key={student.id || student.roll}
                    onClick={() => handleSelectStudent(student)}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] hover:border-primary/50 hover:bg-primary/5 text-left transition-all group"
                  >
                    <div>
                      <p className="text-sm font-bold text-[var(--text-main)] group-hover:text-primary transition-colors">{student.name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{student.branch || 'Department of Engineering'}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-[11px] font-mono font-bold text-primary">
                      {student.roll || student.enrollmentNo}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="pt-2 border-t border-[var(--border-color)] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-2">
              <label htmlFor="attendee-roll" className="text-xs font-bold text-[var(--text-secondary)] ml-2">Enrollment Number</label>
              <input
                id="attendee-roll"
                type="text"
                required
                value={newParticipant.roll}
                onChange={e => handleRollChange(e.target.value)}
                className="w-full px-6 py-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)] outline-none focus:border-primary text-sm font-medium text-[var(--text-main)] transition-colors font-mono"
                placeholder="e.g. 0901CS211045"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="attendee-name" className="text-xs font-bold text-[var(--text-secondary)] ml-2">Full Name</label>
              <input
                id="attendee-name"
                type="text"
                required
                value={newParticipant.name}
                onChange={e => setNewParticipant({ ...newParticipant, name: e.target.value })}
                className="w-full px-6 py-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)] outline-none focus:border-primary text-sm font-medium text-[var(--text-main)] transition-colors"
                placeholder="Full Name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="attendee-department" className="text-xs font-bold text-[var(--text-secondary)] ml-2">Department / Branch</label>
              <input
                id="attendee-department"
                type="text"
                required
                value={newParticipant.branch}
                onChange={e => setNewParticipant({ ...newParticipant, branch: e.target.value })}
                className="w-full px-6 py-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)] outline-none focus:border-primary text-sm font-medium text-[var(--text-main)] transition-colors"
                placeholder="e.g. Computer Science & Engineering"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-2 bg-primary text-white rounded-2xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={18} /> Confirm & Issue Attendee Ticket
          </button>
        </form>
      </div>
    </div>
  ) : null;
};

const TicketModal: React.FC<any> = ({ isOpen, onClose, ticketData, selectedEvent }) => (
  isOpen && ticketData ? (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="relative max-w-md w-full animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
        <div id="print-ticket-area" className="rounded-[2rem] overflow-hidden shadow-2xl relative bg-[var(--bg-surface)] border border-[var(--border-color)] p-10 text-center space-y-8">
          <div className="flex justify-center"><div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-3xl">{selectedEvent?.title?.[0]}</div></div>
          <div className="space-y-2"><h2 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">{selectedEvent?.title}</h2><p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Entry Ticket</p></div>
          <div className="inline-block shadow-sm">
            <ClixQRCode value={ticketData?.ticketId || ticketData?.id || 'TKT-VALID'} size={160} level="H" />
          </div>
          <div className="space-y-1"><p className="text-xl font-bold text-[var(--text-main)]">{ticketData.studentName}</p><p className="text-xs font-medium text-[var(--text-secondary)] uppercase">{ticketData.studentRoll}</p></div>
          <div className="pt-6 border-t border-dashed border-[var(--border-color)]"><p className="font-mono text-sm font-bold text-[var(--text-main)] tracking-wider">{ticketData?.ticketId || ticketData?.id}</p></div>
        </div>
        <div className="mt-6 flex gap-4"><button type="button" onClick={() => printElementById('print-ticket-area', `Event Ticket - ${ticketData?.ticketId || ticketData?.id || ''}`)} className="flex-1 py-4 uni-pill uni-btn-primary text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2"><Printer size={16} /> Print Ticket</button><button type="button" onClick={onClose} className="px-8 py-4 uni-pill bg-[var(--bg-main)] text-[var(--text-secondary)] font-bold text-sm border border-[var(--border-color)] hover:text-[var(--text-main)]">Close</button></div>
      </div>
    </div>
  ) : null
);

const CreateEventModal: React.FC<any> = ({ isOpen, onClose, newEvent, setNewEvent, onSubmit, isDirectApprovalEnabled, isEditing, venues, events, students, faculty }: { isOpen: boolean; onClose: () => void; newEvent: Partial<Event>; setNewEvent: (event: Partial<Event>) => void; onSubmit: (e: React.FormEvent) => void; isDirectApprovalEnabled?: boolean; isEditing?: boolean; venues: Venue[]; events: Event[]; students: User[]; faculty: User[]; }) => {
  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setNewEvent({ ...newEvent, posterUrl: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const quickFeePresets = [50, 100, 150, 200, 250, 500];

  return isOpen ? (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative max-w-4xl w-full bg-[var(--bg-surface)] uni-pill-card border border-[var(--border-color)] p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[95vh] custom-scrollbar">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
          <div>
            <h3 className="text-3xl font-bold text-[var(--text-main)] tracking-tight">
              {isEditing ? 'Edit Event' : 'Create Event'}
            </h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-2xl">
              {isEditing 
                ? 'Update event title, schedule, venue allocation, ticketing rules, and prizes.' 
                : 'Set up a complete event with title, schedule, venue, registration limits, and perks. All details help attendees make informed decisions.'}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close create event modal" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-secondary)] hover:bg-[var(--bg-main)] transition-colors flex-shrink-0"><X size={20} /></button>
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Event Basics</h4>
            <div className="space-y-2">
              <label htmlFor="event-title" className="text-xs font-bold text-[var(--text-secondary)] ml-2">Event Title *</label>
              <input
                id="event-title"
                type="text"
                required
                value={newEvent.title || ''}
                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] px-6 py-4 text-sm font-medium text-[var(--text-main)] outline-none transition-colors focus:border-primary"
                placeholder="e.g. HackMITS 2026 National Hackathon"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="event-description" className="text-xs font-bold text-[var(--text-secondary)] ml-2">Description / Summary *</label>
              <textarea
                id="event-description"
                required
                value={newEvent.description || ''}
                onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                className="w-full min-h-[120px] rounded-[1.75rem] border border-[var(--border-color)] bg-[var(--bg-main)] px-6 py-4 text-sm font-medium text-[var(--text-main)] outline-none transition-colors focus:border-primary resize-none"
                placeholder="Event details, rules, guidelines, eligibility, and what participants should know..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Schedule</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="event-date" className="text-xs font-bold text-[var(--text-secondary)] ml-2">Date *</label>
                <input
                  id="event-date"
                  type="date"
                  required
                  value={newEvent.date ? newEvent.date.split('T')[0] : ''}
                  onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] px-6 py-4 text-sm font-medium text-[var(--text-main)] outline-none transition-colors focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="event-start-time" className="text-xs font-bold text-[var(--text-secondary)] ml-2">Start Time</label>
                <input
                  id="event-start-time"
                  type="time"
                  value={newEvent.startDateTime?.split('T')?.[1]?.substring(0, 5) || ''}
                  onChange={e => {
                    const date = newEvent.date || new Date().toISOString().split('T')[0];
                    setNewEvent({ ...newEvent, startDateTime: `${date}T${e.target.value}` });
                  }}
                  className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] px-6 py-4 text-sm font-medium text-[var(--text-main)] outline-none transition-colors focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="event-end-date" className="text-xs font-bold text-[var(--text-secondary)] ml-2">End Date</label>
                <input
                  id="event-end-date"
                  type="date"
                  value={newEvent.endDateTime?.split('T')?.[0] || ''}
                  onChange={e => {
                    const time = newEvent.endDateTime?.split('T')?.[1]?.substring(0, 5) || '23:59';
                    setNewEvent({ ...newEvent, endDateTime: `${e.target.value}T${time}` });
                  }}
                  className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] px-6 py-4 text-sm font-medium text-[var(--text-main)] outline-none transition-colors focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="event-end-time" className="text-xs font-bold text-[var(--text-secondary)] ml-2">End Time</label>
                <input
                  id="event-end-time"
                  type="time"
                  value={newEvent.endDateTime?.split('T')?.[1]?.substring(0, 5) || ''}
                  onChange={e => {
                    const date = newEvent.endDateTime?.split('T')?.[0] || newEvent.date || new Date().toISOString().split('T')[0];
                    setNewEvent({ ...newEvent, endDateTime: `${date}T${e.target.value}` });
                  }}
                  className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] px-6 py-4 text-sm font-medium text-[var(--text-main)] outline-none transition-colors focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Venue & Capacity</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="event-venue" className="text-xs font-bold text-[var(--text-secondary)] ml-2">Select Venue</label>
                <select
                  id="event-venue"
                  value={newEvent.venueId || ''}
                  onChange={e => {
                    const selected = venues.find(v => v.id === e.target.value);
                    setNewEvent({
                      ...newEvent,
                      venueId: e.target.value,
                      venue: selected?.name || ''
                    });
                  }}
                  className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] px-6 py-4 text-sm font-medium text-[var(--text-main)] outline-none transition-colors focus:border-primary"
                >
                  <option value="">Choose a managed venue</option>
                  {venues.map(venue => (
                    <option key={venue.id} value={venue.id}>{venue.name} — {venue.location || 'Campus'} ({venue.capacity || 'n/a'} seats)</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="event-max-registrations" className="text-xs font-bold text-[var(--text-secondary)] ml-2">Max Registrations</label>
                <input
                  id="event-max-registrations"
                  type="number"
                  min="1"
                  value={newEvent.maxRegistrations || ''}
                  onChange={e => setNewEvent({ ...newEvent, maxRegistrations: Number(e.target.value) || undefined })}
                  className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] px-6 py-4 text-sm font-medium text-[var(--text-main)] outline-none transition-colors focus:border-primary"
                  placeholder="e.g. 200"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="event-venue-details" className="text-xs font-bold text-[var(--text-secondary)] ml-2">Venue Details</label>
              <textarea
                id="event-venue-details"
                value={newEvent.venueDetails || ''}
                onChange={e => setNewEvent({ ...newEvent, venueDetails: e.target.value })}
                className="w-full min-h-[80px] rounded-[1.75rem] border border-[var(--border-color)] bg-[var(--bg-main)] px-6 py-4 text-sm font-medium text-[var(--text-main)] outline-none transition-colors focus:border-primary resize-none"
                placeholder="e.g. Confirmed venue for the event. Please arrive 15 mins early."
              />
            </div>
            <div className="space-y-4 p-6 rounded-[2rem] border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)]">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="event-venue-allocation" className="text-xs font-bold text-[var(--text-secondary)] ml-2">Venue Allocation Request</label>
                  <select
                    id="event-venue-allocation"
                    value={newEvent.venueAllocationRequestedTo}
                    onChange={e => setNewEvent({ ...newEvent, venueAllocationRequestedTo: e.target.value as 'Dean' | 'Faculty' | 'None' })}
                    className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] px-6 py-4 text-sm font-medium text-[var(--text-main)] outline-none transition-colors focus:border-primary"
                  >
                    <option value="Dean">Request from Dean</option>
                    <option value="Faculty">Request from Faculty</option>
                    <option value="None">Manage internally</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--text-secondary)]">Allocation Status</p>
                  <p className="rounded-3xl px-6 py-4 bg-slate-900/70 text-sm font-medium text-slate-300">{newEvent.venueAllocationRequestedTo === 'Dean' ? 'Dean approval pending' : newEvent.venueAllocationRequestedTo === 'Faculty' ? 'Faculty approval pending' : 'Internal venue processing'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Team & Oversight</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="event-coordinator" className="text-xs font-bold text-[var(--text-secondary)] ml-2">Event Coordinator</label>
                <select
                  id="event-coordinator"
                  value={newEvent.eventCoordinatorId || ''}
                  onChange={e => {
                    const selected = students.find(u => u.id === e.target.value);
                    setNewEvent({
                      ...newEvent,
                      eventCoordinatorId: e.target.value,
                      eventCoordinatorName: selected?.name || ''
                    });
                  }}
                  className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] px-6 py-4 text-sm font-medium text-[var(--text-main)] outline-none transition-colors focus:border-primary"
                >
                  <option value="">Choose coordinator</option>
                  {students.map(user => (
                    <option key={user.id} value={user.id}>{user.name} • {user.enrollmentNumber || user.department}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="event-faculty" className="text-xs font-bold text-[var(--text-secondary)] ml-2">Faculty Coordinator</label>
                <select
                  id="event-faculty"
                  value={newEvent.facultyCoordinatorId || ''}
                  onChange={e => {
                    const selected = faculty.find(u => u.id === e.target.value);
                    setNewEvent({
                      ...newEvent,
                      facultyCoordinatorId: e.target.value,
                      facultyCoordinatorName: selected?.name || ''
                    });
                  }}
                  className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] px-6 py-4 text-sm font-medium text-[var(--text-main)] outline-none transition-colors focus:border-primary"
                >
                  <option value="">Choose faculty coordinator</option>
                  {faculty.map(user => (
                    <option key={user.id} value={user.id}>{user.name} • {user.designation || user.department}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">Assign a dedicated student lead and faculty advisor for this event to streamline approvals, logistics, and finance coordination.</p>
          </div>

          <div className="space-y-4 p-6 rounded-[2rem] border border-[var(--border-color)] bg-[var(--bg-main)]/50">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] flex items-center gap-2">
                <IndianRupee size={16} className="text-primary" /> Registration & Pricing
              </h4>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${newEvent.type === 'Paid' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                {newEvent.type === 'Paid' ? 'UPI Paid Pass' : 'Free Entry'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)]">
              <button
                type="button"
                onClick={() => setNewEvent({ ...newEvent, type: 'Free', fee: 0 })}
                className={`py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${newEvent.type !== 'Paid' ? 'bg-primary text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'}`}
              >
                <CheckCircle2 size={16} /> Free Event
              </button>
              <button
                type="button"
                onClick={() => setNewEvent({ ...newEvent, type: 'Paid', fee: newEvent.fee && newEvent.fee > 0 ? newEvent.fee : 100 })}
                className={`py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${newEvent.type === 'Paid' ? 'bg-primary text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'}`}
              >
                <IndianRupee size={16} /> Paid Event (UPI)
              </button>
            </div>

            {newEvent.type === 'Paid' && (
              <div className="space-y-4 pt-3 border-t border-[var(--border-color)] animate-in fade-in">
                <div className="space-y-2">
                  <label htmlFor="event-fee" className="text-xs font-bold text-[var(--text-main)] flex items-center justify-between">
                    <span>Registration Fee Amount (₹) *</span>
                    <span className="text-xs font-mono text-emerald-500 font-black">₹{newEvent.fee || 0}</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-base text-[var(--text-secondary)]">₹</span>
                    <input
                      id="event-fee"
                      type="number"
                      min="1"
                      required
                      value={newEvent.fee !== undefined ? newEvent.fee : ''}
                      onChange={e => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        setNewEvent({ ...newEvent, fee: val, type: 'Paid' });
                      }}
                      className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] pl-12 pr-6 py-4 text-base font-bold text-[var(--text-main)] outline-none transition-colors focus:border-primary"
                      placeholder="e.g. 150"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[11px] font-medium text-[var(--text-secondary)]">Quick Fee Selection:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickFeePresets.map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setNewEvent({ ...newEvent, fee: preset, type: 'Paid' })}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${newEvent.fee === preset ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm' : 'bg-[var(--bg-main)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-primary'}`}
                      >
                        ₹{preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                  <Sparkles size={18} className="text-emerald-500 shrink-0" />
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    A dynamic NPCI UPI QR code with auto-confirmation and pre-locked fee of <strong>₹{newEvent.fee || 0}</strong> will be generated for attendees.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Perks & Benefits</h4>
            <textarea
              id="event-perks"
              value={newEvent.perks || ''}
              onChange={e => setNewEvent({ ...newEvent, perks: e.target.value })}
              className="w-full min-h-[100px] rounded-[1.75rem] border border-[var(--border-color)] bg-[var(--bg-main)] px-6 py-4 text-sm font-medium text-[var(--text-main)] outline-none transition-colors focus:border-primary resize-none"
              placeholder="e.g. Prizes: 1st-10000, 2nd-5000, 3rd-2500 | Prize Pool: ₹17500 | Certificates provided"
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Media</h4>
            <div className="space-y-2">
              <label htmlFor="event-poster" className="text-xs font-bold text-[var(--text-secondary)] ml-2">Poster Image (Upload)</label>
              <div className="relative">
                <input
                  id="event-poster"
                  type="file"
                  accept="image/*"
                  onChange={handlePosterUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full"
                />
                <div className="w-full rounded-3xl border-2 border-dashed border-[var(--border-color)] bg-[var(--bg-main)] px-6 py-8 text-center cursor-pointer hover:border-primary transition-colors">
                  {newEvent.posterUrl ? (
                    <div className="space-y-2">
                      <img src={newEvent.posterUrl} alt="Poster preview" className="h-32 mx-auto rounded-2xl object-cover" />
                      <p className="text-xs text-[var(--text-secondary)] font-medium">Click to change poster</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Calendar size={32} className="mx-auto text-[var(--text-secondary)]" />
                      <p className="text-sm font-medium text-[var(--text-main)]">Upload Poster Image</p>
                      <p className="text-xs text-[var(--text-secondary)]">Click or drag image here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[var(--border-color)] bg-[var(--bg-main)] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">Approval</p>
                <h4 className="mt-2 text-lg font-bold text-[var(--text-main)]">Publishing status</h4>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] border border-white/10">
                {isEditing ? 'Live Update' : isDirectApprovalEnabled ? 'Instant publish' : 'Approval required'}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              {isEditing 
                ? 'Saving changes will instantly update event information, schedule, and pricing across the university portal.'
                : 'Events submitted here will follow the club approval workflow. Add accurate details so approval happens faster and attendees can register with confidence.'}
            </p>
          </div>

          <button
            type="submit"
            className={`w-full rounded-[1.5rem] py-4 text-sm font-bold text-white transition-all ${isEditing ? 'bg-primary hover:bg-[var(--primary-dark)]' : isDirectApprovalEnabled ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-primary hover:bg-[var(--primary-dark)]'} shadow-xl flex items-center justify-center gap-2`}
          >
            {isEditing ? <><CheckCircle2 size={18} /> Save Event Changes</> : isDirectApprovalEnabled ? <><ShieldCheck size={18} /> Publish Event</> : <><Send size={18} /> Submit for Approval</>}
          </button>
        </form>
      </div>
    </div>
  ) : null;
};

interface Props { events: Event[]; registrations: Registration[]; venues: Venue[]; onCreateEvent: (event: Event) => Promise<void>; onDeleteEvent?: (eventId: string) => Promise<void>; onRegister: (eventId: string, proxyStudent?: { name: string, roll: string, branch: string }) => void; onUpdateRegistration: (reg: Registration) => void; isDarkMode: boolean; isDirectApprovalEnabled?: boolean; clubId: string; }

const EventOperations: React.FC<Props> = ({ events, registrations, venues, onCreateEvent, onDeleteEvent, onRegister, onUpdateRegistration, isDirectApprovalEnabled = false, clubId }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketData, setTicketData] = useState<Registration | null>(null);
  const [participantSearch, setParticipantSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [existingStudents, setExistingStudents] = useState<User[]>([]);
  const [selectedExistingStudent, setSelectedExistingStudent] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    description: '',
    type: 'Free',
    fee: 0,
    date: '',
    startDateTime: '',
    endDateTime: '',
    venue: '',
    venueId: '',
    maxRegistrations: undefined,
    perks: '',
    venueDetails: '',
    venueAllocationRequestedTo: 'Dean',
    eventCoordinatorId: '',
    eventCoordinatorName: '',
    facultyCoordinatorId: '',
    facultyCoordinatorName: '',
    status: 'Pending',
    bannerUrl: '',
    posterUrl: '',
  });
  const [newParticipant, setNewParticipant] = useState({ name: '', roll: '', branch: '' });

  useEffect(() => {
    let active = true;
    db.getUsers().then(users => {
      if (!active) return;
      setAllUsers(users);
      setExistingStudents(users.map(u => ({
        ...u,
        roll: u.enrollmentNo || u.rollNo || u.id,
        branch: u.department || u.branch || 'Engineering'
      })));
    }).catch(() => {
      if (!active) return;
    });
    return () => { active = false; };
  }, []);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setNewEvent({
      title: '',
      description: '',
      type: 'Free',
      fee: 0,
      date: new Date().toISOString().split('T')[0],
      startDateTime: '',
      endDateTime: '',
      venue: '',
      venueId: '',
      maxRegistrations: undefined,
      perks: '',
      venueDetails: '',
      venueAllocationRequestedTo: 'Dean',
      eventCoordinatorId: '',
      eventCoordinatorName: '',
      facultyCoordinatorId: '',
      facultyCoordinatorName: '',
      status: 'Pending',
      bannerUrl: '',
      posterUrl: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: Event) => {
    setEditingEvent(event);
    setNewEvent({
      ...event,
      fee: event.fee || 0,
      type: event.type || (event.fee && event.fee > 0 ? 'Paid' : 'Free'),
      date: event.date ? event.date.split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isPaid = newEvent.type === 'Paid' || (Number(newEvent.fee) > 0);
    const feeVal = isPaid ? Math.max(0, Number(newEvent.fee) || 0) : 0;
    const finalDate = newEvent.date || newEvent.startDateTime?.split('T')[0] || new Date().toISOString().split('T')[0];

    if (editingEvent) {
      const updatedEvent: Event = {
        ...editingEvent,
        ...newEvent,
        id: editingEvent.id,
        clubId: editingEvent.clubId || clubId,
        title: newEvent.title || editingEvent.title,
        description: newEvent.description || editingEvent.description,
        type: isPaid ? 'Paid' : 'Free',
        fee: feeVal,
        date: finalDate,
        startDateTime: newEvent.startDateTime || editingEvent.startDateTime,
        endDateTime: newEvent.endDateTime || editingEvent.endDateTime,
        venueId: newEvent.venueId || editingEvent.venueId,
        venue: newEvent.venue || editingEvent.venue,
        maxRegistrations: newEvent.maxRegistrations,
        perks: newEvent.perks,
        venueDetails: newEvent.venueDetails,
        venueAllocationRequestedTo: newEvent.venueAllocationRequestedTo || editingEvent.venueAllocationRequestedTo || 'Dean',
        eventCoordinatorId: newEvent.eventCoordinatorId,
        eventCoordinatorName: newEvent.eventCoordinatorName,
        facultyCoordinatorId: newEvent.facultyCoordinatorId,
        facultyCoordinatorName: newEvent.facultyCoordinatorName,
        bannerUrl: newEvent.bannerUrl || editingEvent.bannerUrl || '',
        posterUrl: newEvent.posterUrl || editingEvent.posterUrl,
        status: editingEvent.status || (isDirectApprovalEnabled ? 'Approved' : 'Pending'),
        isFinalized: editingEvent.isFinalized || false,
      };

      await onCreateEvent(updatedEvent);
      if (selectedEvent?.id === editingEvent.id) {
        setSelectedEvent(updatedEvent);
      }
    } else {
      const event: Event = {
        id: `evt-${Date.now()}`,
        clubId,
        title: newEvent.title!,
        description: newEvent.description!,
        type: isPaid ? 'Paid' : 'Free',
        fee: feeVal,
        status: isDirectApprovalEnabled ? 'Approved' : 'Pending',
        date: finalDate,
        startDateTime: newEvent.startDateTime,
        endDateTime: newEvent.endDateTime,
        venueId: newEvent.venueId,
        venue: newEvent.venue,
        maxRegistrations: newEvent.maxRegistrations,
        perks: newEvent.perks,
        venueDetails: newEvent.venueDetails,
        venueAllocationRequestedTo: newEvent.venueAllocationRequestedTo || 'Dean',
        eventCoordinatorId: newEvent.eventCoordinatorId,
        eventCoordinatorName: newEvent.eventCoordinatorName,
        facultyCoordinatorId: newEvent.facultyCoordinatorId,
        facultyCoordinatorName: newEvent.facultyCoordinatorName,
        bannerUrl: newEvent.bannerUrl || '',
        posterUrl: newEvent.posterUrl,
        isFinalized: false,
      };
      await onCreateEvent(event);
    }

    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleDelete = async (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation(); 
    if (onDeleteEvent && window.confirm("Delete this event?")) { 
      await onDeleteEvent(eventId); 
      if (selectedEvent?.id === eventId) setSelectedEvent(null); 
    }
  };

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    const participant = selectedExistingStudent
      ? { name: selectedExistingStudent.name, roll: selectedExistingStudent.roll, branch: selectedExistingStudent.branch }
      : newParticipant;
    onRegister(selectedEvent.id, participant);
    setIsAddParticipantOpen(false);
    setNewParticipant({ name: '', roll: '', branch: '' });
    setSelectedExistingStudent(null);
    setStudentSearch('');
    alert("Attendee added successfully.");
  };

  const handleGenerateTicket = (reg: Registration) => {
    const ticketId = `TKT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    onUpdateRegistration({ ...reg, status: 'Approved', ticketId });
  };

  const handleMassGenerate = () => {
    if (!selectedEvent) return;
    const ungenerated = registrations.filter(r => r.eventId === selectedEvent.id && !r.ticketId);
    ungenerated.forEach(reg => {
      const ticketId = `TKT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      onUpdateRegistration({ ...reg, status: 'Approved', ticketId });
    });
    alert(`Generated tickets for ${ungenerated.length} attendees.`);
  };

  const openTicketView = (reg: Registration) => {
    setTicketData(reg);
    setIsTicketModalOpen(true);
  };

  const filteredRegs = registrations.filter(r => {
    if (!selectedEvent) return false;
    if (r.eventId !== selectedEvent.id) return false;
    return r.studentName.toLowerCase().includes(participantSearch.toLowerCase()) || r.studentRoll.toLowerCase().includes(participantSearch.toLowerCase());
  });

  const students = allUsers.filter(u => u.globalRole === 'Student');
  const faculty = allUsers.filter(u => u.globalRole === 'Faculty');

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] space-y-8 animate-in fade-in duration-500">
      <EventMetrics
        total={events.length}
        approved={events.filter(e => e.status === 'Approved').length}
        pending={events.filter(e => e.status === 'Pending').length}
        attendance={registrations.length > 0 ? Math.round((registrations.filter(r => r.attendanceMarked).length / registrations.length) * 100) : 0}
      />
      {selectedEvent ? (
        <EventDetailView
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          filteredRegs={filteredRegs}
          participantSearch={participantSearch}
          setParticipantSearch={setParticipantSearch}
          openTicketView={openTicketView}
          handleGenerateTicket={handleGenerateTicket}
          handleMassGenerate={handleMassGenerate}
          setIsAddParticipantOpen={setIsAddParticipantOpen}
          handleEdit={handleOpenEdit}
        />
      ) : (
        <EventListView
          events={events}
          registrations={registrations}
          setIsModalOpen={setIsModalOpen}
          setSelectedEvent={setSelectedEvent}
          handleDelete={handleDelete}
          handleEdit={handleOpenEdit}
          handleCreateNew={handleOpenCreate}
        />
      )}
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingEvent(null); }}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        onSubmit={handleCreateSubmit}
        isDirectApprovalEnabled={isDirectApprovalEnabled}
        isEditing={!!editingEvent}
        venues={venues}
        events={events}
        students={students}
        faculty={faculty}
      />
      <AddParticipantModal
        isOpen={isAddParticipantOpen}
        onClose={() => { setIsAddParticipantOpen(false); setSelectedExistingStudent(null); setStudentSearch(''); }}
        newParticipant={newParticipant}
        setNewParticipant={setNewParticipant}
        onSubmit={handleAddParticipant}
        studentSearch={studentSearch}
        setStudentSearch={setStudentSearch}
        existingStudents={existingStudents}
        selectedExistingStudent={selectedExistingStudent}
        setSelectedExistingStudent={setSelectedExistingStudent}
      />
      <TicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        ticketData={ticketData}
        selectedEvent={selectedEvent}
      />
    </div>
  );
};

export default EventOperations;
