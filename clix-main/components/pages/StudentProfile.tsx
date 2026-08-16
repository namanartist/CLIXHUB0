import React, { useState, useRef, useEffect } from 'react';
import { User, Registration, Applicant, Event, Role, ClubRole } from '../../types';
import { db } from '../../db';
import { formatDisplayDateTime } from '../../lib/formatDate';
import {
   Camera,
   Save,
   Edit2,
   Zap,
   User as UserIcon,
   Mail,
   Phone,
   Book,
   MapPin,
   Fingerprint,
   CheckCircle2,
   X,
   Plus,
   ShieldCheck,
   PenTool,
   Layers,
   Activity,
   Briefcase,
   Calendar,
   ArrowUpRight,
   MoreHorizontal,
   Award
} from 'lucide-react';

const ProfileHeader: React.FC<any> = ({ formData, isEditing, fileInputRef, handleImageUpload, handleSave, setIsEditing, onPreviewPhoto }) => (
   <div className="lg:w-1/3 flex flex-col items-center">
      <div className="w-full uni-pill-card rounded-[4.5rem] border border-[var(--border-color)] p-12 text-center space-y-10 shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-12 opacity-0 group-hover:opacity-5 transition-all"><Zap size={200} className="text-primary" /></div>
         <div className="relative inline-block">
            <div className={`w-40 h-40 md:w-48 md:h-48 rounded-2xl p-2 bg-gradient-to-br from-primary to-blue-600 shadow-3xl group/img relative overflow-hidden`}>
               <div role="button" tabIndex={0} onClick={() => formData.photoUrl && onPreviewPhoto('photo', formData.photoUrl)} className="w-full h-full rounded-[1.5rem] bg-transparent flex items-center justify-center overflow-hidden transition-all cursor-pointer">
                  {formData.photoUrl ? <img src={formData.photoUrl} className="w-full h-full object-cover" alt="Profile" /> : <UserIcon size={64} className="text-[var(--text-secondary)] opacity-50" />}
               </div>
               {isEditing && (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-primary/80 backdrop-blur-sm opacity-0 group-hover/img:opacity-100 transition-all flex flex-col items-center justify-center text-white gap-2">
                     <Camera size={40} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Update Asset</span>
                  </button>
               )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
            <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-2xl border-4 border-[#111C44]">
               <Zap size={20} fill="currentColor" />
            </div>
         </div>
         <div className="space-y-2 text-center">
            <div className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">
               <ShieldCheck size={14} /> {formData.globalRole}
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text-main)] leading-tight">{formData.name}</h2>
            <p className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">{formData.enrollmentNumber || '—'}</p>
            {formData.email && <p className="text-[11px] text-[var(--text-secondary)]">{formData.email}</p>}
         </div>
         <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className={`w-full py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${isEditing ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-primary text-white shadow-primary/30 hover:scale-[1.02]'}`}>
            {isEditing ? <><Save size={18} /> Commit Ledger</> : <><Edit2 size={18} /> Modify Identity</>}
         </button>
      </div>
   </div>
);

const ProfileStats: React.FC<any> = ({ formData, myRegistrations, myApplications }) => (
   <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="uni-pill-card rounded-[3rem] border border-[var(--border-color)] bg-[var(--bg-main)] p-6 shadow-2xl">
         <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--text-secondary)]">Club engagements</p>
         <p className="mt-3 text-3xl font-black text-[var(--text-main)]">{formData.clubMemberships?.length || 0}</p>
         <p className="mt-2 text-sm text-[var(--text-secondary)]">Active club roles across MITS</p>
      </div>
      <div className="uni-pill-card rounded-[3rem] border border-[var(--border-color)] bg-[var(--bg-main)] p-6 shadow-2xl">
         <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--text-secondary)]">Mission logs</p>
         <p className="mt-3 text-3xl font-black text-[var(--text-main)]">{myRegistrations.length}</p>
         <p className="mt-2 text-sm text-[var(--text-secondary)]">Events and approvals you have participated in</p>
      </div>
      <div className="uni-pill-card rounded-[3rem] border border-[var(--border-color)] bg-[var(--bg-main)] p-6 shadow-2xl">
         <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--text-secondary)]">Applications</p>
         <p className="mt-3 text-3xl font-black text-[var(--text-main)]">{myApplications.length}</p>
         <p className="mt-2 text-sm text-[var(--text-secondary)]">Pending membership or leadership applications</p>
      </div>
      <div className="uni-pill-card rounded-[3rem] border border-[var(--border-color)] bg-[var(--bg-main)] p-6 shadow-2xl">
         <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--text-secondary)]">Institutional authority</p>
         <p className="mt-3 text-3xl font-black text-[var(--text-main)]">{formData.globalRole}</p>
         <p className="mt-2 text-sm text-[var(--text-secondary)]">{formData.globalRole === 'DEAN' ? 'Dean authority active' : formData.globalRole === 'FACULTY' ? 'Faculty coordinator' : 'Student profile'}</p>
      </div>
   </div>
);

