import React from 'react';
import { X, Sparkles, Loader2, ShieldCheck } from 'lucide-react';

interface ProposalModalProps {
   setIsProposalModalOpen: (val: boolean) => void;
   proposalData: any;
   setProposalData: (val: any) => void;
   isSubmittingProposal: boolean;
   handleProposalSubmit: (e: React.FormEvent) => void;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({
   setIsProposalModalOpen,
   proposalData,
   setProposalData,
   isSubmittingProposal,
   handleProposalSubmit
}) => (
   <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto" onClick={() => setIsProposalModalOpen(false)}>
      <div className="relative w-full max-w-3xl bg-[#090e1c] border border-white/15 rounded-[2.5rem] md:rounded-[3rem] p-6 sm:p-8 md:p-12 space-y-6 md:space-y-8 my-auto animate-in zoom-in-95 duration-300 shadow-2xl text-slate-100" onClick={e => e.stopPropagation()}>
         <button aria-label="Close proposal modal" onClick={() => setIsProposalModalOpen(false)} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-rose-500/20 hover:text-rose-400 rounded-2xl transition-all border border-white/10 text-slate-300">
            <X size={18} />
         </button>

         <div className="space-y-3">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold uppercase tracking-wider">
               <Sparkles size={14} />
               <span>Unit Initiation Protocol</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">Create your new <span className="text-blue-400">Society or Club</span></h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">Submit your club or team blueprint and route it directly through the Dean approval channel for instant automated provisioning.</p>
         </div>

         <form onSubmit={handleProposalSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Protocol Type</label>
                  <div className="grid grid-cols-3 gap-2">
                     <button type="button" onClick={() => setProposalData({ ...proposalData, type: 'Club' })} className={`h-12 rounded-xl border text-[11px] font-bold uppercase tracking-wider transition-all ${proposalData.type === 'Club' ? 'bg-blue-600 border-blue-500 text-white' : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                        Club
                     </button>
                     <button type="button" onClick={() => setProposalData({ ...proposalData, type: 'Team' })} className={`h-12 rounded-xl border text-[11px] font-bold uppercase tracking-wider transition-all ${proposalData.type === 'Team' ? 'bg-amber-500 border-amber-500 text-white' : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                        Team
                     </button>
                     <button type="button" onClick={() => setProposalData({ ...proposalData, type: 'Event' })} className={`h-12 rounded-xl border text-[11px] font-bold uppercase tracking-wider transition-all ${proposalData.type === 'Event' ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                        Event
                     </button>
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Unit Title</label>
                  <input required value={proposalData.title} onChange={e => setProposalData({ ...proposalData, title: e.target.value })} placeholder="e.g. Robotics & AI Club" className="w-full h-12 rounded-xl border border-white/10 bg-black/40 px-4 text-xs font-semibold text-white outline-none transition-all focus:border-blue-500" />
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Proposer Full Name</label>
                  <input required value={proposalData.proposerName} onChange={e => setProposalData({ ...proposalData, proposerName: e.target.value })} placeholder="Your full legal name" className="w-full h-12 rounded-xl border border-white/10 bg-black/40 px-4 text-xs font-semibold text-white outline-none transition-all focus:border-blue-500" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Roll / Enrollment ID</label>
                  <input required value={proposalData.proposerRoll} onChange={e => setProposalData({ ...proposalData, proposerRoll: e.target.value })} placeholder="0901CS221..." className="w-full h-12 rounded-xl border border-white/10 bg-black/40 px-4 text-xs font-semibold text-white uppercase outline-none transition-all focus:border-blue-500" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Institutional Email</label>
                  <input required type="email" value={proposalData.proposerEmail} onChange={e => setProposalData({ ...proposalData, proposerEmail: e.target.value })} placeholder="you@mitsgwl.ac.in" className="w-full h-12 rounded-xl border border-white/10 bg-black/40 px-4 text-xs font-semibold text-white outline-none transition-all focus:border-blue-500" />
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label htmlFor="proposal-category" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category Sector</label>
                  <select id="proposal-category" value={proposalData.category} onChange={e => setProposalData({ ...proposalData, category: e.target.value })} className="w-full h-12 rounded-xl border border-white/10 bg-[#090e1c] px-4 text-xs font-semibold text-white outline-none transition-all focus:border-blue-500 cursor-pointer">
                     <option>Technical</option>
                     <option>Cultural</option>
                     <option>Social</option>
                     <option>Sports</option>
                     <option>Literary</option>
                     <option>Academic</option>
                     <option>General</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label htmlFor="proposal-members" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Estimated Initial Members</label>
                  <input id="proposal-members" type="number" min={5} max={500} value={proposalData.estimatedMembers} onChange={e => setProposalData({ ...proposalData, estimatedMembers: Number(e.target.value) })} className="w-full h-12 rounded-xl border border-white/10 bg-black/40 px-4 text-xs font-semibold text-white outline-none transition-all focus:border-blue-500" />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mission Rationale & Objectives</label>
               <textarea required rows={4} value={proposalData.missionStatement} onChange={e => setProposalData({ ...proposalData, missionStatement: e.target.value })} placeholder="Outline club objectives, planned workshops, competitions, and student benefit..." className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-xs font-normal text-white outline-none transition-all focus:border-blue-500 resize-none leading-relaxed" />
            </div>

            <div className="pt-2">
               <button type="submit" disabled={isSubmittingProposal} className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                  {isSubmittingProposal ? <>Transmitting Application... <Loader2 className="animate-spin" size={18} /></> : <>Commit Proposal to Dean <ShieldCheck size={18} /></>}
               </button>
               <p className="text-center mt-3 text-[10px] uppercase tracking-wider text-slate-500">Routing: Dean Student Welfare Review ➔ System Admin Provisioning</p>
            </div>
         </form>
      </div>
   </div>
);

export default ProposalModal;
