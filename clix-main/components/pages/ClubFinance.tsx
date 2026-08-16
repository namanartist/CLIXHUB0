import React, { useState } from 'react';
import { Registration, Event, Club, Quotation, PaymentGatewayConfig, QrHistoryItem } from '../../types';
import { db } from '../../db';
import { buildEventUpiString } from '../../lib/upiQr';
import { ClixQRCode } from '../common/ClixQRCode';
import {
  DollarSign,
  Search,
  Activity,
  Plus,
  Check,
  X,
  Layers,
  Globe,
  Eye,
  Zap,
  Fingerprint,
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  Settings,
  EyeOff,
  Save,
  QrCode,
  FileText,
  Clock,
  AlertCircle,
  Link,
  History,
  Edit3,
  ExternalLink
} from 'lucide-react';

interface FinanceHeaderProps {
  isDarkMode: boolean;
  clubName: string;
}

const FinanceHeader: React.FC<FinanceHeaderProps> = ({ isDarkMode, clubName }) => (
  <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative">
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-1 bg-blue-500 rounded-full" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Economic Oversight Mainframe</span>
      </div>
      <div>
        <h1 className={`text-4xl md:text-6xl font-black tracking-tight font-display leading-none ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>
          Capital <span className="opacity-40">Ledger</span>
        </h1>
        <p className="text-lg font-medium text-[var(--text-secondary)] mt-2 italic">Institutional financial telemetry for {clubName} infrastructure.</p>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <div className="text-right">
        <p className="text-4xl font-black font-display tracking-tighter text-[var(--text-main)] italic">NODE_904</p>
        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Authorized Financial Access</p>
      </div>
    </div>
  </header>
);

const FinanceKPIs: React.FC<any> = ({ totalRevenue, pendingAmount, totalApprovedQuotes, isDarkMode }) => {
  const cards = [
    { label: 'Validated Liquidity', value: `₹${totalRevenue}`, icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Unverified Flow', value: `₹${pendingAmount}`, icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Procured Capital', value: `₹${totalApprovedQuotes}`, icon: ArrowUpRight, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Net Retention', value: `₹${totalRevenue - totalApprovedQuotes}`, icon: ShieldCheck, color: 'text-primary', bg: 'bg-primary/10' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {cards.map((card, i) => (
        <div key={i} className={`p-10 uni-pill-card border border-[var(--border-color)] uni-pill-card relative overflow-hidden group shadow-2xl transition-all hover:border-blue-500/30`}>
          <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all ${card.color}`}><card.icon size={150} /></div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}><card.icon size={20} /></div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">{card.label}</p>
            </div>
            <h2 className="text-4xl font-black font-display tracking-tighter text-[var(--text-main)]">{card.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

const ProofPreviewModal: React.FC<{ proofUrl?: string | null; onClose: () => void }> = ({ proofUrl, onClose }) => (
  proofUrl ? (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-5xl w-full rounded-[2rem] overflow-hidden border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-2xl">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-3 text-white hover:bg-black/80 transition-all">×</button>
        <div className="p-6">
          <div className="mb-4 text-sm uppercase tracking-[0.35em] text-[var(--text-secondary)]">Payment Proof</div>
          <div className="rounded-[2rem] overflow-hidden bg-[var(--bg-main)] border border-[var(--border-color)]">
            <img src={proofUrl} alt="Payment proof" className="w-full max-h-[80vh] object-contain" />
          </div>
        </div>
      </div>
    </div>
  ) : null
);

const EventOversightPanel: React.FC<{ events: Event[] }> = ({ events }) => {
  const upcoming = events
    .filter((event) => new Date(event.date).getTime() >= Date.now())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {upcoming.length > 0 ? upcoming.map((event) => (
        <div key={event.id} className="uni-pill-card rounded-[3rem] border border-[var(--border-color)] p-8 shadow-2xl bg-[var(--bg-main)]">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="text-[9px] uppercase tracking-[0.35em] font-black text-[var(--text-secondary)]">Upcoming event</p>
              <h3 className="mt-3 text-2xl font-black text-[var(--text-main)] tracking-tight">{event.title}</h3>
            </div>
            <span className="text-xs font-black uppercase tracking-[0.25em] text-blue-500">{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="space-y-3">
            <div className="rounded-3xl border border-[var(--border-color)] bg-white/10 p-4">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--text-secondary)]">Coordinator</p>
              <p className="mt-2 text-sm font-bold text-[var(--text-main)]">{event.eventCoordinatorName || 'TBD'}</p>
            </div>
            <div className="rounded-3xl border border-[var(--border-color)] bg-white/10 p-4">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--text-secondary)]">Faculty Advisor</p>
              <p className="mt-2 text-sm font-bold text-[var(--text-main)]">{event.facultyCoordinatorName || 'TBD'}</p>
            </div>
            <div className="rounded-3xl border border-[var(--border-color)] bg-white/10 p-4">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--text-secondary)]">Projected revenue</p>
              <p className="mt-2 text-sm font-bold text-[var(--text-main)]">{event.type === 'Paid' ? `₹${event.fee || 0}` : 'Free'}</p>
            </div>
          </div>
        </div>
      )) : (
        <div className="uni-pill-card rounded-[3rem] border border-[var(--border-color)] p-8 shadow-2xl bg-[var(--bg-main)] lg:col-span-3 text-center">
          <p className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-[0.35em]">No upcoming events are scheduled yet.</p>
          <p className="mt-4 text-lg font-black text-[var(--text-main)]">Schedule new club events to sync finance and coordination workflows.</p>
        </div>
      )}
    </section>
  );
};

