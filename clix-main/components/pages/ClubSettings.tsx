import React, { useState, useRef } from 'react';
import { Club } from '../../types';
import { 
  Settings as SettingsIcon, 
  Undo2, 
  Save, 
  ShieldCheck, 
  Upload, 
  UserPlus, 
  Trash2, 
  CheckCircle2, 
  Globe 
} from 'lucide-react';

interface SettingsHeaderProps {
  isDarkMode: boolean;
  clubName: string;
  handleRevert: () => void;
  handleSave: () => void;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ isDarkMode, clubName, handleRevert, handleSave }) => (
  <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}><SettingsIcon size={28} /></div>
        <h1 className="text-4xl font-black tracking-tight">Administrative Governance</h1>
      </div>
      <p className="text-[var(--text-secondary)] font-medium text-lg">Manage institutional metadata and internal identity for {clubName}.</p>
    </div>
    <div className="flex items-center gap-4">
      <button onClick={handleRevert} className={`px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 border-2 border-dashed ${isDarkMode ? 'border-slate-800 text-slate-500 hover:text-slate-300' : 'border-slate-200 text-slate-400 hover:text-slate-600'}`}><Undo2 size={16} /> Revert</button>
      <button onClick={handleSave} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"><Save size={18} /> Sync Metadata</button>
    </div>
  </header>
);

