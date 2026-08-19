import React, { useMemo, useState } from 'react';
import { PlusCircle, CheckCircle2, ShieldAlert, Sparkles, Printer, X, FileText, Send, Building2, Calendar, Users, ArrowLeft, Check, Layers, Clock, ShieldCheck, ChevronRight, Lock, UserCheck, Shield } from 'lucide-react';
import { Proposal, Role, User } from '../../types';
import { useNavigate } from 'react-router-dom';

interface ProposalWorkflowPageProps {
    currentUser?: User | null;
    proposals?: Proposal[];
    onSubmitProposal: (proposalData: Partial<Proposal>) => Promise<{ success: boolean; id: string }>;
    onApproveProposal: (proposalId: string, comment?: string) => Promise<void>;
    isDarkMode: boolean;
}

const proposalStatusLabel = (status: Proposal['status']) => {
    switch (status) {
        case 'PendingDean': return 'Dean Review';
        case 'PendingSystemAdmin': return 'Admin Provisioning';
        case 'Approved': return 'Fully Approved';
        case 'Rejected': return 'Declined';
        default: return status;
    }
};

const proposalStageMessage = (status: Proposal['status']) => {
    switch (status) {
        case 'PendingDean': return 'Awaiting Institutional Review by Dean Student Welfare';
        case 'PendingSystemAdmin': return 'Dean Endorsed · Awaiting Provisioning by Super Admin';
        case 'Approved': return 'Official Unit Provisioned and Active on CLIX Hub';
        case 'Rejected': return 'Application Closed';
        default: return 'Under Review';
    }
};

