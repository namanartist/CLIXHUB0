import React from 'react';
import { ShieldCheck, ArrowUpRight, Activity, ChevronRight } from 'lucide-react';

interface ProposalSectionProps {
   setIsProposalModalOpen: (val: boolean) => void;
}

export const ProposalSection: React.FC<ProposalSectionProps> = ({ setIsProposalModalOpen }) => (
   <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.08),_transparent_35%)]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16 items-stretch">
         <div className="rounded-[3rem] border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl shadow-slate-900/10 p-8 md:p-12 flex flex-col justify-between">
            <div className="space-y-6">
               <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px] font-black uppercase tracking-[0.35em]">
                  <ShieldCheck size={16} />
                  Administrative Intake
               </div>
               <div className="space-y-4">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--text-main)] leading-tight">Initiate a new club or team with the Dean approval flow</h2>
                  <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl leading-7">Launch a new institutional unit from concept to active dashboard. Submit your proposal directly to the Dean, then let the System Admin finalize creation instantly.</p>
               </div>
               <div className="grid sm:grid-cols-2 gap-4">
                  {[
                     { label: 'Strategic Review', value: 'Dean Approval', accent: 'bg-sky-500/10 text-sky-500' },
                     { label: 'Launch Velocity', value: 'Instant Dashboard', accent: 'bg-emerald-500/10 text-emerald-500' },
                     { label: 'Unit Type', value: 'Club or Team', accent: 'bg-violet-500/10 text-violet-500' },
                     { label: 'Mobile-ready', value: 'Adaptive Layout', accent: 'bg-rose-500/10 text-rose-500' }
                  ].map(item => (
                     <div key={item.label} className={`rounded-3xl border border-[var(--border-color)] p-5 ${item.accent} backdrop-blur-sm`}>
                        <p className="text-[9px] uppercase tracking-[0.35em] font-black opacity-70">{item.label}</p>
                        <p className="mt-3 text-base font-black text-[var(--text-main)]">{item.value}</p>
                     </div>
                  ))}
               </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch gap-4">
               <button onClick={() => setIsProposalModalOpen(true)} className="group relative inline-flex items-center justify-center rounded-3xl bg-primary px-8 py-5 text-sm font-black uppercase tracking-[0.45em] text-white transition-all hover:-translate-y-0.5 shadow-2xl shadow-primary/20">
                  Initiate New Unit
                  <ArrowUpRight size={18} className="ml-3 transition-transform group-hover:translate-x-1" />
               </button>
            </div>
         </div>

         <div className="space-y-6">
            <div className="rounded-[3rem] border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl shadow-slate-900/10 p-8 md:p-10">
               <div className="flex items-center justify-between gap-4 mb-8">
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary">Proposal Intelligence</p>
                     <h3 className="mt-3 text-2xl font-black text-[var(--text-main)]">Unit Initialization</h3>
                  </div>
                  <div className="rounded-3xl bg-[var(--bg-surface)] p-4 border border-[var(--border-color)] text-[var(--text-secondary)]">
                     <Activity size={24} />
                  </div>
               </div>
               <div className="grid grid-cols-1 gap-4">
                  <div className="rounded-3xl border border-[var(--border-color)] p-6 bg-[var(--bg-surface)]">
                     <p className="text-[9px] uppercase tracking-[0.35em] font-black text-[var(--text-secondary)]">Dean Response Time</p>
                     <p className="mt-3 text-xl font-black text-[var(--text-main)]"><span className="text-emerald-500"><strong>2 days</strong></span> average</p>
                  </div>
                  <div className="rounded-3xl border border-[var(--border-color)] p-6 bg-[var(--bg-surface)]">
                     <p className="text-[9px] uppercase tracking-[0.35em] font-black text-[var(--text-secondary)]">Dashboard Creation</p>
                     <p className="mt-3 text-xl font-black text-[var(--text-main)]">Automatic on approval</p>
                  </div>
                  <div className="rounded-3xl border border-[var(--border-color)] p-6 bg-[var(--bg-surface)]">
                     <p className="text-[9px] uppercase tracking-[0.35em] font-black text-[var(--text-secondary)]">Unit Forecast</p>
                     <p className="mt-3 text-xl font-black text-[var(--text-main)]">Ready for club or team launch</p>
                  </div>
               </div>
            </div>

            <div className="rounded-[3rem] border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl shadow-slate-900/10 p-8 md:p-10">
               <div className="flex items-center justify-between gap-4 mb-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-secondary)]">Approval Workflow</p>
                  <span className="text-[9px] uppercase tracking-[0.35em] font-black text-white bg-primary/10 px-3 py-2 rounded-full">Dean → System Admin</span>
               </div>
               <div className="space-y-4">
                  {[
                     { title: 'Draft proposal', detail: 'Enter proposal details and submit to the Dean.', icon: ShieldCheck },
                     { title: 'Dean review', detail: 'Dean reviews and forwards approved proposals to system admin.', icon: ArrowUpRight },
                     { title: 'Unit creation', detail: 'System admin creates the club/team dashboard instantly.', icon: Activity }
                  ].map((item, index) => (
                     <div key={item.title} className="flex items-start gap-4 p-5 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                        <div className="w-12 h-12 rounded-3xl bg-primary/10 text-primary grid place-items-center"><item.icon size={20} /></div>
                        <div>
                           <p className="text-sm font-black uppercase tracking-[0.25em] text-[var(--text-main)]">Step {index + 1}</p>
                           <h4 className="mt-2 text-lg font-bold text-[var(--text-main)]">{item.title}</h4>
                           <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{item.detail}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   </section>
);