const InstitutionalIdentity: React.FC<any> = ({ formData, isEditing, setFormData, inputClasses }) => (
   <div className="lg:w-2/3 space-y-10">
      <div className="uni-pill-card rounded-[4rem] border border-[var(--border-color)] p-12 space-y-12 shadow-2xl">
         <div className="flex items-center gap-6"><div className="w-14 h-1 bg-primary rounded-full" /><h3 className="text-2xl font-black text-[var(--text-main)] italic tracking-tighter uppercase leading-none">Institutional Identity</h3></div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4"><label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-4">Legal Designation</label><input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={!isEditing} className={inputClasses} /></div>
            <div className="space-y-4"><label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-4">Communication Uplink (Email)</label><input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} disabled={!isEditing} className={inputClasses} /></div>
            <div className="space-y-4"><label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-4">Enrollment Node ID</label><input value={formData.enrollmentNumber} onChange={e => setFormData({ ...formData, enrollmentNumber: e.target.value })} disabled={!isEditing} className={inputClasses} /></div>
            <div className="space-y-4"><label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-4">Deployment Branch</label><input value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })} disabled={!isEditing} className={inputClasses} /></div>
         </div>
      </div>
   </div>
);

const InstitutionalSeal: React.FC<any> = ({ formData, isEditing, signatureInputRef, handleSignatureUpload, setFormData, onPreviewSignature }) => (
   <div className="uni-pill-card uni-pill-card border border-[var(--border-color)] p-10 space-y-8 shadow-2xl">
      <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500"><ShieldCheck size={28} /></div><h4 className="text-xl font-black text-[var(--text-main)] italic uppercase tracking-tighter">Authority Seal</h4></div>
      <div className="h-40 bg-transparent rounded-3xl border border-[var(--border-color)] relative group overflow-hidden flex items-center justify-center">
         {formData.signatureUrl ? (
            <button type="button" onClick={() => onPreviewSignature('signature', formData.signatureUrl)} className="w-full h-full flex items-center justify-center p-4">
               <img src={formData.signatureUrl} className="max-h-[80%] object-contain" alt="Seal" />
            </button>
         ) : (
            <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest italic">Seal not generated.</p>
         )}
         {isEditing && (
            <div className="absolute inset-0 flex items-end justify-center p-4 gap-3 opacity-0 group-hover:opacity-100 transition-all">
               <button type="button" onClick={() => signatureInputRef.current?.click()} className="px-4 py-2 bg-primary text-white rounded-xl text-[11px] font-black">Upload</button>
               {formData.signatureUrl && (
                  <>
                     <a href={formData.signatureUrl} download={`signature-${formData.name.replace(/\s+/g, '') || 'user'}.png`} className="px-4 py-2 bg-white/90 text-[var(--text-main)] rounded-xl text-[11px] font-black">Download</a>
                     <button type="button" onClick={(e) => { e.preventDefault(); setFormData(prev => ({ ...prev, signatureUrl: '' })); }} className="px-4 py-2 bg-rose-500 text-white rounded-xl text-[11px] font-black">Remove</button>
                  </>
               )}
            </div>
         )}
         <input type="file" ref={signatureInputRef} className="hidden" onChange={handleSignatureUpload} accept="image/*" />
      </div>
      <p className="text-[9px] font-bold text-slate-600 leading-relaxed uppercase tracking-widest italic">"Seal used for automated institutional validation across all authorized credentials."</p>
   </div>
);

const KnowledgeIndex: React.FC<any> = ({ formData, isEditing, newSkill, setNewSkill, addSkill, removeSkill }) => (
   <div className="uni-pill-card uni-pill-card border border-[var(--border-color)] p-10 space-y-8 shadow-2xl">
      <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Layers size={28} /></div><h4 className="text-xl font-black text-[var(--text-main)] italic uppercase tracking-tighter">Knowledge Index</h4></div>
      <div className="flex flex-wrap gap-3">
         {(formData.skills || []).map((s: string) => (
            <div key={s} className="px-5 py-2 bg-[var(--primary-soft)] rounded-xl border border-[var(--border-color)] flex items-center gap-3 group/skill hover:border-primary/50 transition-all">
               <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{s}</span>
               {isEditing && <button onClick={() => removeSkill(s)} className="text-rose-500 opacity-0 group-hover/skill:opacity-100 transition-all"><X size={14} /></button>}
            </div>
         ))}
      </div>
      {isEditing && (
         <form onSubmit={addSkill} className="flex gap-4"><input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="New Skill Node..." className="flex-1 px-6 py-4 bg-transparent rounded-2xl border border-[var(--border-color)] outline-none focus:border-primary text-xs font-bold text-[var(--text-main)]" /><button type="submit" className="p-4 bg-primary text-white rounded-2xl"><Plus size={20} /></button></form>
      )}
   </div>
);