export const ProposalWorkflowPage: React.FC<ProposalWorkflowPageProps> = ({
    currentUser,
    proposals = [],
    onSubmitProposal,
    onApproveProposal,
    isDarkMode: _isDarkMode
}) => {
    const navigate = useNavigate();

    // Form state
    const [proposalData, setProposalData] = useState<Partial<Proposal>>({
        type: 'Club',
        title: '',
        category: 'Technical',
        proposerName: currentUser?.name || '',
        proposerRoll: currentUser?.enrollmentNumber || currentUser?.rollNumber || '',
        proposerEmail: currentUser?.email || '',
        missionStatement: '',
        estimatedMembers: 10
    });

    const [activeTab, setActiveTab] = useState<'all' | 'mine' | 'dean' | 'admin'>('all');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

    // Approval modal state
    const [approveModalOpen, setApproveModalOpen] = useState(false);
    const [selectedProposalForApprove, setSelectedProposalForApprove] = useState<Proposal | null>(null);
    const [approveComment, setApproveComment] = useState('');
    const [isApproving, setIsApproving] = useState(false);

    // ─── STRICT RBAC PERMISSIONS ───────────────────────────────────────────────
    const roleStr = String(currentUser?.globalRole || '');
    const isDean = roleStr === Role.DEAN || roleStr === 'Dean';
    const isSuperAdmin = roleStr === Role.SUPER_ADMIN || roleStr === 'Super Admin';
    const isFaculty = roleStr === Role.FACULTY || roleStr === 'Faculty';
    const isStudent = !isDean && !isSuperAdmin && !isFaculty;

    // Derived queues
    const userProposals = useMemo(() => {
        if (!currentUser) return proposals;
        return proposals.filter(p =>
            (p.proposerEmail && p.proposerEmail.toLowerCase() === currentUser.email?.toLowerCase()) ||
            (p.proposerName && p.proposerName.toLowerCase() === currentUser.name?.toLowerCase()) ||
            (p.proposerRoll && (p.proposerRoll === currentUser.enrollmentNumber || p.proposerRoll === currentUser.rollNumber))
        );
    }, [proposals, currentUser]);

    const deanQueue = useMemo(() => {
        return proposals.filter(p => p.status === 'PendingDean');
    }, [proposals]);

    const adminQueue = useMemo(() => {
        return proposals.filter(p => p.status === 'PendingSystemAdmin');
    }, [proposals]);

    const displayedProposals = useMemo(() => {
        if (activeTab === 'mine') return userProposals;
        if (activeTab === 'dean') return deanQueue;
        if (activeTab === 'admin') return adminQueue;
        return proposals;
    }, [activeTab, proposals, userProposals, deanQueue, adminQueue]);

    const handlePrintProposal = (proposal: Proposal) => {
        if ((window as any).openPrintStudio) {
            (window as any).openPrintStudio({
                type: 'offer_letter',
                title: `OFFICIAL REGISTRATION APPLICATION: ${proposal.title.toUpperCase()}`,
                recipientName: proposal.proposerName,
                recipientEmail: proposal.proposerEmail,
                clubName: proposal.title,
                eventName: `Unit Registration Proposal (${proposal.category})`,
                date: new Date(proposal.timestamp || Date.now()).toLocaleDateString(),
                customFields: [
                    { label: 'Application ID', value: proposal.id },
                    { label: 'Unit Title', value: proposal.title },
                    { label: 'Proposal Type', value: proposal.type },
                    { label: 'Category Sector', value: proposal.category },
                    { label: 'Proposer Identity', value: `${proposal.proposerName} (${proposal.proposerRoll || 'N/A'})` },
                    { label: 'Proposer Email', value: proposal.proposerEmail },
                    { label: 'Estimated Initial Members', value: String(proposal.estimatedMembers) },
                    { label: 'Approval Queue Status', value: proposal.status },
                    { label: 'Dean Review Response', value: proposal.deanResponse || 'Pending Review' },
                    { label: 'Mission & Vision Statement', value: proposal.missionStatement },
                ]
            });
        } else {
            window.print();
        }
    };

    const openApproveModal = (proposal: Proposal) => {
        if (!isDean && !isSuperAdmin) {
            alert('RBAC Warning: Only the Dean of Student Welfare or Super Admin can endorse pending proposals.');
            return;
        }
        setSelectedProposalForApprove(proposal);
        setApproveComment('');
        setApproveModalOpen(true);
    };

    const closeApproveModal = () => {
        setSelectedProposalForApprove(null);
        setApproveComment('');
        setApproveModalOpen(false);
    };

    const confirmApprove = async () => {
        if (!selectedProposalForApprove) return;
        setIsApproving(true);
        try {
            await onApproveProposal(selectedProposalForApprove.id, approveComment);
            closeApproveModal();
        } catch (e) {
            console.error('Approval failed:', e);
        } finally {
            setIsApproving(false);
        }
    };

    const handleSuperAdminProvision = async (proposal: Proposal) => {
        if (!isSuperAdmin) {
            alert('RBAC Warning: Only Institutional Super Administrators have authority to provision new units.');
            return;
        }
        await onApproveProposal(proposal.id);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!proposalData.title || !proposalData.proposerName || !proposalData.missionStatement) {
            alert('Please fill all required fields.');
            return;
        }

        setIsSubmitting(true);
        setSubmissionMessage(null);
        try {
            const res = await onSubmitProposal(proposalData);
            if (res && res.success) {
                setSubmissionMessage(`✓ Proposal "${proposalData.title}" submitted successfully! Application ID: ${res.id}`);
                setProposalData({
                    type: 'Club',
                    title: '',
                    category: 'Technical',
                    proposerName: currentUser?.name || '',
                    proposerRoll: currentUser?.enrollmentNumber || currentUser?.rollNumber || '',
                    proposerEmail: currentUser?.email || '',
                    missionStatement: '',
                    estimatedMembers: 10
                });
            }
        } catch (err: any) {
            alert(err?.message || 'Failed to submit proposal.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderProposalCard = (proposal: Proposal) => (
        <div key={proposal.id} className="rounded-3xl border border-white/10 bg-[#090e1c] p-6 sm:p-8 shadow-xl space-y-4 text-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {proposal.type} Proposal
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(proposal.timestamp || Date.now()).toLocaleDateString()}
                        </span>
                    </div>
                    <h3 className="mt-1.5 text-xl font-bold text-white">{proposal.title}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    proposal.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    proposal.status === 'PendingSystemAdmin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                    proposal.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                    {proposalStatusLabel(proposal.status)}
                </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{proposal.missionStatement}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-[11px] text-slate-400">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-slate-500 font-mono text-[9px] block">PROPOSER:</span>
                    <span className="font-bold text-white truncate block">{proposal.proposerName}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-slate-500 font-mono text-[9px] block">CATEGORY:</span>
                    <span className="font-bold text-white truncate block">{proposal.category}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] col-span-2 sm:col-span-1">
                    <span className="text-slate-500 font-mono text-[9px] block">EST. MEMBERS:</span>
                    <span className="font-bold text-white block">{proposal.estimatedMembers} Students</span>
                </div>
            </div>

            {proposal.deanResponse && (
                <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-300">
                    <strong className="font-bold">Dean Response:</strong> {proposal.deanResponse}
                </div>
            )}

            <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    {/* RBAC Protected Actions */}
                    {proposal.status === 'PendingDean' && (isDean || isSuperAdmin) && (
                        <button
                            type="button"
                            onClick={() => openApproveModal(proposal)}
                            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                        >
                            <CheckCircle2 size={14} /> Dean Endorse
                        </button>
                    )}

                    {proposal.status === 'PendingSystemAdmin' && isSuperAdmin && (
                        <button
                            type="button"
                            onClick={() => handleSuperAdminProvision(proposal)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                        >
                            <CheckCircle2 size={14} /> Final Provision
                        </button>
                    )}

                    {proposal.status === 'PendingDean' && !isDean && !isSuperAdmin && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-medium px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <Clock size={13} /> Queued for Dean Endorsement
                        </span>
                    )}

                    {proposal.status === 'PendingSystemAdmin' && !isSuperAdmin && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-purple-400 font-medium px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                            <ShieldCheck size={13} /> Dean Endorsed · Awaiting Admin Provision
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => handlePrintProposal(proposal)}
                    className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
                >
                    <Printer size={13} /> Print Application
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-blue-600 selection:text-white px-4 sm:px-6 md:px-8 py-10 max-w-7xl mx-auto space-y-8">
            {/* Top Navigation & RBAC Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>

                {/* RBAC Perspective Indicator */}
                <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase font-mono text-slate-400">Current Role:</span>
                    {currentUser ? (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                            isSuperAdmin ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                            isDean ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            isFaculty ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                            'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                            <Shield size={12} />
                            {currentUser.globalRole} ({currentUser.name})
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={() => navigate('/auth')}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <Lock size={12} /> Guest (Sign In for Staff Queues)
                        </button>
                    )}
                </div>
            </div>

            {/* Header Hero Section */}
            <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
                <div className="rounded-3xl border border-white/10 bg-[#090e1c] p-8 md:p-10 shadow-2xl space-y-5">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold uppercase tracking-wider">
                        <Sparkles size={14} /> Institutional Unit Protocol
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Initiate a Club, Team or Event</h1>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                        Submit a blueprint to establish an official institutional unit. Your proposal routes securely through Dean Student Welfare review and Super Admin automated provisioning under strict Role-Based Access Control.
                    </p>

                    <div className="grid grid-cols-3 gap-3 pt-2">
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center sm:text-left">
                            <p className="text-[10px] uppercase font-bold text-slate-500">Total Proposals</p>
                            <p className="text-2xl font-extrabold text-white mt-1">{proposals.length}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center sm:text-left">
                            <p className="text-[10px] uppercase font-bold text-slate-500">Dean Queue</p>
                            <p className="text-2xl font-extrabold text-amber-400 mt-1">{deanQueue.length}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center sm:text-left">
                            <p className="text-[10px] uppercase font-bold text-slate-500">Admin Queue</p>
                            <p className="text-2xl font-extrabold text-purple-400 mt-1">{adminQueue.length}</p>
                        </div>
                    </div>
                </div>

                {/* Submission Form */}
                <div className="rounded-3xl border border-white/10 bg-[#090e1c] p-6 sm:p-8 shadow-2xl space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <PlusCircle size={18} className="text-blue-400" /> New Proposal Blueprint
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-3.5">
                        <div className="grid grid-cols-2 gap-3">
                            <select
                                value={proposalData.type}
                                onChange={e => setProposalData({ ...proposalData, type: e.target.value as any })}
                                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-semibold text-white outline-none"
                            >
                                <option value="Club">Permanent Club</option>
                                <option value="Team">Special Project Team</option>
                                <option value="Event">Campus Event</option>
                            </select>

                            <select
                                value={proposalData.category}
                                onChange={e => setProposalData({ ...proposalData, category: e.target.value })}
                                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-semibold text-white outline-none"
                            >
                                <option>Technical</option>
                                <option>Cultural</option>
                                <option>Social</option>
                                <option>Sports</option>
                                <option>General</option>
                            </select>
                        </div>

                        <input
                            required
                            value={proposalData.title}
                            onChange={e => setProposalData({ ...proposalData, title: e.target.value })}
                            placeholder="Unit Title (e.g. AI Research Group)"
                            className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-blue-500"
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <input
                                required
                                value={proposalData.proposerName}
                                onChange={e => setProposalData({ ...proposalData, proposerName: e.target.value })}
                                placeholder="Proposer Legal Name"
                                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-semibold text-white outline-none"
                            />
                            <input
                                required
                                value={proposalData.proposerRoll}
                                onChange={e => setProposalData({ ...proposalData, proposerRoll: e.target.value })}
                                placeholder="Roll Number"
                                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-semibold text-white uppercase outline-none font-mono"
                            />
                        </div>

                        <input
                            required
                            type="email"
                            value={proposalData.proposerEmail}
                            onChange={e => setProposalData({ ...proposalData, proposerEmail: e.target.value })}
                            placeholder="Proposer Email (you@mitsgwl.ac.in)"
                            className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs font-semibold text-white outline-none"
                        />

                        <textarea
                            required
                            rows={3}
                            value={proposalData.missionStatement}
                            onChange={e => setProposalData({ ...proposalData, missionStatement: e.target.value })}
                            placeholder="Briefly state mission, scope, and student benefit..."
                            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs font-normal text-white outline-none resize-none leading-relaxed"
                        />

                        {submissionMessage && (
                            <p className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                                {submissionMessage}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? 'Transmitting...' : <><Send size={14} /> Submit to Dean Queue</>}
                        </button>
                    </form>
                </div>
            </section>

            {/* Queue Filters & Proposals Feed */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">Active Proposal Tracker</span>
                        <span className="text-xs text-slate-400">({displayedProposals.length})</span>
                    </div>

                    <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] overflow-x-auto">
                        <button
                            type="button"
                            onClick={() => setActiveTab('all')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                        >
                            All ({proposals.length})
                        </button>
                        {currentUser && (
                            <button
                                type="button"
                                onClick={() => setActiveTab('mine')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'mine' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                            >
                                My Submissions ({userProposals.length})
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => setActiveTab('dean')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'dean' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
                        >
                            Dean Queue ({deanQueue.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('admin')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'admin' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                        >
                            Admin Queue ({adminQueue.length})
                        </button>
                    </div>
                </div>

                {displayedProposals.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl border border-dashed border-white/10 space-y-2">
                        <FileText className="w-10 h-10 text-slate-500 mx-auto" />
                        <p className="font-bold text-sm text-slate-300">No Proposals in Selected Queue</p>
                        <p className="text-xs text-slate-500">Submit a proposal above to initialize a new club or team.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {displayedProposals.map(renderProposalCard)}
                    </div>
                )}
            </section>

            {/* Approval Modal */}
            {approveModalOpen && selectedProposalForApprove && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
                    <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#090e1c] p-6 sm:p-8 shadow-2xl space-y-4">
                        <button onClick={closeApproveModal} className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white">
                            <X size={16} />
                        </button>

                        <div>
                            <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">Dean Endorsement</span>
                            <h3 className="text-xl font-extrabold text-white mt-1">Endorse {selectedProposalForApprove.title}</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Approve and forward this blueprint to Super Admin for database provisioning.</p>
                        </div>

                        <textarea
                            rows={3}
                            value={approveComment}
                            onChange={e => setApproveComment(e.target.value)}
                            placeholder="Add Dean feedback or review note (optional)..."
                            className="w-full rounded-2xl border border-white/10 bg-black/40 p-3 text-xs text-white outline-none resize-none"
                        />

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={confirmApprove}
                                disabled={isApproving}
                                className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
                            >
                                {isApproving ? 'Endorsing...' : 'Confirm Dean Endorsement'}
                            </button>
                            <button
                                type="button"
                                onClick={closeApproveModal}
                                className="px-4 py-3 rounded-xl bg-white/10 text-slate-300 font-bold text-xs uppercase tracking-wider"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProposalWorkflowPage;