const TransactionMatrix: React.FC<any> = ({ financeRegs, events, onApprovePayment, onPreviewProof }: { financeRegs: any[]; events: Event[]; onApprovePayment: (id: string) => void; onPreviewProof: (url?: string) => void; }) => (
  <div className="uni-pill-card rounded-[4rem] border border-[var(--border-color)] overflow-hidden shadow-2xl">
    <div className="p-12 border-b border-[var(--border-color)] bg-[#0B1437]/50 flex justify-between items-center">
      <div className="space-y-1">
        <h3 className="text-2xl font-black text-[var(--text-main)] font-display tracking-tighter uppercase">Transaction Matrix</h3>
        <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Awaiting Manual Verification Protocols</p>
      </div>
      <div className="flex items-center gap-3 bg-amber-500/10 text-amber-500 px-6 py-2.5 rounded-2xl border border-amber-500/20">
        <Activity size={16} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Audit Queue: {financeRegs.filter((r: any) => r.status === 'Pending').length}</span>
      </div>
    </div>
    {financeRegs.length === 0 ? (
      <div className="p-20 text-center text-[var(--text-secondary)] italic uppercase tracking-[0.4em]">Ledger Empty • Registry System Passive</div>
    ) : (
      <>
        <div className="space-y-4 lg:hidden p-6">
          {financeRegs.map((reg: any) => {
            const event = events.find((e: any) => e.id === reg.eventId);
            return (
              <div key={reg.id} className="rounded-[2rem] border border-[var(--border-color)] bg-[var(--bg-main)] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--text-secondary)]">{reg.studentName}</p>
                    <p className="mt-2 text-xs text-[var(--text-secondary)]">{reg.studentRoll}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-secondary)]">{event?.title}</p>
                    <p className="mt-1 text-lg font-black text-[var(--text-main)]">{event?.type === 'Paid' ? `₹${event?.fee}` : 'Free'}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-3">
                  <div>
                    {reg.paymentType === 'Gateway' ? (
                      <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20"><Zap size={10} /> Automated Gateway</span>
                    ) : reg.paymentProofUrl ? (
                      <button type="button" onClick={() => onPreviewProof(reg.paymentProofUrl)} className="inline-flex items-center gap-2 text-[10px] font-black text-blue-500 bg-blue-500/10 px-4 py-2 rounded-2xl border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all"><Eye size={14} /> View proof</button>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-secondary)]">Proof unavailable</span>
                    )}
                  </div>
                  <div className="text-right">
                    {reg.status === 'Pending' ? (
                      <div className="flex gap-3 justify-end">
                        <button onClick={() => onApprovePayment(reg.id)} className="px-4 py-3 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20 hover:bg-emerald-600 hover:text-white transition-all">Approve</button>
                        <button className="px-4 py-3 bg-rose-500/10 text-rose-500 rounded-2xl border border-rose-500/20 hover:bg-rose-600 hover:text-white transition-all">Reject</button>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 border border-emerald-500/20">
                        <Fingerprint size={16} /> Validated Node
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-secondary)] border-b border-[var(--border-color)] opacity-40">
                <th className="px-10 py-8">OPERATIVE IDENTITY</th>
                <th className="px-10 py-8 text-center">MISSION NODE</th>
                <th className="px-10 py-8">FINANCIAL PROOF</th>
                <th className="px-10 py-8 text-right">AUDIT MANEUVER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {financeRegs.map((reg: any) => {
                const event = events.find((e: any) => e.id === reg.eventId);
                return (
                  <tr key={reg.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-10 py-8"><div><p className="font-black text-lg text-[var(--text-main)] tracking-tight">{reg.studentName}</p><p className="text-[10px] font-mono font-bold text-[var(--text-secondary)] uppercase tracking-widest mt-1 italic">{reg.studentRoll}</p></div></td>
                    <td className="px-10 py-8 text-center"><div><p className="font-black text-sm text-[var(--text-main)] group-hover:text-blue-500 transition-colors uppercase tracking-tighter">{event?.title}</p><p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mt-1">{event?.type === 'Paid' ? `₹${event?.fee}` : 'Free'}</p></div></td>
                    <td className="px-10 py-8">
                      {reg.paymentType === 'Gateway' ? (
                        <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20"><Zap size={10} /> Automated Gateway</span>
                      ) : reg.paymentProofUrl ? (
                        <button type="button" onClick={() => onPreviewProof(reg.paymentProofUrl)} className="flex items-center gap-3 text-[10px] font-black text-blue-500 bg-blue-500/10 px-6 py-3 rounded-2xl border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all"><Eye size={16} /> View proof</button>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-secondary)]">Proof unavailable</span>
                      )}
                    </td>
                    <td className="px-10 py-8 text-right">
                      {reg.status === 'Pending' ? (
                        <div className="flex gap-4 justify-end">
                          <button onClick={() => onApprovePayment(reg.id)} className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center border border-emerald-500/20"><Check size={24} /></button>
                          <button className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center border border-rose-500/20"><X size={24} /></button>
                        </div>
                      ) : (<div className="text-emerald-500 flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] justify-end bg-emerald-500/10 px-5 py-2.5 rounded-2xl border border-emerald-500/20 italic"><Fingerprint size={18} /> Validated Node</div>)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </>
    )}
  </div>
);

const InfrastructureMatrix: React.FC<any> = ({
  club,
  gatewayConfig,
  setGatewayConfig,
  showSecrets,
  setShowSecrets,
  isGatewaySaving,
  handleSaveGatewayConfig,
  handleQrUpload,
  onActivateHistoryQr
}) => {
  const qrHistoryList: QrHistoryItem[] = club.qrHistory || [
    {
      id: 'qr-default',
      qrUrl: club.defaultUpiQrUrl || `upi://pay?pa=mits.${(club.subdomain || 'treasury').split('.')[0]}@okicici&pn=${encodeURIComponent(club.name || 'MITS Club')}&cu=INR`,
      upiId: `mits.${(club.subdomain || 'treasury').split('.')[0]}@okicici`,
      label: 'Institutional Treasury Default QR',
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true
    }
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Active Payment QR & Link Manager */}
        <section className="xl:col-span-5 uni-pill-card p-10 rounded-[4rem] border border-[var(--border-color)] space-y-8 shadow-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                <QrCode size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-[var(--text-main)] font-display tracking-tight uppercase italic">Payment QR & Link Node</h3>
                <p className="text-[10px] text-[var(--text-secondary)] font-mono">Live Institutional Gateway</p>
              </div>
            </div>
            <button
              onClick={handleQrUpload}
              className="px-5 py-3 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-wider hover:scale-105 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
            >
              <Edit3 size={16} /> Edit / Change Link
            </button>
          </div>

          <div className="flex flex-col items-center gap-6 py-4">
            <div className="w-56 h-56 bg-white p-4 rounded-[3rem] shadow-2xl border-4 border-[var(--border-color)] flex items-center justify-center overflow-hidden">
              {club.defaultUpiQrUrl && (club.defaultUpiQrUrl.startsWith('http') || club.defaultUpiQrUrl.startsWith('data:')) ? (
                <img src={club.defaultUpiQrUrl} className="w-full h-full object-contain" alt="UPI QR" />
              ) : (
                <ClixQRCode
                  value={buildEventUpiString({
                    upiId: club.defaultUpiQrUrl,
                    clubName: club.name,
                    subdomain: club.subdomain
                  })}
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              )}
            </div>

            <div className="w-full text-center space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Active Dynamic QR
              </span>
              <p className="text-xs font-mono font-bold text-[var(--text-main)] break-all max-w-sm mx-auto p-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                {club.defaultUpiQrUrl || `mits.${(club.subdomain || 'treasury').split('.')[0]}@okicici`}
              </p>
            </div>
          </div>
        </section>

        {/* Gateway API Configuration */}
        <section className="xl:col-span-7 uni-pill-card p-10 rounded-[4rem] border border-[var(--border-color)] space-y-10 shadow-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                <Settings size={28} />
              </div>
              <h3 className="text-xl font-black text-[var(--text-main)] font-display tracking-tight uppercase italic">Gateway Configuration</h3>
            </div>
            <button
              onClick={() => setGatewayConfig({ ...gatewayConfig, isActive: !gatewayConfig.isActive })}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                gatewayConfig.isActive ? 'bg-emerald-600/20 text-emerald-500 border border-emerald-500/20' : 'bg-rose-600/20 text-rose-500 border border-rose-600/20'
              }`}
            >
              {gatewayConfig.isActive ? 'Active' : 'Offline'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Merchant Hub ID</label>
              <input
                type="text"
                value={gatewayConfig.merchantId}
                onChange={e => setGatewayConfig({ ...gatewayConfig, merchantId: e.target.value })}
                className="w-full px-6 py-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)] outline-none focus:border-blue-500 text-sm font-bold text-[var(--text-main)]"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Sequence API Key</label>
              <div className="relative">
                <input
                  type={showSecrets ? 'text' : 'password'}
                  value={gatewayConfig.apiKey}
                  onChange={e => setGatewayConfig({ ...gatewayConfig, apiKey: e.target.value })}
                  className="w-full px-6 py-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)] outline-none focus:border-blue-500 text-sm font-bold text-[var(--text-main)]"
                />
                <button
                  type="button"
                  onClick={() => setShowSecrets(!showSecrets)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                >
                  {showSecrets ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-6 border-t border-[var(--border-color)]">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 italic">Auth Token Protocols required for Stripe / Razorpay integration.</p>
            <button
              onClick={handleSaveGatewayConfig}
              disabled={isGatewaySaving}
              className="px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-blue-500/20 hover:scale-[1.05] transition-all"
            >
              {isGatewaySaving ? 'Syncing...' : <><Save size={18} /> Commit Config</>}
            </button>
          </div>
        </section>
      </div>

      {/* QR Code & Payment Link History Ledger */}
      <section className="uni-pill-card p-10 rounded-[4rem] border border-[var(--border-color)] space-y-8 shadow-2xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/10 flex items-center justify-center text-amber-500">
              <History size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-[var(--text-main)] font-display tracking-tight uppercase italic">QR Link Audit Ledger</h3>
              <p className="text-[10px] text-[var(--text-secondary)] font-mono">Historical record of all configured payment links & QR assets</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-[var(--text-secondary)]">{qrHistoryList.length} Archived Items</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrHistoryList.map((item, index) => {
            const isCurrentlyActive = item.qrUrl === club.defaultUpiQrUrl || (index === 0 && !club.defaultUpiQrUrl);
            return (
              <div
                key={item.id || index}
                className={`p-6 rounded-[2.5rem] border transition-all space-y-4 flex flex-col justify-between ${
                  isCurrentlyActive ? 'border-primary bg-blue-600/5 shadow-xl' : 'border-[var(--border-color)] bg-[var(--bg-main)] hover:border-blue-500/30'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-[var(--text-secondary)]">{item.createdAt || 'Previous Record'}</span>
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      isCurrentlyActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                    }`}>
                      {isCurrentlyActive ? 'Active Link' : 'Archived'}
                    </span>
                  </div>

                  <p className="font-bold text-sm text-[var(--text-main)] truncate">{item.label || `QR Link Config #${index + 1}`}</p>
                  <p className="text-xs font-mono text-[var(--text-secondary)] break-all line-clamp-2 p-2 rounded-xl bg-white/5">
                    {item.qrUrl}
                  </p>
                </div>

                {!isCurrentlyActive && onActivateHistoryQr && (
                  <button
                    onClick={() => onActivateHistoryQr(item.qrUrl)}
                    className="w-full py-3 bg-[var(--primary-soft)] border border-[var(--border-color)] text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={14} /> Make Active Payment Link
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

const ProcurementHub: React.FC<any> = ({ club, isFaculty, handleApproveQuotation, handleRejectQuotation, setIsQuoteModalOpen }) => (
  <section className="uni-pill-card p-12 rounded-[4rem] border border-[var(--border-color)] space-y-12 shadow-2xl">
    <div className="flex justify-between items-center"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500"><FileText size={28} /></div><h3 className="text-2xl font-black text-[var(--text-main)] font-display tracking-tighter uppercase italic">Procurement Hub</h3></div><button onClick={() => setIsQuoteModalOpen(true)} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all"><Plus size={18} /> New Quotation</button></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {club.quotations?.map(quote => (
        <div key={quote.id} className="p-8 rounded-[3rem] bg-[var(--bg-main)] border border-[var(--border-color)] space-y-6 hover:border-blue-500/30 transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-start"><span className="text-[9px] font-black uppercase tracking-widest opacity-40">{quote.date}</span><span className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border ${quote.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : quote.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>{quote.status} Protocol</span></div>
            <h4 className="text-2xl font-black text-[var(--text-main)] leading-tight uppercase italic">{quote.title}</h4>
            <p className="text-xs text-[var(--text-secondary)] font-medium italic opacity-60">"Contractor: {quote.vendorName}"</p>
            <div className="pt-4 border-t border-[var(--border-color)]"><p className="text-3xl font-black text-[var(--text-main)] font-display">₹{quote.amount}</p><p className="text-[8px] font-black uppercase tracking-widest opacity-30 mt-1">Institutional Disbursement</p></div>
          </div>
          {isFaculty && quote.status === 'Pending' && (
            <div className="flex gap-3 pt-6"><button onClick={() => handleApproveQuotation(quote.id)} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"><Check size={16} /> Approve</button><button onClick={() => handleRejectQuotation(quote.id)} className="p-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl hover:bg-rose-600 transition-all"><X size={18} /></button></div>
          )}
        </div>
      ))}
    </div>
  </section>
);

const QuotationModal: React.FC<any> = ({ setIsQuoteModalOpen, newQuote, setNewQuote, handleAddQuotation }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
    <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl" onClick={() => setIsQuoteModalOpen(false)} />
    <div className="relative max-w-xl w-full uni-pill-card rounded-[4rem] border border-[var(--border-color)] p-12 overflow-hidden shadow-2xl">
      <div className="flex justify-between items-start mb-10"><h3 className="text-2xl font-black text-[var(--text-main)] uppercase italic tracking-tighter">New Disbursement Quote</h3><button onClick={() => setIsQuoteModalOpen(false)} className="p-4 rounded-2xl text-[var(--text-secondary)] hover:bg-rose-500 hover:text-white transition-all"><X size={20} /></button></div>
      <form onSubmit={handleAddQuotation} className="space-y-6">
        <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Procurement Title</label><input type="text" required value={newQuote.title} onChange={e => setNewQuote({ ...newQuote, title: e.target.value })} className="w-full px-6 py-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)] outline-none focus:border-blue-500 text-sm font-bold text-[var(--text-main)]" placeholder="e.g. Server Maintenance" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Vendor Node</label><input type="text" required value={newQuote.vendor} onChange={e => setNewQuote({ ...newQuote, vendor: e.target.value })} className="w-full px-6 py-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)] outline-none focus:border-blue-500 text-sm font-bold text-[var(--text-main)]" placeholder="Entity Name" /></div>
          <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Amount (₹)</label><input type="number" required value={newQuote.amount} onChange={e => setNewQuote({ ...newQuote, amount: Number(e.target.value) })} className="w-full px-6 py-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)] outline-none focus:border-blue-500 text-sm font-bold text-[var(--text-main)]" /></div>
        </div>
        <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Objective Details</label><textarea required value={newQuote.desc} onChange={e => setNewQuote({ ...newQuote, desc: e.target.value })} className="w-full px-6 py-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)] outline-none focus:border-blue-500 text-sm font-bold text-[var(--text-main)] min-h-[100px] resize-none" placeholder="Description of procurement objective..." /></div>
        <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all">Submit for Audit</button>
      </form>
    </div>
  </div>
);

interface Props { club: Club; registrations: Registration[]; events: Event[]; onApprovePayment: (id: string) => void; onUpdateQuotes: (quotes: Quotation[]) => void; onUpdateQr: (url: string) => void; isDarkMode: boolean; isFaculty?: boolean; }

const ClubFinance: React.FC<Props> = ({ club, registrations = [], events = [], onApprovePayment, onUpdateQuotes, onUpdateQr, isDarkMode, isFaculty = false }) => {
  const safeClub = club || { id: '', name: 'Club Treasury', category: 'Technical', themeColor: '#2563eb', subdomain: 'club', facultyCoordinatorId: '', leadership: {} };
  const safeRegs = Array.isArray(registrations) ? registrations : [];
  const safeEvents = Array.isArray(events) ? events : [];

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [newQuote, setNewQuote] = useState({ title: '', vendor: '', amount: 0, desc: '' });
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string | null>(null);
  const [gatewayConfig, setGatewayConfig] = useState<PaymentGatewayConfig>(
    safeClub.paymentGatewayConfig || { provider: 'ManualUPI', isActive: true, apiKey: '', secretKey: '', merchantId: '' }
  );
  const [showSecrets, setShowSecrets] = useState(false);
  const [isGatewaySaving, setIsGatewaySaving] = useState(false);

  const financeRegs = safeRegs.filter(r => r && (r.paymentType === 'UPI' || r.paymentType === 'Gateway'));
  const totalRevenue = financeRegs.filter(r => r.status === 'Approved').reduce((acc, r) => acc + (safeEvents.find(e => e?.id === r.eventId)?.fee || 0), 0);
  const pendingAmount = financeRegs.filter(r => r.status === 'Pending').reduce((acc, r) => acc + (safeEvents.find(e => e?.id === r.eventId)?.fee || 0), 0);
  const totalApprovedQuotes = (safeClub.quotations || []).filter(q => q && q.status === 'Approved').reduce((acc, q) => acc + q.amount, 0);

  const handleAddQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    const quote: Quotation = { id: `q-${Date.now()}`, title: newQuote.title, vendorName: newQuote.vendor, amount: Number(newQuote.amount), description: newQuote.desc, status: 'Pending', date: new Date().toISOString().split('T')[0] };
    onUpdateQuotes([...(safeClub.quotations || []), quote]);
    setIsQuoteModalOpen(false); setNewQuote({ title: '', vendor: '', amount: 0, desc: '' });
  };

  const handleQrUpload = async () => {
    const url = prompt("Enter Direct UPI Address or QR Image URL:", safeClub.defaultUpiQrUrl || '');
    if (!url) return;
    const label = prompt("Enter a label for this payment link (e.g. Treasury Account 2026):", "Custom Payment Node") || "Payment Node";

    const newItem: QrHistoryItem = {
      id: `qr-${Date.now()}`,
      qrUrl: url,
      upiId: url.includes('@') ? url : `mits.${(safeClub.subdomain || 'treasury').split('.')[0]}@okicici`,
      label,
      createdAt: new Date().toLocaleDateString(),
      isActive: true
    };

    const updatedHistory = [newItem, ...(safeClub.qrHistory || [])];
    onUpdateQr(url);
    await db.updateClub({ ...safeClub, defaultUpiQrUrl: url, qrHistory: updatedHistory });
  };

  const handleActivateHistoryQr = async (url: string) => {
    onUpdateQr(url);
    const updatedHistory = (safeClub.qrHistory || []).map(h => ({
      ...h,
      isActive: h.qrUrl === url
    }));
    await db.updateClub({ ...safeClub, defaultUpiQrUrl: url, qrHistory: updatedHistory });
  };

  const handleSaveGatewayConfig = async () => { setIsGatewaySaving(true); await db.updateClub({ ...safeClub, paymentGatewayConfig: gatewayConfig }); setIsGatewaySaving(false); alert("Gateway matrix updated."); };

  return (
    <div className="p-6 md:p-12 max-w-[1700px] mx-auto space-y-12 md:space-y-16 relative z-10 animate-in fade-in duration-700">
      <ProofPreviewModal proofUrl={proofPreviewUrl} onClose={() => setProofPreviewUrl(null)} />
      <FinanceHeader isDarkMode={isDarkMode} clubName={safeClub.name} />
      <FinanceKPIs totalRevenue={totalRevenue} pendingAmount={pendingAmount} totalApprovedQuotes={totalApprovedQuotes} isDarkMode={isDarkMode} />
      <EventOversightPanel events={safeEvents} />
      <TransactionMatrix financeRegs={financeRegs} events={safeEvents} onApprovePayment={onApprovePayment} onPreviewProof={setProofPreviewUrl} />
      <InfrastructureMatrix
        club={safeClub}
        gatewayConfig={gatewayConfig}
        setGatewayConfig={setGatewayConfig}
        showSecrets={showSecrets}
        setShowSecrets={setShowSecrets}
        isGatewaySaving={isGatewaySaving}
        handleSaveGatewayConfig={handleSaveGatewayConfig}
        handleQrUpload={handleQrUpload}
        onActivateHistoryQr={handleActivateHistoryQr}
      />
      <ProcurementHub club={safeClub} isFaculty={isFaculty} handleApproveQuotation={(id: string) => onUpdateQuotes((safeClub.quotations || []).map(q => q.id === id ? { ...q, status: 'Approved' } : q))} handleRejectQuotation={(id: string) => onUpdateQuotes((safeClub.quotations || []).map(q => q.id === id ? { ...q, status: 'Rejected' } : q))} setIsQuoteModalOpen={setIsQuoteModalOpen} />
      {isQuoteModalOpen && <QuotationModal setIsQuoteModalOpen={setIsQuoteModalOpen} newQuote={newQuote} setNewQuote={setNewQuote} handleAddQuotation={handleAddQuotation} />}
    </div>
  );
};

export default ClubFinance;