const ActiveCommissions: React.FC<any> = ({ formData, isEditing, setFormData }) => (
   <div className="uni-pill-card rounded-[4rem] border border-[var(--border-color)] p-12 space-y-10 shadow-2xl">
      <div className="flex items-center gap-4"><div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><ShieldCheck size={32} /></div><h3 className="text-2xl font-black text-[var(--text-main)] italic uppercase tracking-tighter">Active Commissions</h3></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {formData.clubMemberships.map((m: any, i: number) => (
            <div key={i} className="p-8 bg-transparent border border-[var(--border-color)] rounded-[2.5rem] flex items-center justify-between group hover:border-primary/50 transition-all">
               <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--primary-soft)] flex items-center justify-center text-2xl font-black text-[var(--text-main)] italic">{m.clubId[0]}</div>
                  <div><p className="text-sm font-black text-[var(--text-main)] uppercase">{m.role}</p><p className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">{m.clubId} Sector</p></div>
               </div>
               <MoreHorizontal className="text-slate-700" />
            </div>
         ))}
      </div>
   </div>
);

const MissionLogs: React.FC<any> = ({ myRegistrations, events }) => (
   <div className="uni-pill-card uni-pill-card border border-[var(--border-color)] p-10 space-y-8 shadow-2xl">
      <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500"><Activity size={28} /></div><h4 className="text-xl font-black text-[var(--text-main)] italic uppercase tracking-tighter">Mission Logs</h4></div>
      <div className="space-y-4">
         {myRegistrations.slice(0, 4).map((reg: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-5 bg-transparent rounded-2xl border border-[var(--border-color)] group hover:border-blue-500/30 transition-all">
               <div><p className="text-xs font-black text-[var(--text-main)] uppercase italic">{events.find((e: any) => e.id === reg.eventId)?.title}</p><p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest mt-1">{formatDisplayDateTime(reg.timestamp)}</p></div>
               <div className={`w-2.5 h-2.5 rounded-full ${reg.status === 'Approved' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-amber-500 shadow-[0_0_10px_#f59e0b]'}`} />
            </div>
         ))}
      </div>
   </div>
);

const FleetDeployment: React.FC<any> = ({ myApplications }) => (
   <div className="uni-pill-card uni-pill-card border border-[var(--border-color)] p-10 space-y-8 shadow-2xl">
      <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Briefcase size={28} /></div><h4 className="text-xl font-black text-[var(--text-main)] italic uppercase tracking-tighter">Fleet Deployment</h4></div>
      <div className="space-y-4">
         {myApplications.slice(0, 4).map((app: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-5 bg-transparent rounded-2xl border border-[var(--border-color)] group hover:border-primary/30 transition-all">
               <div><p className="text-xs font-black text-[var(--text-main)] uppercase italic">{app.clubId}</p><p className="text-[9px] font-black text-primary uppercase tracking-widest mt-1">{app.stage}</p></div>
               <ArrowUpRight size={18} className="text-slate-700" />
            </div>
         ))}
      </div>
   </div>
);

const MediaPreviewModal: React.FC<{ previewMedia: { type: 'photo' | 'signature'; url: string } | null; onClose: () => void }> = ({ previewMedia, onClose }) => (
   previewMedia ? (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
         <div className="relative max-w-4xl w-full rounded-[2rem] overflow-hidden border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-2xl">
            <button type="button" onClick={onClose} className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-3 text-white hover:bg-black/80 transition-all">×</button>
            <div className="p-6">
               <div className="mb-4 text-sm uppercase tracking-[0.35em] text-[var(--text-secondary)]">Preview {previewMedia.type === 'photo' ? 'Profile Photo' : 'Signature Seal'}</div>
               <div className="rounded-[2rem] overflow-hidden bg-[var(--bg-main)] border border-[var(--border-color)]">
                  <img src={previewMedia.url} alt={`${previewMedia.type} preview`} className="w-full max-h-[80vh] object-contain" />
               </div>
            </div>
         </div>
      </div>
   ) : null
);

interface Props { user: User; onSave: (updatedUser: User) => void; isDarkMode: boolean; registrations: Registration[]; applicants: Applicant[]; events: Event[]; }

