import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar, ChevronDown, Search, UserPlus, CheckCircle2,
  AlertCircle, Zap, Camera, X, FileDown, PieChart as PieIcon, MoreHorizontal
} from 'lucide-react';
import type { Registration, Event, User } from '../../types';
// @ts-ignore
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

// ─── Stats Card ───────────────────────────────────────────────────────────────
const AttendanceStats: React.FC<{
  presentCount: number;
  totalCount: number;
  percentage: number;
}> = ({ presentCount, totalCount, percentage }) => (
  <div className="uni-pill-card border border-[var(--border-color)] p-6 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all pointer-events-none">
      <PieIcon size={140} className="text-[var(--primary)]" />
    </div>
    <div className="relative z-10 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center flex-shrink-0">
          <PieIcon size={18} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">
          Attendance Rate
        </p>
      </div>

      <div>
        <h2 className="uni-text-stat text-[var(--text-main)] font-extrabold leading-none">
          {percentage}%
        </h2>
        <p className="text-[10px] font-bold text-[var(--text-secondary)] mt-2 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${percentage > 70 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          {presentCount} present / {totalCount} registered
        </p>
      </div>

      <div className="w-full h-2 bg-[var(--primary-soft)] rounded-full overflow-hidden border border-[var(--border-color)]">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${percentage}%`,
            background: 'var(--primary)',
            boxShadow: '0 0 12px hsla(var(--primary-raw), 0.4)',
          }}
        />
      </div>
    </div>
  </div>
);

// ─── Quick Mark ───────────────────────────────────────────────────────────────
const QuickMark: React.FC<{
  handleQuickMark: (e: React.FormEvent) => void;
  quickMarkRoll: string;
  setQuickMarkRoll: (v: string) => void;
  scanResult: { msg: string; status: 'success' | 'error' } | null;
}> = ({ handleQuickMark, quickMarkRoll, setQuickMarkRoll, scanResult }) => (
  <div className="uni-pill-card border border-[var(--border-color)] p-5">
    <h3 className="text-sm font-black tracking-tight text-[var(--text-main)] mb-4 flex items-center gap-2">
      <Zap size={15} className="text-amber-500 flex-shrink-0" />
      Manual Entry by Roll No.
    </h3>
    <form onSubmit={handleQuickMark} className="flex gap-2">
      <input
        value={quickMarkRoll}
        onChange={(e) => setQuickMarkRoll(e.target.value.toUpperCase())}
        placeholder="e.g. 0901CS221001"
        className="flex-1 min-w-0 px-4 py-3 rounded-xl text-sm font-bold outline-none uppercase tracking-widest bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-color)] focus:border-[var(--primary)] transition-all placeholder:text-[var(--text-secondary)] placeholder:normal-case placeholder:tracking-normal"
      />
      <button
        type="submit"
        className="p-3 bg-[var(--primary)] text-white rounded-xl hover:scale-105 transition-transform shadow-lg"
        aria-label="Submit roll"
        title="Submit roll"
      >
        <UserPlus size={18} />
      </button>
    </form>

    {scanResult && (
      <div
        className={`mt-3 p-3 rounded-xl font-bold text-sm flex items-start gap-3 ${
          scanResult.status === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            : 'bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400'
        }`}
      >
        {scanResult.status === 'success'
          ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
          : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
        <span className="text-xs">{scanResult.msg}</span>
      </div>
    )}
  </div>
);

// ─── QR Scanner ───────────────────────────────────────────────────────────────
const QRScanner: React.FC<{ isScanning: boolean }> = ({ isScanning }) => (
  <div
    className={`uni-pill-card border transition-all p-5 ${
      isScanning
        ? 'border-[var(--primary)] shadow-lg shadow-primary/10'
        : 'border-[var(--border-color)] opacity-50'
    }`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center flex-shrink-0">
          <Camera size={18} />
        </div>
        <h3 className="text-sm font-black text-[var(--text-main)]">QR Scanner</h3>
      </div>
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${
          isScanning
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
            : 'bg-[var(--primary-soft)] text-[var(--text-secondary)] border-[var(--border-color)]'
        }`}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${isScanning ? 'bg-emerald-500 animate-pulse' : 'bg-[var(--text-secondary)]'}`} />
        {isScanning ? 'Active' : 'Standby'}
      </div>
    </div>

    <div className="relative aspect-square rounded-2xl bg-[var(--bg-main)] border-2 border-dashed border-[var(--border-color)] overflow-hidden flex items-center justify-center">
      {isScanning ? (
        <div id="qr-reader" className="w-full h-full" />
      ) : (
        <div className="text-center space-y-3">
          <Camera size={36} className="mx-auto text-[var(--text-secondary)] opacity-20" />
          <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-40">
            Camera offline
          </p>
        </div>
      )}
      <div className="absolute top-0 left-0 w-full p-3 flex justify-between pointer-events-none opacity-10">
        <MoreHorizontal size={12} />
        <MoreHorizontal size={12} />
      </div>
    </div>

    <p className="mt-4 text-[9px] font-medium text-[var(--text-secondary)] text-center leading-relaxed">
      Scans MITS digital tickets or registration IDs for instant mark.
    </p>
  </div>
);

// ─── Attendance Roster ────────────────────────────────────────────────────────
const AttendanceRoster: React.FC<{
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filteredRegs: Registration[];
  onMark: (id: string, status: boolean) => void;
  getEventName: (id: string) => string;
}> = ({ searchTerm, setSearchTerm, filteredRegs, onMark, getEventName }) => (
  <div className="lg:col-span-2 uni-pill-card border border-[var(--border-color)] overflow-hidden flex flex-col">
    {/* Header */}
    <div className="p-5 border-b border-[var(--border-color)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--primary-soft)]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[var(--bg-main)] text-[var(--text-secondary)] flex items-center justify-center flex-shrink-0">
          <Search size={18} />
        </div>
        <div>
          <h3 className="text-sm font-black text-[var(--text-main)] uppercase tracking-tight">Attendance Roster</h3>
          <p className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
            {filteredRegs.length} Students
          </p>
        </div>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={14} />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by roll, name or ticket…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs font-medium bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-color)] outline-none focus:border-[var(--primary)] transition-all"
        />
      </div>
    </div>

    {/* Table — horizontally scrollable on mobile */}
    <div className="flex-1 overflow-auto">
      <table className="w-full text-left min-w-[480px]">
        <thead className="sticky top-0 bg-[var(--bg-surface)] z-10 border-b border-[var(--border-color)]">
          <tr className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">
            <th className="px-5 py-4">Student</th>
            <th className="px-5 py-4">Ticket / ID</th>
            <th className="px-5 py-4 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {filteredRegs.length > 0 ? (
            filteredRegs.map((reg) => (
              <tr key={reg.id} className="hover:bg-[var(--primary-soft)] transition-colors group">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[var(--primary-soft)] border border-[var(--border-color)] flex items-center justify-center font-black text-xs text-[var(--primary)] group-hover:border-[var(--primary)] transition-all flex-shrink-0">
                      {reg.studentName?.[0] ?? '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-[var(--text-main)] truncate">{reg.studentName}</p>
                      <p className="text-[9px] font-bold text-[var(--text-secondary)] truncate">
                        {reg.studentRoll} · {getEventName(reg.eventId)}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 rounded-lg bg-[var(--primary-soft)] border border-[var(--border-color)] text-[9px] font-mono text-[var(--text-secondary)]">
                    {(reg.ticketId || reg.id).slice(0, 16)}
                  </span>
                </td>

                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onMark(reg.id, !reg.attendanceMarked)}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ml-auto active:scale-95 ${
                      reg.attendanceMarked
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white hover:border-emerald-500'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white hover:border-rose-500'
                    }`}
                    aria-label={reg.attendanceMarked ? 'Mark absent' : 'Mark present'}
                    title={reg.attendanceMarked ? 'Mark absent' : 'Mark present'}
                  >
                    {reg.attendanceMarked
                      ? <><CheckCircle2 size={11} /> Present</>
                      : <><X size={11} /> Absent</>}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="px-5 py-20 text-center">
                <Search size={32} className="mx-auto text-[var(--text-secondary)] opacity-20 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-40">
                  No students match the filter
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
interface Props {
  registrations: Registration[];
  events?: Event[];
  clubName: string;
  onMark: (id: string, status: boolean) => void;
  onFinalize: () => void;
  isDarkMode?: boolean;
  allUsers?: User[];
  onRegister?: (eventId: string, proxy?: { name: string, roll: string, branch: string }) => Promise<any> | any;
}