interface RegistryDetailsProps {
  isDarkMode: boolean;
  formData: Club;
  setFormData: (val: any) => void;
  logoInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RegistryDetails: React.FC<RegistryDetailsProps> = ({
  isDarkMode, formData, setFormData, logoInputRef, handleFileUpload
}) => (
  <section className={`p-10 rounded-[3rem] border ${isDarkMode ? 'bg-[#161b2a] border-slate-800' : 'bg-white border-slate-100 shadow-sm'} space-y-8`}>
    <div className="flex items-center gap-3 border-b border-[var(--border-color)]/10 pb-6"><ShieldCheck className="text-blue-500" size={24} /><h2 className="text-xl font-black uppercase tracking-widest opacity-60">Core Registry Details</h2></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4"><label className="text-[10px] font-black uppercase tracking-widest opacity-40">Official Club Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={`w-full px-6 py-4 rounded-2xl border outline-none focus:border-blue-500 transition-all text-sm font-bold ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} /></div>
      <div className="space-y-4"><label className="text-[10px] font-black uppercase tracking-widest opacity-40">Classification</label><select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as any })} className={`w-full px-6 py-4 rounded-2xl border outline-none focus:border-blue-500 transition-all text-sm font-bold ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`}><option value="Technical">Technical Wing</option><option value="Cultural">Cultural Wing</option><option value="Social">Social Wing</option><option value="Sports">Sports Wing</option></select></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4"><label className="text-[10px] font-black uppercase tracking-widest opacity-40 flex items-center justify-between">Logo Asset <button onClick={() => logoInputRef.current?.click()} className="text-blue-500 hover:underline flex items-center gap-1 normal-case font-bold"><Upload size={10} /> Local Upload</button><input type="file" accept="image/*" className="hidden" ref={logoInputRef} onChange={handleFileUpload} /></label><input type="text" value={formData.logoUrl || ''} onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })} placeholder="Asset URL" className={`w-full px-6 py-4 rounded-2xl border outline-none focus:border-blue-500 transition-all text-sm font-bold ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} /></div>
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">System Accent Color</label>
        <div className="flex gap-4"><input type="color" value={formData.themeColor} onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })} className="w-16 h-14 rounded-xl border-none cursor-pointer bg-transparent overflow-hidden" /><input type="text" value={formData.themeColor} onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })} className={`flex-1 px-6 py-4 rounded-2xl border outline-none focus:border-blue-500 transition-all text-sm font-mono ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} /></div>
      </div>
    </div>
  </section>
);

interface LeadershipRosterProps {
  isDarkMode: boolean;
  formData: Club;
  setFormData: (val: any) => void;
}

const LeadershipRoster: React.FC<LeadershipRosterProps> = ({ isDarkMode, formData, setFormData }) => (
  <section className={`p-10 rounded-[3rem] border ${isDarkMode ? 'bg-[#161b2a] border-slate-800' : 'bg-white border-slate-100 shadow-sm'} space-y-8`}>
    <div className="flex items-center justify-between border-b border-[var(--border-color)]/10 pb-6"><div className="flex items-center gap-3"><UserPlus className="text-emerald-500" size={24} /><h2 className="text-xl font-black uppercase tracking-widest opacity-60">Faculty Council</h2></div></div>
    <div className="space-y-4">
      {formData.facultyCoordinatorNames?.map((name, i) => (
        <div key={i} className="flex gap-4">
          <input type="text" value={name} onChange={(e) => { const newNames = [...(formData.facultyCoordinatorNames || [])]; newNames[i] = e.target.value; setFormData({ ...formData, facultyCoordinatorNames: newNames }); }} className={`flex-1 px-6 py-4 rounded-2xl border outline-none focus:border-blue-500 transition-all text-sm font-bold ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} />
          <button onClick={() => { const newNames = formData.facultyCoordinatorNames?.filter((_, index) => index !== i); setFormData({ ...formData, facultyCoordinatorNames: newNames }); }} className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={18} /></button>
        </div>
      ))}
      <button onClick={() => setFormData({ ...formData, facultyCoordinatorNames: [...(formData.facultyCoordinatorNames || []), ''] })} className="w-full py-4 rounded-2xl border-2 border-dashed border-[var(--border-color)] text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:border-slate-600 transition-all">Add Coordinator Node</button>
    </div>
  </section>
);

const IdentitySnapshot: React.FC<{ isDarkMode: boolean; formData: Club }> = ({ isDarkMode, formData }) => (
  <div className={`p-10 rounded-[3rem] border sticky top-8 ${isDarkMode ? 'bg-blue-600/5 border-blue-600/20' : 'bg-blue-50 border-blue-100'}`}>
    <h3 className="text-sm font-black uppercase tracking-widest text-blue-500 mb-10">Identity Snapshot</h3>
    <div className="space-y-10">
      <div className="flex justify-center">
        <div className="relative group">
          <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 group-hover:opacity-40 transition-all" />
          <div className="w-32 h-32 rounded-[2.5rem] bg-white p-4 shadow-2xl relative z-10 flex items-center justify-center overflow-hidden">
            {formData.logoUrl ? <img src={formData.logoUrl} className="w-full h-full object-contain" alt="Preview" /> : <div className="w-full h-full flex items-center justify-center text-blue-600 font-black text-4xl" style={{ backgroundColor: formData.themeColor }}>{formData.name[0]}</div>}
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="text-center"><h4 className="text-2xl font-black text-[var(--text-main)] mb-2">{formData.name}</h4><p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{formData.category} Wing</p></div>
        <div className="pt-6 border-t border-blue-500/10 space-y-4">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-40"><span>Domain Status</span><span className="text-emerald-500">Live</span></div>
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-40"><span>Visibility</span><span className="flex items-center gap-2"><Globe size={10} /> Public</span></div>
        </div>
      </div>
    </div>
  </div>
);

interface Props { club: Club; onSave: (updatedClub: Club) => void; isDarkMode: boolean; }

const ClubSettings: React.FC<Props> = ({ club, onSave, isDarkMode }) => {
  const [formData, setFormData] = useState<Club>(JSON.parse(JSON.stringify(club)));
  const [showSavedToast, setShowSavedToast] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => { onSave(formData); setShowSavedToast(true); setTimeout(() => setShowSavedToast(false), 3000); };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (file) {
      const reader = new FileReader(); reader.onloadend = () => { setFormData(prev => ({ ...prev, logoUrl: reader.result as string })); }; reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <SettingsHeader isDarkMode={isDarkMode} clubName={club.name} handleRevert={() => setFormData(JSON.parse(JSON.stringify(club)))} handleSave={handleSave} />
      {showSavedToast && <div className="fixed top-20 right-10 z-[100] animate-in fade-in slide-in-from-right-8 duration-300"><div className="bg-emerald-600 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 font-black text-xs uppercase tracking-widest"><CheckCircle2 size={24} /> <span>Governance Ledger Updated</span></div></div>}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <RegistryDetails isDarkMode={isDarkMode} formData={formData} setFormData={setFormData} logoInputRef={logoInputRef} handleFileUpload={handleFileUpload} />
          <LeadershipRoster isDarkMode={isDarkMode} formData={formData} setFormData={setFormData} />
        </div>
        <div className="lg:col-span-4"><IdentitySnapshot isDarkMode={isDarkMode} formData={formData} /></div>
      </div>
    </div>
  );
};

export default ClubSettings;