const StudentProfile: React.FC<Props> = ({ user, onSave, isDarkMode, registrations, applicants, events }) => {
   const [formData, setFormData] = useState<User>({ ...user });
   const [isEditing, setIsEditing] = useState(false);
   const [newSkill, setNewSkill] = useState('');
   const [showSuccessToast, setShowSuccessToast] = useState(false);
   const [previewMedia, setPreviewMedia] = useState<{ type: 'photo' | 'signature'; url: string } | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);
   const signatureInputRef = useRef<HTMLInputElement>(null);

   const myRegistrations = registrations.filter(r => r.studentId === user.id);
   const myApplications = applicants.filter(a => a.name === user.name);
   const isAuthority = user.globalRole === Role.FACULTY || user.globalRole === Role.DEAN || user.clubMemberships.some(m => m.role === ClubRole.PRESIDENT);

   const handleSave = () => { onSave(formData); setIsEditing(false); setShowSuccessToast(true); setTimeout(() => setShowSuccessToast(false), 3000); };
   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { setFormData(prev => ({ ...prev, photoUrl: reader.result as string })); }; reader.readAsDataURL(file); } };
   const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         const reader = new FileReader(); reader.onload = (event) => {
            const img = new Image(); img.src = event.target?.result as string;
            img.onload = () => {
               const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height; const ctx = canvas.getContext('2d');
               if (ctx) {
                  ctx.drawImage(img, 0, 0); const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height); const data = imgData.data;
                  for (let i = 0; i < data.length; i += 4) { if (data[i] > 200 && data[i + 1] > 200 && data[i + 2] > 200) data[i + 3] = 0; }
                  ctx.putImageData(imgData, 0, 0); setFormData(prev => ({ ...prev, signatureUrl: canvas.toDataURL() }));
               }
            };
         }; reader.readAsDataURL(file);
      }
   };

   const previewMediaItem = (type: 'photo' | 'signature', url: string) => setPreviewMedia({ type, url });

   const addSkill = (e: React.FormEvent) => { e.preventDefault(); if (newSkill.trim() && !(formData.skills || []).includes(newSkill.trim())) { setFormData(prev => ({ ...prev, skills: [...(prev.skills || []), newSkill.trim()] })); setNewSkill(''); } };
   const removeSkill = (skillToRemove: string) => { if (!isEditing) return; setFormData(prev => ({ ...prev, skills: (prev.skills || []).filter(s => s !== skillToRemove) })); };

   const inputClasses = `w-full h-16 px-6 rounded-2xl border outline-none transition-all text-sm font-[900] uppercase tracking-widest ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:border-primary placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 focus:border-primary placeholder:text-slate-400'} ${!isEditing ? 'opacity-60 cursor-default' : ''}`;

   return (
      <div className="p-8 md:p-14 max-w-[1700px] mx-auto space-y-20 relative animate-in fade-in duration-700">
         {showSuccessToast && <div className="fixed top-24 right-10 z-[100] animate-in fade-in slide-in-from-right-8"><div className="bg-emerald-600 text-white px-8 py-5 rounded-[2rem] shadow-3xl flex items-center gap-4 font-black text-[10px] uppercase tracking-widest"><CheckCircle2 size={24} /> Records Synchronized</div></div>}
         <MediaPreviewModal previewMedia={previewMedia} onClose={() => setPreviewMedia(null)} />
         <div className="flex flex-col lg:flex-row gap-12">
            <ProfileHeader formData={formData} isEditing={isEditing} fileInputRef={fileInputRef} handleImageUpload={handleImageUpload} handleSave={handleSave} setIsEditing={setIsEditing} onPreviewPhoto={previewMediaItem} />
            <InstitutionalIdentity formData={formData} isEditing={isEditing} setFormData={setFormData} inputClasses={inputClasses} />
         </div>
         <ProfileStats formData={formData} myRegistrations={myRegistrations} myApplications={myApplications} />
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-12">
               {isAuthority && <InstitutionalSeal formData={formData} isEditing={isEditing} signatureInputRef={signatureInputRef} handleSignatureUpload={handleSignatureUpload} setFormData={setFormData} onPreviewSignature={previewMediaItem} />}
               {user.globalRole === Role.DEAN && (
                  <div className="uni-pill-card rounded-[4rem] border border-[var(--border-color)] bg-[var(--primary-soft)] p-10 shadow-2xl">
                     <div className="flex items-center gap-4"><div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><ShieldCheck size={32} /></div><h3 className="text-2xl font-black text-[var(--text-main)] uppercase tracking-tighter">Dean Credential Hub</h3></div>
                     <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">As a Dean, you can upload your official signature and manage your profile details. System Admin uses this profile for approval workflows and credential generation.</p>
                  </div>
               )}
               <KnowledgeIndex formData={formData} isEditing={isEditing} newSkill={newSkill} setNewSkill={setNewSkill} addSkill={addSkill} removeSkill={removeSkill} />
            </div>
            <div className="lg:col-span-8 space-y-12">
               <ActiveCommissions formData={formData} isEditing={isEditing} setFormData={setFormData} />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <MissionLogs myRegistrations={myRegistrations} events={events} />
                  <FleetDeployment myApplications={myApplications} />
               </div>
            </div>
         </div>
      </div>
   );
};

export default StudentProfile;
