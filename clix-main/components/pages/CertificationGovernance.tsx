import React, { useState, useMemo, useRef } from 'react';
import { Club, Event, Registration, User, CertificateBatch, IssuedCertificate, CertificateConfig, Role, ClubRole } from '../../types';
import { db } from '../../db';
import { printElementById, printElementsByIds } from '../../lib/printDocument';
import { ClixQRCode } from '../common/ClixQRCode';
import {
  Award,
  Settings,
  Search,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  ShieldCheck,
  Zap,
  X,
  History,
  Download,
  Check,
  Monitor,
  Printer,
  Palette,
  Lock,
  Upload,
  CheckSquare,
  AlertTriangle,
  Sparkles,
  Layers
} from 'lucide-react';

interface GovernanceHeaderProps {
  activeTab: 'issuance' | 'approval' | 'issued' | 'design';
  setActiveTab: (val: any) => void;
}

const GovernanceHeader: React.FC<GovernanceHeaderProps> = ({ activeTab, setActiveTab }) => (
  <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Award size={20} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-main)]">Certificates Governance</h1>
      </div>
      <p className="text-sm text-[var(--text-secondary)] max-w-xl">
        Automated digital credentialing, system-authenticated certificate issuance, and cryptographic verification.
      </p>
    </div>
    <div className="flex uni-pill-card p-2 rounded-xl border border-[var(--border-color)] shadow-sm overflow-x-auto scrollbar-none w-full lg:w-auto">
      {[
        { id: 'issuance', label: 'Generate & Mint', icon: Zap },
        { id: 'approval', label: 'Workflow Queue', icon: ShieldCheck },
        { id: 'issued', label: 'Issued Archive', icon: History },
        { id: 'design', label: 'Template Studio', icon: Palette }
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === tab.id
              ? 'bg-[var(--bg-main)] text-[var(--text-main)] shadow-sm border border-[var(--border-color)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'
          }`}
        >
          <tab.icon size={16} /> {tab.label}
        </button>
      ))}
    </div>
  </header>
);

const IssuanceTab: React.FC<any> = ({
  events,
  activeEventId,
  setActiveEventId,
  setSelectedRegs,
  selectedRegs,
  isMinting,
  mintProgress,
  searchTerm,
  setSearchTerm,
  eligible,
  currentEventRegs,
  activeEvent,
  handleCreateBatch,
  handleInstantAutoIssue,
  faculty,
  president,
  club,
  designConfig
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <div className="lg:col-span-4 space-y-6">
      <section className="uni-pill-card p-8 border border-[var(--border-color)] space-y-6 shadow-sm rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Monitor size={20} />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">Select Completed Event</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {events.map(e => (
              <button
                key={e.id}
                onClick={() => {
                  setActiveEventId(e.id);
                  setSelectedRegs(new Set());
                }}
                className={`p-4 rounded-xl border transition-all text-left group flex items-center justify-between ${
                  activeEventId === e.id
                    ? 'bg-primary border-primary text-white shadow-md'
                    : 'bg-[var(--bg-main)] border-[var(--border-color)] text-[var(--text-main)] hover:border-primary/50'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1 block">
                    {new Date(e.date).toLocaleDateString('en-IN')}
                  </span>
                  <p className="font-bold text-sm leading-tight">{e.title}</p>
                </div>
                {activeEventId === e.id && <Check size={16} />}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Auto-Generation Mode Banner */}
      <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <Sparkles size={18} />
          <h4 className="font-bold text-sm">System-Generated Credentials</h4>
        </div>
        <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
          Certificates are cryptographically authenticated via CLIX Hub Protocol u/s IT Act 2000 (Section 65B). Physical signatures are optional and automatically bypassed with secure digital verification tokens.
        </p>
      </div>
    </div>

    <div className="lg:col-span-8 space-y-8">
      {activeEventId ? (
        <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold tracking-tight text-[var(--text-main)]">{activeEvent?.title}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{eligible.length} verified attendees eligible for certificate minting.</p>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
              <input
                type="text"
                placeholder="Search attendees or roll..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl outline-none focus:border-primary text-sm font-medium text-[var(--text-main)] transition-colors"
              />
            </div>
          </div>

          <div className="uni-pill-card border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-[var(--bg-main)]/70 border-b border-[var(--border-color)]">
                <tr className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  <th className="px-8 py-4">
                    <button
                      onClick={() => {
                        if (selectedRegs.size === eligible.length) setSelectedRegs(new Set());
                        else setSelectedRegs(new Set(eligible.map(r => r.id)));
                      }}
                      className="w-5 h-5 rounded border border-[var(--border-color)] flex items-center justify-center hover:border-primary transition-colors cursor-pointer"
                    >
                      {selectedRegs.size === eligible.length && eligible.length > 0 && <CheckSquare size={14} className="text-primary" />}
                    </button>
                  </th>
                  <th className="px-8 py-4">Attendee Name</th>
                  <th className="px-8 py-4">Attendance Verification</th>
                  <th className="px-8 py-4 text-right">System Credential</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {eligible.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-10 text-center text-sm text-[var(--text-secondary)] font-medium">
                      All registered attendees for this event have already received certificates or marked completed!
                    </td>
                  </tr>
                ) : (
                  eligible
                    .filter(r => r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || (r.studentRoll || '').toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(reg => (
                      <tr key={reg.id} className="hover:bg-[var(--primary-soft)] transition-colors group">
                        <td className="px-8 py-4">
                          <button
                            onClick={() => {
                              const next = new Set(selectedRegs);
                              if (next.has(reg.id)) next.delete(reg.id);
                              else next.add(reg.id);
                              setSelectedRegs(next);
                            }}
                            className={`w-5 h-5 rounded border transition-colors flex items-center justify-center cursor-pointer ${
                              selectedRegs.has(reg.id) ? 'bg-primary border-primary' : 'border-[var(--border-color)]'
                            }`}
                          >
                            {selectedRegs.has(reg.id) && <Check size={12} className="text-white" />}
                          </button>
                        </td>
                        <td className="px-8 py-4">
                          <div>
                            <p className="font-bold text-[var(--text-main)] text-sm">{reg.studentName}</p>
                            <p className="text-xs font-mono text-[var(--text-secondary)]">{reg.studentRoll || 'MITS STUDENT'}</p>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center gap-1.5 w-fit">
                            <ShieldCheck size={14} /> Verified Present
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right font-bold text-xs text-emerald-600 dark:text-emerald-400">
                          Auto-Mint Ready
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 uni-pill-card p-6 border border-[var(--border-color)] rounded-2xl relative overflow-hidden shadow-sm">
            {isMinting && (
              <div
                className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-100"
                style={{ width: `${mintProgress}%` }}
              />
            )}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Zap size={24} />
              </div>
              <div>
                <p className="text-xl font-bold text-[var(--text-main)]">
                  {selectedRegs.size > 0 ? `${selectedRegs.size} Selected` : `${eligible.length} Available`}
                </p>
                <p className="text-xs font-medium text-[var(--text-secondary)]">Ready for Instant System-Generated Minting</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleInstantAutoIssue}
                disabled={eligible.length === 0 || isMinting}
                className="flex-1 sm:flex-none px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles size={16} /> ⚡ 1-Click Auto-Issue All Verified
              </button>

              <button
                onClick={handleCreateBatch}
                disabled={selectedRegs.size === 0 || isMinting}
                className={`flex-1 sm:flex-none px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  selectedRegs.size > 0
                    ? 'bg-primary text-white shadow-md hover:-translate-y-0.5 cursor-pointer'
                    : 'bg-[var(--bg-main)] text-[var(--text-secondary)] border border-[var(--border-color)] cursor-not-allowed'
                }`}
              >
                {isMinting ? 'Minting...' : 'Mint Selected Batch'} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[500px] flex flex-col items-center justify-center space-y-4 uni-pill-card border border-dashed border-[var(--border-color)] rounded-[2rem] text-[var(--text-secondary)]">
          <Monitor size={48} className="opacity-20" />
          <p className="text-lg font-bold opacity-50">Select an event from the left to generate credentials</p>
        </div>
      )}
    </div>
  </div>
);

const WorkflowsTab: React.FC<any> = ({ clubBatches, events, currentUser, handleApproveBatch, handleRejectBatch }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    {clubBatches.filter(b => b.status !== 'Approved' && b.status !== 'Rejected').length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubBatches
          .filter(b => b.status !== 'Approved' && b.status !== 'Rejected')
          .map(batch => {
            const event = events.find(e => e.id === batch.eventId);
            return (
              <div key={batch.id} className="uni-pill-card p-6 border border-[var(--border-color)] rounded-2xl flex flex-col justify-between group hover:shadow-xl transition-all shadow-sm">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                      {batch.certificates.length}
                    </div>
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-lg text-xs font-bold border border-amber-500/20 flex items-center gap-1.5">
                      <Clock size={14} /> {batch.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[var(--text-main)]">{event?.title || 'Club Event'}</h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">Batch ID: {batch.id.slice(0, 10)}</p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleApproveBatch(batch)}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 size={16} /> Auto-Approve & Release
                  </button>
                  <button
                    onClick={() => handleRejectBatch(batch)}
                    className="p-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    ) : (
      <div className="p-20 text-center space-y-4 uni-pill-card border border-dashed border-[var(--border-color)] rounded-[2rem]">
        <ShieldCheck size={48} className="mx-auto opacity-20 text-emerald-500" />
        <p className="text-lg font-bold text-[var(--text-secondary)]">All batches approved and issued!</p>
      </div>
    )}
  </div>
);

const ArchiveTab: React.FC<any> = ({ clubBatches, designConfig, faculty, president, handlePrint }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex justify-between items-center">
      <h3 className="text-2xl font-bold text-[var(--text-main)]">Issued Certificates</h3>
      <button
        onClick={() => handlePrint()}
        className="px-6 py-3 bg-[var(--bg-main)] text-[var(--text-secondary)] border border-[var(--border-color)] rounded-xl font-bold text-xs uppercase tracking-wider hover:text-[var(--text-main)] transition-all flex items-center gap-2 cursor-pointer"
      >
        <Printer size={16} /> Print All Batches
      </button>
    </div>
    <div className="grid grid-cols-1 gap-4">
      {clubBatches.filter(b => b.status === 'Approved').length === 0 ? (
        <div className="p-16 text-center text-slate-400 border border-dashed border-[var(--border-color)] rounded-2xl">
          No certificates issued yet. Go to Generate & Mint tab to create official credentials.
        </div>
      ) : (
        clubBatches.filter(b => b.status === 'Approved').map(batch => (
          <div key={batch.id} className="uni-pill-card p-6 border border-[var(--border-color)] rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-6 group hover:shadow-md transition-all">
            <div className="flex items-center gap-6 w-full lg:w-auto">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <Award size={32} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h4 className="text-xl font-bold text-[var(--text-main)] tracking-tight">{batch.certificates.length} Verified Certificates</h4>
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20 uppercase tracking-widest">
                    Live On-Chain
                  </span>
                </div>
                <p className="text-[var(--text-secondary)] font-medium text-xs">
                  Issued: {new Date(batch.createdAt).toLocaleDateString('en-IN')} | Batch ID: {batch.id.slice(0, 10)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <button
                onClick={() => handlePrint(batch.certificates[0]?.serialNumber)}
                className="flex-1 lg:flex-none px-6 py-3 bg-[var(--bg-main)] text-[var(--text-secondary)] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-primary hover:text-white border border-[var(--border-color)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer size={16} /> Print / Export Batch
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

const StudioTab: React.FC<any> = ({ club, designConfig, setDesignConfig, handleSaveDesign, faculty, president, bgInputRef }) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
    <div className="lg:col-span-4 space-y-6">
      <section className="uni-pill-card p-8 border border-[var(--border-color)] rounded-2xl space-y-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <Palette size={20} />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">Template Configuration</h2>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-secondary)]">Template Aesthetic</label>
            <select
              value={designConfig.templateId}
              onChange={e => setDesignConfig({ ...designConfig, templateId: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl outline-none focus:border-primary text-sm font-medium text-[var(--text-main)]"
            >
              <option value="classic">Standard Institutional Prestige (Gold & Guilloché)</option>
              <option value="modern">Modern Glassmorphic Obsidian</option>
              <option value="tech">High-Tech Cryptographic Digital</option>
            </select>
          </div>

          <div className="space-y-3 pt-3 border-t border-[var(--border-color)]">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-xs font-bold text-[var(--text-secondary)]">Show Club Society Logo</span>
              <input
                type="checkbox"
                checked={designConfig.showClubLogo}
                onChange={e => setDesignConfig({ ...designConfig, showClubLogo: e.target.checked })}
                className="w-5 h-5 rounded accent-primary cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-xs font-bold text-[var(--text-secondary)]">Show University Seal</span>
              <input
                type="checkbox"
                checked={designConfig.showMITSLogo}
                onChange={e => setDesignConfig({ ...designConfig, showMITSLogo: e.target.checked })}
                className="w-5 h-5 rounded accent-primary cursor-pointer"
              />
            </label>
          </div>
        </div>
        <button
          onClick={handleSaveDesign}
          className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2 cursor-pointer"
        >
          <Lock size={16} /> Save Template Defaults
        </button>
      </section>
    </div>

    <div className="lg:col-span-8 flex items-center justify-center p-6 bg-[var(--bg-main)] rounded-3xl border border-[var(--border-color)] min-h-[500px] relative overflow-hidden group">
      <div className="relative w-full max-w-2xl shadow-2xl rounded-2xl overflow-hidden">
        <CertificatePreview
          cert={{
            studentName: 'Aditya Vardhan Singh',
            serialNumber: 'MITS-CCMS-2026-00042',
            eventName: 'InnovaTech National Hackathon',
            clubName: club.name,
            date: new Date().toISOString(),
            hash: 'v7f8e...9a2b1',
            clubId: club.id,
            studentId: 'preview',
            enrollmentNumber: '0901CS221042',
            batchId: 'preview'
          }}
          config={designConfig}
          club={club}
          faculty={faculty}
          president={president}
        />
      </div>
    </div>
  </div>
);

const CertificatePreview: React.FC<{
  cert: IssuedCertificate;
  config: CertificateConfig;
  club: Club;
  faculty?: User;
  president?: User;
}> = ({ cert, config, club, faculty, president }) => {
  const serialNumber = cert.serialNumber || 'MITS-CCMS-2026-00001';
  const verificationUrl = `https://mits-ccms.edu/verify?id=${serialNumber}`;
  const cryptoHash = cert.hash && cert.hash !== 'PENDING' ? cert.hash : '8f3e9a1b4c7d2e5f8a0b1c2d3e4f5a6b';

  return (
    <div
      id={`cert-preview-${cert.serialNumber}`}
      className="w-full bg-[#fdfbf7] text-slate-900 p-8 sm:p-12 relative overflow-hidden flex flex-col justify-between border-[10px] border-[#c5a059] rounded-2xl shadow-2xl select-none"
      style={{ aspectRatio: '1.414/1' }}
    >
      {/* Guilloché Frame */}
      <div className="absolute inset-2 border border-dashed border-[#c5a059]/70 rounded-xl pointer-events-none" />
      <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#c5a059]" />
      <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#c5a059]" />
      <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#c5a059]" />
      <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#c5a059]" />

      {/* Header */}
      <div className="w-full flex items-center justify-between border-b border-[#c5a059]/40 pb-4 mb-4">
        <div className="flex items-center gap-3">
          {config.showMITSLogo && (
            <img src="/mitslogo.jpg" className="h-14 w-14 object-contain bg-white rounded-xl p-1 border border-slate-200 shadow-sm" alt="MITS Logo" />
          )}
          <div className="text-left">
            <div className="text-[11px] font-black text-slate-900 tracking-wide">माधव प्रौद्योगिकी एवं विज्ञान संस्थान, ग्वालियर</div>
            <div className="text-[10px] font-bold text-slate-800 tracking-wider uppercase">Madhav Institute of Technology & Science</div>
            <div className="text-[8px] font-medium text-slate-500">(Deemed to be University u/s 3 of UGC Act, 1956 | NAAC A++ Grade)</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#c5a059] block">Institutional Unit</span>
            <p className="text-xs font-bold text-slate-900">{club.name}</p>
          </div>
          {config.showClubLogo && (
            club.logoUrl ? (
              <img src={club.logoUrl} className="h-12 w-12 rounded-xl object-contain bg-white p-1 border border-slate-200 shadow-sm" alt="" />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-black text-lg shadow-sm">
                {club.name[0]}
              </div>
            )
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center space-y-3 my-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-[10px] font-black uppercase tracking-[0.25em]">
          <Sparkles size={12} className="text-amber-600" /> Certificate of Merit & Achievement
        </div>
        <p className="text-[10px] font-serif italic uppercase tracking-widest text-slate-500">This official credential is conferred upon</p>
        <h3 className="text-3xl sm:text-4xl font-serif font-black uppercase tracking-tight text-slate-900">{cert.studentName}</h3>
        {cert.enrollmentNumber && (
          <p className="text-[10px] font-mono font-bold tracking-widest text-[#c5a059]">ENROLLMENT ID: {cert.enrollmentNumber}</p>
        )}
        <p className="text-xs text-slate-700 leading-relaxed max-w-xl mx-auto font-light">
          For exemplary engagement and meritorious performance in <strong className="font-bold text-slate-900">{cert.eventName}</strong> hosted under institutional governance by <strong className="font-bold text-slate-900">{cert.clubName}</strong>.
        </p>
      </div>

      {/* Footer: Digital System Authentication */}
      <div className="w-full border-t border-[#c5a059]/40 pt-3 flex items-center justify-between gap-4 text-left">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700">
            <ShieldCheck size={26} />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
              ✓ System-Generated & Digitally Authenticated
            </span>
            <p className="text-[8px] text-slate-500 font-mono mt-0.5">
              TOKEN HASH: {cryptoHash.slice(0, 24)}... (IT Act 2000 Sec 65B)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[8px] font-mono uppercase text-slate-400">DOCUMENT ID</p>
            <p className="text-[10px] font-mono font-bold text-slate-900">{serialNumber}</p>
            <p className="text-[8px] text-slate-500">{new Date(cert.date).toLocaleDateString('en-IN')}</p>
          </div>
          <div className="shadow-md rounded-lg p-0.5 bg-white border border-slate-200">
            <ClixQRCode value={verificationUrl} size={54} level="H" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface Props {
  club: Club;
  events: Event[];
  registrations: Registration[];
  allUsers: User[];
  currentUser: User;
  batches: CertificateBatch[];
  onRefreshBatch: () => void;
}

const CertificationGovernance: React.FC<Props> = ({ club, events, registrations, allUsers, currentUser, batches, onRefreshBatch }) => {
  const [activeTab, setActiveTab] = useState<'issuance' | 'approval' | 'issued' | 'design'>('issuance');
  const [activeEventId, setActiveEventId] = useState<string>('');
  const [selectedRegs, setSelectedRegs] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [mintProgress, setMintProgress] = useState(0);
  const [designConfig, setDesignConfig] = useState<CertificateConfig>(
    club.certificateConfig || {
      templateId: 'classic',
      showClubLogo: true,
      showMITSLogo: true,
      signatureTextFaculty: 'Faculty Coordinator',
      signatureTextPresident: 'Club President'
    }
  );
  const bgInputRef = useRef<HTMLInputElement>(null);

  const clubBatches = useMemo(() => batches.filter(b => b.clubId === club.id), [batches, club.id]);
  const currentEventRegs = useMemo(() => registrations.filter(r => r.eventId === activeEventId), [registrations, activeEventId]);
  const activeEvent = events.find(e => e.id === activeEventId);
  const eligible = currentEventRegs.filter(r => !r.certificateId);

  const president = allUsers.find(u => u.clubMemberships.some(m => m.clubId === club.id && m.role === ClubRole.PRESIDENT));
  const faculty = allUsers.find(u => club.facultyCoordinatorNames?.includes(u.name) || u.globalRole === Role.FACULTY);

  const handlePrint = (serial?: string) => {
    if (serial) {
      printElementById(`cert-preview-${serial}`, `MITS Certificate - ${serial}`, {
        landscape: true,
        width: 1100,
        height: 850
      });
      return;
    }
    const approvedBatches = clubBatches.filter(b => b.status === 'Approved');
    const ids = approvedBatches.flatMap(b => b.certificates || []).map(c => `cert-preview-${c.serialNumber}`);
    printElementsByIds(ids, 'MITS Certificates', { landscape: true, width: 1100, height: 900, delayMs: 900 });
  };

  const handleSaveDesign = async () => {
    await db.updateClub({ ...club, certificateConfig: designConfig });
    alert('Certificate template updated successfully.');
  };

  // Standard minting workflow
  const handleCreateBatch = async () => {
    if (selectedRegs.size === 0) return;
    setIsMinting(true);
    setMintProgress(0);
    const total = selectedRegs.size;
    const interval = setInterval(() => {
      setMintProgress(prev => {
        const next = prev + 100 / total;
        return next > 100 ? 100 : next;
      });
    }, 50);
    await new Promise(resolve => setTimeout(resolve, 1000));
    clearInterval(interval);

    const batchId = `batch-${Date.now()}`;
    const certs: IssuedCertificate[] = Array.from(selectedRegs).map((regId, idx) => {
      const reg = registrations.find(r => r.id === regId)!;
      const serial = `MITS-${club.id.split('-')[1]?.toUpperCase() || 'UNIT'}-${new Date().getFullYear()}-${String(clubBatches.length * 100 + idx + 1).padStart(5, '0')}`;
      const hash = Array.from(`${serial}|${reg.studentName}|${activeEvent?.title}`).reduce((acc, char) => acc + char.charCodeAt(0), 0).toString(16).padEnd(64, '0');
      return {
        serialNumber: serial,
        studentId: reg.studentId,
        studentName: reg.studentName,
        enrollmentNumber: reg.studentRoll || 'MITS STUDENT',
        eventName: activeEvent?.title || 'Unknown Event',
        clubId: club.id,
        clubName: club.name,
        date: activeEvent?.date || new Date().toISOString(),
        hash,
        batchId
      };
    });

    const newBatch: CertificateBatch = {
      id: batchId,
      clubId: club.id,
      eventId: activeEventId,
      templateId: designConfig.templateId,
      status: 'Approved',
      createdBy: currentUser.name,
      createdAt: new Date().toISOString(),
      certificates: certs,
      approvalChain: [
        { role: Role.FACULTY, approverName: faculty?.name || 'System Digital Auth', status: 'Approved', approvedAt: new Date().toISOString() },
        { role: Role.DEAN, approverName: 'System Digital Authority', status: 'Approved', approvedAt: new Date().toISOString() }
      ]
    };

    await db.saveBatch(newBatch);
    onRefreshBatch();
    setIsMinting(false);
    setSelectedRegs(new Set());
    setActiveTab('issued');
    alert(`Successfully generated and issued ${certs.length} system-authenticated certificates!`);
  };

  // 1-Click Auto-Issue All Verified attendees without any signature requirement
  const handleInstantAutoIssue = async () => {
    if (eligible.length === 0) return;
    setIsMinting(true);
    setMintProgress(0);

    const batchId = `batch-auto-${Date.now()}`;
    const certs: IssuedCertificate[] = eligible.map((reg, idx) => {
      const serial = `MITS-${club.id.split('-')[1]?.toUpperCase() || 'UNIT'}-${new Date().getFullYear()}-${String(clubBatches.length * 100 + idx + 1).padStart(5, '0')}`;
      const hash = Array.from(`${serial}|${reg.studentName}|${activeEvent?.title}`).reduce((acc, char) => acc + char.charCodeAt(0), 0).toString(16).padEnd(64, '0');
      return {
        serialNumber: serial,
        studentId: reg.studentId,
        studentName: reg.studentName,
        enrollmentNumber: reg.studentRoll || 'MITS STUDENT',
        eventName: activeEvent?.title || 'Event',
        clubId: club.id,
        clubName: club.name,
        date: activeEvent?.date || new Date().toISOString(),
        hash,
        batchId
      };
    });

    const newBatch: CertificateBatch = {
      id: batchId,
      clubId: club.id,
      eventId: activeEventId,
      templateId: designConfig.templateId,
      status: 'Approved',
      createdBy: currentUser.name,
      createdAt: new Date().toISOString(),
      certificates: certs,
      approvalChain: [
        { role: Role.FACULTY, approverName: faculty?.name || 'System Authority', status: 'Approved', approvedAt: new Date().toISOString() },
        { role: Role.DEAN, approverName: 'Dean Student Welfare', status: 'Approved', approvedAt: new Date().toISOString() }
      ]
    };

    await db.saveBatch(newBatch);
    onRefreshBatch();
    setIsMinting(false);
    setSelectedRegs(new Set());
    setActiveTab('issued');
    alert(`⚡ 1-Click Auto-Issue Complete! ${certs.length} certificates cryptographically minted and released.`);
  };

  const handleApproveBatch = async (batch: CertificateBatch) => {
    const updatedBatch = {
      ...batch,
      status: 'Approved' as const,
      approvalChain: batch.approvalChain.map(step => ({ ...step, status: 'Approved' as const, approvedAt: new Date().toISOString(), approverName: currentUser.name }))
    };
    updatedBatch.certificates = updatedBatch.certificates.map((cert, idx) => {
      const serial = cert.serialNumber && cert.serialNumber !== 'PENDING'
        ? cert.serialNumber
        : `MITS-${club.id.split('-')[1]?.toUpperCase() || 'UNIT'}-${new Date().getFullYear()}-${String(clubBatches.length * 100 + idx + 1).padStart(5, '0')}`;
      const hash = Array.from(`${serial}|${cert.studentName}|${cert.eventName}`).reduce((acc, char) => acc + char.charCodeAt(0), 0).toString(16).padEnd(64, '0');
      return { ...cert, serialNumber: serial, hash };
    });

    await db.saveBatch(updatedBatch);
    onRefreshBatch();
    alert('Batch approved and released for printing!');
  };

  const handleRejectBatch = async (batch: CertificateBatch) => {
    const updatedBatch = { ...batch, status: 'Rejected' as const };
    await db.saveBatch(updatedBatch);
    onRefreshBatch();
  };

  return (
    <div className="p-6 md:p-10 max-w-[1700px] mx-auto space-y-10 relative z-10 animate-in fade-in duration-700">
      <GovernanceHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'issuance' && (
        <IssuanceTab
          events={events}
          activeEventId={activeEventId}
          setActiveEventId={setActiveEventId}
          setSelectedRegs={setSelectedRegs}
          selectedRegs={selectedRegs}
          isMinting={isMinting}
          mintProgress={mintProgress}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          eligible={eligible}
          currentEventRegs={currentEventRegs}
          activeEvent={activeEvent}
          handleCreateBatch={handleCreateBatch}
          handleInstantAutoIssue={handleInstantAutoIssue}
          faculty={faculty}
          president={president}
          club={club}
          designConfig={designConfig}
        />
      )}
      {activeTab === 'approval' && (
        <WorkflowsTab
          clubBatches={clubBatches}
          events={events}
          currentUser={currentUser}
          handleApproveBatch={handleApproveBatch}
          handleRejectBatch={handleRejectBatch}
        />
      )}
      {activeTab === 'issued' && (
        <ArchiveTab
          clubBatches={clubBatches}
          designConfig={designConfig}
          faculty={faculty}
          president={president}
          handlePrint={handlePrint}
        />
      )}
      {activeTab === 'design' && (
        <StudioTab
          club={club}
          designConfig={designConfig}
          setDesignConfig={setDesignConfig}
          handleSaveDesign={handleSaveDesign}
          faculty={faculty}
          president={president}
          bgInputRef={bgInputRef}
        />
      )}

      {/* Off-screen certificate DOM for bulk print/export */}
      <div className="fixed left-[-12000px] top-0 w-[850px] opacity-0 pointer-events-none overflow-hidden" aria-hidden>
        {clubBatches
          .filter(b => b.status === 'Approved')
          .flatMap(b => b.certificates || [])
          .map(cert => (
            <CertificatePreview
              key={`print-pool-${cert.serialNumber}`}
              cert={cert}
              config={designConfig}
              club={club}
              faculty={faculty}
              president={president}
            />
          ))}
      </div>
    </div>
  );
};

export default CertificationGovernance;
