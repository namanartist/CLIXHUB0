import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ProposalSuccessOverlayProps {
   proposalSuccess: string;
   setProposalSuccess: (val: string | null) => void;
}

export const ProposalSuccessOverlay: React.FC<ProposalSuccessOverlayProps> = ({ proposalSuccess, setProposalSuccess }) => (
   <div className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[#090e1c] border border-emerald-500/30 rounded-[2.5rem] overflow-hidden shadow-2xl text-center text-slate-100">
         <div className="h-1.5 w-full bg-emerald-500" />
         <div className="p-8 md:p-10 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
               <CheckCircle2 size={36} />
            </div>
            <div className="space-y-2">
               <h3 className="text-2xl font-extrabold tracking-tight text-white">Proposal Successfully Logged</h3>
               <p className="text-slate-400 text-xs leading-relaxed">
                  Your unit initiation blueprint is now active in the Dean Student Welfare queue. Reference ID: <strong className="text-blue-400 font-mono">{proposalSuccess}</strong>
               </p>
            </div>
            <button
               type="button"
               onClick={() => setProposalSuccess(null)}
               className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
            >
               Close and Return
            </button>
         </div>
      </div>
   </div>
);

export default ProposalSuccessOverlay;