const AttendanceControl: React.FC<Props> = ({
  registrations,
  events = [],
  clubName,
  onMark,
  onFinalize,
  allUsers = [],
  onRegister
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [isScanning, setIsScanning]           = useState(false);
  const [searchTerm, setSearchTerm]           = useState('');
  const [quickMarkRoll, setQuickMarkRoll]     = useState('');
  const [scanResult, setScanResult]           = useState<{ msg: string; status: 'success' | 'error' } | null>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualName, setManualName]           = useState('');
  const [manualBranch, setManualBranch]       = useState('CSE');
  const [manualRoll, setManualRoll]           = useState('');
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);

  const activeRegs = useMemo(
    () => selectedEventId === 'all' ? registrations : registrations.filter(r => r.eventId === selectedEventId),
    [registrations, selectedEventId]
  );

  const filteredRegs = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return activeRegs.filter(r =>
      r.studentName.toLowerCase().includes(term) ||
      r.studentRoll.toLowerCase().includes(term) ||
      (r.ticketId || '').toLowerCase().includes(term)
    );
  }, [activeRegs, searchTerm]);

  const presentCount = useMemo(() => activeRegs.filter(r => r.attendanceMarked).length, [activeRegs]);
  const percentage   = useMemo(() => activeRegs.length > 0 ? Math.round((presentCount / activeRegs.length) * 100) : 0, [activeRegs.length, presentCount]);

  // QR scanner lifecycle
  useEffect(() => {
    let scanner: any;
    if (isScanning) {
      scanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: { width: 220, height: 220 }, supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA], rememberLastUsedCamera: true, showTorchButtonIfSupported: true },
        false
      );
      scanner.render(
        (decoded: string) => {
          const raw = String(decoded || '').trim();
          let cleanId = raw;
          try {
            if (raw.includes('ticketId=')) {
              cleanId = new URL(raw).searchParams.get('ticketId') || cleanId;
            } else if (raw.includes('docId=')) {
              cleanId = new URL(raw).searchParams.get('docId') || cleanId;
            } else if (raw.includes('id=')) {
              cleanId = new URL(raw).searchParams.get('id') || cleanId;
            }
          } catch {}

          const reg = registrations.find(r => 
            r.ticketId === raw || 
            r.id === raw || 
            r.ticketId === cleanId || 
            r.id === cleanId ||
            (r.ticketId && raw.includes(r.ticketId)) ||
            (r.id && raw.includes(r.id)) ||
            (r.studentRoll && raw.toUpperCase().includes(r.studentRoll.toUpperCase()))
          );

          if (reg) {
            if (!reg.attendanceMarked) {
              onMark(reg.id, true);
              setScanResult({ msg: `✅ Verified: ${reg.studentName} (${reg.studentRoll})`, status: 'success' });
            } else {
              setScanResult({ msg: `Already present: ${reg.studentName}`, status: 'success' });
            }
          } else {
            setScanResult({ msg: `Invalid QR: ${raw.slice(0, 24)}…`, status: 'error' });
          }
          setTimeout(() => setScanResult(null), 3500);
        },
        () => {}
      );
    }
    return () => { if (scanner) scanner.clear?.().catch(() => {}); };
  }, [isScanning, registrations, onMark]);

  const handleQuickMark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMarkRoll.trim()) return;

    const rollUpper = quickMarkRoll.toUpperCase();

    // 1. Search in activeRegs (already registered)
    const existingReg = activeRegs.find(r => r.studentRoll.toUpperCase() === rollUpper);
    if (existingReg) {
      onMark(existingReg.id, true);
      setQuickMarkRoll('');
      setScanResult({ msg: `Manual Entry OK: ${existingReg.studentName}`, status: 'success' });
      setTimeout(() => setScanResult(null), 4000);
      return;
    }

    // 2. If not registered, search in allUsers
    const foundUser = allUsers?.find(u => u.enrollmentNumber?.toUpperCase() === rollUpper);
    if (foundUser && onRegister) {
      setScanResult({ msg: `Found registry student: ${foundUser.name}. Auto-registering...`, status: 'success' });
      const registerExistingUser = async () => {
        try {
          const newReg = await onRegister(selectedEventId, {
            name: foundUser.name,
            roll: foundUser.enrollmentNumber || rollUpper,
            branch: foundUser.branch || 'CSE'
          });
          if (newReg) {
            onMark(newReg.id, true);
            setScanResult({ msg: `✅ Registered & Present: ${foundUser.name}`, status: 'success' });
            setQuickMarkRoll('');
          } else {
            setScanResult({ msg: `Failed to register ${foundUser.name}`, status: 'error' });
          }
        } catch (err) {
          setScanResult({ msg: `Error registering student`, status: 'error' });
        } finally {
          setTimeout(() => setScanResult(null), 4000);
        }
      };
      registerExistingUser();
      return;
    }

    // 3. Not found anywhere: Open manual registration form
    if (onRegister) {
      setManualRoll(rollUpper);
      setManualName('');
      setManualBranch('CSE');
      setIsManualModalOpen(true);
      setScanResult({ msg: `Roll "${rollUpper}" not found. Open manual form...`, status: 'error' });
    } else {
      setScanResult({ msg: `Roll "${rollUpper}" not registered for this event.`, status: 'error' });
    }
    setTimeout(() => setScanResult(null), 4000);
  };

  const handleManualRegisterSubmit = async () => {
    if (!onRegister || !manualName.trim() || !manualBranch.trim()) return;
    setIsSubmittingManual(true);
    try {
      const newReg = await onRegister(selectedEventId, {
        name: manualName.trim(),
        roll: manualRoll.trim().toUpperCase(),
        branch: manualBranch.trim()
      });
      if (newReg) {
        onMark(newReg.id, true);
        setScanResult({ msg: `✅ Registered & Present: ${manualName}`, status: 'success' });
        setIsManualModalOpen(false);
        setManualName('');
        setQuickMarkRoll('');
      } else {
        setScanResult({ msg: `Failed to register student`, status: 'error' });
      }
    } catch (err) {
      setScanResult({ msg: `Error creating manual registration`, status: 'error' });
    } finally {
      setIsSubmittingManual(false);
      setTimeout(() => setScanResult(null), 4000);
    }
  };

  const exportCSV = () => {
    const csv = [
      ['Name', 'Roll No', 'Ticket ID', 'Status'],
      ...activeRegs.map(r => [r.studentName, r.studentRoll, r.ticketId || '—', r.attendanceMarked ? 'Present' : 'Absent']),
    ]
      .map(row => row.map(c => `"${String(c)}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${clubName.replace(/\s+/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getEventName = (id: string) => events.find(e => e.id === id)?.title || id;

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">

      {/* ── Page Header ── */}
      <div className="uni-pill-card border border-[var(--border-color)] p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="uni-badge">Club Scope</span>
          <span className="uni-badge">Attendance</span>
          <span className="px-3 py-1 rounded-full bg-[var(--primary-soft)] text-[var(--text-secondary)] text-[9px] font-black uppercase tracking-widest border border-[var(--border-color)]">
            {clubName}
          </span>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">
              Verification Dashboard
            </p>
            <h1 className="uni-text-display text-[var(--text-main)]">Attendance</h1>
            <p className="uni-text-subtitle text-[var(--text-secondary)] max-w-xl">
              Track verified attendance for club-led events with scope-aware audit view.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsScanning(s => !s)}
              className={`px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm ${
                isScanning
                  ? 'bg-rose-600 text-white shadow-rose-600/20'
                  : 'uni-pill-card border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-main)]'
              }`}
              type="button"
              aria-label={isScanning ? 'Stop scanner' : 'Start QR scanner'}
            >
              {isScanning ? <><X size={14} /> Stop Scanner</> : <><Camera size={14} /> QR Scanner</>}
            </button>

            <button
              onClick={exportCSV}
              className="px-5 py-3 rounded-xl uni-pill-card border border-[var(--border-color)] text-[var(--text-secondary)] font-black text-[10px] uppercase tracking-widest hover:text-[var(--text-main)] transition-all flex items-center gap-2"
              type="button"
              aria-label="Export CSV"
            >
              <FileDown size={14} /> Export CSV
            </button>

            <button
              onClick={onFinalize}
              className="px-7 py-3 bg-[var(--primary)] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all"
              type="button"
              aria-label="Finalize attendance"
            >
              Finalize
            </button>
          </div>
        </div>
      </div>

      {/* ── Event Selector ── */}
      {events.length > 0 && (
        <div className="uni-pill-card border border-[var(--border-color)] p-4 flex items-center gap-4">
          <Calendar size={16} className="text-[var(--primary)] flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-1">
              Select Event
            </p>
            <div className="relative">
              <label className="sr-only" htmlFor="attendance-event-select">Select event</label>
              <select
                id="attendance-event-select"
                value={selectedEventId}
                onChange={e => setSelectedEventId(e.target.value)}
                className="w-full bg-transparent text-[var(--text-main)] font-black text-sm outline-none pr-6 cursor-pointer appearance-none"
              >
                <option value="all">All Events ({registrations.length})</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} · {registrations.filter(r => r.eventId === ev.id).length} registered
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-lg font-extrabold text-[var(--text-main)] leading-none">
              {presentCount}<span className="text-sm text-[var(--text-secondary)] font-medium">/{activeRegs.length}</span>
            </p>
            <p className="text-[8px] font-black uppercase tracking-widest text-[var(--text-secondary)]">present</p>
          </div>
        </div>
      )}

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="space-y-4 lg:col-span-1">
          <AttendanceStats presentCount={presentCount} totalCount={activeRegs.length} percentage={percentage} />
          <QuickMark
            handleQuickMark={handleQuickMark}
            quickMarkRoll={quickMarkRoll}
            setQuickMarkRoll={setQuickMarkRoll}
            scanResult={scanResult}
          />
          <QRScanner isScanning={isScanning} />
        </div>

        {/* Right Column — Roster */}
        <AttendanceRoster
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredRegs={filteredRegs}
          onMark={onMark}
          getEventName={getEventName}
        />
      </div>

      {isManualModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-end md:items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsManualModalOpen(false)}>
          <div className="w-full max-w-md uni-pill-card p-6 md:p-8 space-y-6 animate-in slide-in-from-bottom-4 bg-[var(--bg-surface)] text-[var(--text-main)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-[var(--text-main)]">Manual Registration</h3>
                <p className="text-[10px] text-[var(--text-secondary)]">Mark attendance for unregistered students</p>
              </div>
              <button type="button" onClick={() => setIsManualModalOpen(false)} className="p-2 rounded-full hover:bg-[var(--primary-soft)] text-[var(--text-secondary)]">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-[var(--text-secondary)] ml-1">Roll Number</label>
                <input
                  value={manualRoll}
                  disabled
                  className="w-full h-11 px-4 rounded-xl border border-[var(--border-color)] bg-[var(--primary-soft)] text-sm font-bold text-[var(--text-main)] opacity-70 cursor-not-allowed uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-[var(--text-secondary)] ml-1">Student Name *</label>
                <input
                  value={manualName}
                  onChange={e => setManualName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full h-11 px-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm font-bold text-[var(--text-main)] outline-none focus:border-[var(--primary)] transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-[var(--text-secondary)] ml-1">Branch / Department *</label>
                <input
                  value={manualBranch}
                  onChange={e => setManualBranch(e.target.value)}
                  placeholder="e.g. CSE or ECE"
                  className="w-full h-11 px-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm font-bold text-[var(--text-main)] outline-none focus:border-[var(--primary)] transition-all"
                />
              </div>
            </div>

            <button
              type="button"
              disabled={isSubmittingManual || !manualName.trim() || !manualBranch.trim()}
              onClick={handleManualRegisterSubmit}
              className="w-full h-12 rounded-xl bg-[var(--primary)] text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
            >
              {isSubmittingManual ? 'Registering...' : <><UserPlus size={16} /> Register & Mark Present</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceControl;
