import React, { useState } from 'react';
import { Club, Event, User, ClubProject, ClubTeamMember, ClubGalleryItem, ClubAnnouncement } from '../../types';
import { CLUB_THEMES, ClubThemeDefinition, getClubTheme } from '../../../lib/clubThemes';
import {
  Palette,
  FileText,
  Globe2,
  Eye,
  Rocket,
  CheckCircle2,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Copy,
  ExternalLink,
  Plus,
  Trash2,
  Users,
  Trophy,
  QrCode,
  Sparkles,
  ShieldCheck,
  Save,
  Layers,
  Code2,
  Image as ImageIcon,
  Radio,
  Share2,
  Sliders,
  Sun,
  Moon,
  LayoutTemplate,
  UserPlus,
  Maximize2
} from 'lucide-react';
import { ClubPublicWebsite } from '../ClubPublicWebsite';

interface ClubSiteEditorProps {
  club: Club;
  events?: Event[];
  members?: User[];
  onSave: (updatedClub: Club) => void;
  isDarkMode?: boolean;
}

export const ClubSiteEditor: React.FC<ClubSiteEditorProps> = ({
  club,
  events = [],
  members = [],
  onSave,
  isDarkMode: _isDarkMode
}) => {
  // Local Editor State
  const [editedClub, setEditedClub] = useState<Club>({
    ...club,
    siteTheme: club.siteTheme || 'obsidian-pro',
    themeColor: club.themeColor || '#3b82f6',
    leadership: club.leadership || {},
    achievements: club.achievements || [],
    projects: club.projects || [],
    teamMembers: club.teamMembers || [],
    gallery: club.gallery || [],
    announcements: club.announcements || [],
    socialLinks: club.socialLinks || {},
    customSections: club.customSections || []
  });

  const [activeTab, setActiveTab] = useState<'themes' | 'branding' | 'projects' | 'team' | 'achievements' | 'gallery' | 'announcements' | 'social' | 'recruitment' | 'payment'>('themes');
  const [themeFilter, setThemeFilter] = useState<'all' | 'dark' | 'light'>('all');
  const [viewportMode, setViewportMode] = useState<'fluid' | 'laptop' | 'tablet' | 'mobile'>('fluid');
  const [customWidth, setCustomWidth] = useState<number>(1200);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // New Project Form
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjTech, setNewProjTech] = useState('');
  const [newProjGithub, setNewProjGithub] = useState('');
  const [newProjDemo, setNewProjDemo] = useState('');

  // New Team Member Form
  const [newMemName, setNewMemName] = useState('');
  const [newMemRole, setNewMemRole] = useState('');
  const [newMemPhoto, setNewMemPhoto] = useState('');
  const [newMemBatch, setNewMemBatch] = useState('');

  // New Achievement Form
  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchDesc, setNewAchDesc] = useState('');
  const [newAchDate, setNewAchDate] = useState('');

  // New Gallery Item Form
  const [newGalTitle, setNewGalTitle] = useState('');
  const [newGalCategory, setNewGalCategory] = useState<'Events' | 'Workshops' | 'Competitions' | 'Team'>('Events');
  const [newGalUrl, setNewGalUrl] = useState('');

  // New Announcement Form
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnTag, setNewAnnTag] = useState<'Recruitment' | 'Event' | 'Results' | 'Notice'>('Notice');

  const publicUrl = `https://${editedClub.subdomain || editedClub.id}.mitsgwl.ac.in`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSelectTheme = (theme: ClubThemeDefinition) => {
    setEditedClub(prev => ({
      ...prev,
      siteTheme: theme.id,
      themeColor: theme.accent
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editedClub);
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 3000);
    } catch (err: any) {
      alert(err?.message || 'Failed to save site configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  // Add Project
  const addProject = () => {
    if (!newProjTitle) return;
    const project: ClubProject = {
      id: `proj-${Date.now()}`,
      title: newProjTitle,
      description: newProjDesc,
      techStack: newProjTech ? newProjTech.split(',').map(s => s.trim()) : ['React', 'TypeScript'],
      githubUrl: newProjGithub || undefined,
      demoUrl: newProjDemo || undefined,
      status: 'Active'
    };
    setEditedClub(prev => ({
      ...prev,
      projects: [...(prev.projects || []), project]
    }));
    setNewProjTitle('');
    setNewProjDesc('');
    setNewProjTech('');
    setNewProjGithub('');
    setNewProjDemo('');
  };

  const removeProject = (id: string) => {
    setEditedClub(prev => ({
      ...prev,
      projects: (prev.projects || []).filter(p => p.id !== id)
    }));
  };

  // Add Team Member
  const addTeamMember = () => {
    if (!newMemName || !newMemRole) return;
    const member: ClubTeamMember = {
      id: `mem-${Date.now()}`,
      name: newMemName,
      role: newMemRole,
      photoUrl: newMemPhoto || undefined,
      batch: newMemBatch || 'Batch 2026',
      tier: 'Core'
    };
    setEditedClub(prev => ({
      ...prev,
      teamMembers: [...(prev.teamMembers || []), member]
    }));
    setNewMemName('');
    setNewMemRole('');
    setNewMemPhoto('');
    setNewMemBatch('');
  };

  const removeTeamMember = (id: string) => {
    setEditedClub(prev => ({
      ...prev,
      teamMembers: (prev.teamMembers || []).filter(m => m.id !== id)
    }));
  };

  // Add Achievement
  const addAchievement = () => {
    if (!newAchTitle) return;
    const item = {
      id: `ach-${Date.now()}`,
      title: newAchTitle,
      description: newAchDesc,
      date: newAchDate || new Date().getFullYear().toString()
    };
    setEditedClub(prev => ({
      ...prev,
      achievements: [...(prev.achievements || []), item]
    }));
    setNewAchTitle('');
    setNewAchDesc('');
    setNewAchDate('');
  };

  const removeAchievement = (id: string) => {
    setEditedClub(prev => ({
      ...prev,
      achievements: (prev.achievements || []).filter((a: any) => a.id !== id)
    }));
  };

  // Add Gallery Item
  const addGalleryItem = () => {
    if (!newGalTitle || !newGalUrl) return;
    const item: ClubGalleryItem = {
      id: `gal-${Date.now()}`,
      title: newGalTitle,
      category: newGalCategory,
      mediaUrl: newGalUrl,
      date: new Date().getFullYear().toString()
    };
    setEditedClub(prev => ({
      ...prev,
      gallery: [...(prev.gallery || []), item]
    }));
    setNewGalTitle('');
    setNewGalUrl('');
  };

  const removeGalleryItem = (id: string) => {
    setEditedClub(prev => ({
      ...prev,
      gallery: (prev.gallery || []).filter(g => g.id !== id)
    }));
  };

  // Add Announcement
  const addAnnouncement = () => {
    if (!newAnnTitle || !newAnnContent) return;
    const item: ClubAnnouncement = {
      id: `ann-${Date.now()}`,
      title: newAnnTitle,
      content: newAnnContent,
      tag: newAnnTag,
      date: new Date().toLocaleDateString()
    };
    setEditedClub(prev => ({
      ...prev,
      announcements: [...(prev.announcements || []), item]
    }));
    setNewAnnTitle('');
    setNewAnnContent('');
  };

  const removeAnnouncement = (id: string) => {
    setEditedClub(prev => ({
      ...prev,
      announcements: (prev.announcements || []).filter(a => a.id !== id)
    }));
  };

  const filteredThemes = CLUB_THEMES.filter(t => {
    if (themeFilter === 'dark') return t.category === 'dark';
    if (themeFilter === 'light') return t.category === 'light';
    return true;
  });

  return (
    <div className="flex h-[calc(100vh-4.5rem)] overflow-hidden bg-[#030712] text-slate-100 selection:bg-blue-600 selection:text-white font-sans antialiased">
      {/* ─── LEFT: CONTROLS & BUILDER SIDEBAR ─────────────────────────────────── */}
      <div className="w-[460px] shrink-0 flex flex-col border-r border-white/[0.08] bg-[#070b16]/95 backdrop-blur-xl shadow-2xl z-10">
        {/* Sidebar Header */}
        <div className="p-5 border-b border-white/[0.08] space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <LayoutTemplate size={18} />
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight text-white">Club Site Builder</h1>
                <p className="text-[11px] text-slate-400">Themes & Real-Time Sync</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all disabled:opacity-60"
            >
              {isSaving ? <Sparkles size={13} className="animate-spin" /> : <Save size={13} />}
              {isSaving ? 'Saving...' : 'Save Site'}
            </button>
          </div>

          {/* Subdomain Display */}
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Globe2 size={14} className="text-blue-400 shrink-0" />
              <p className="text-xs font-mono text-slate-300 truncate">{publicUrl}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleCopyUrl}
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs flex items-center gap-1 transition-all"
                title="Copy URL"
              >
                <Copy size={12} /> {copiedUrl ? 'Copied' : ''}
              </button>
              <a
                href={`/club/${club.id}/website`}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-xs transition-all"
                title="Open Live Website"
              >
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {saveSuccessMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={14} /> Published to Supabase database!
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex px-3 pt-2 gap-1 border-b border-white/[0.08] bg-white/[0.01] overflow-x-auto custom-scrollbar">
          {[
            { id: 'themes', label: 'Themes', icon: LayoutTemplate },
            { id: 'branding', label: 'Brand', icon: Palette },
            { id: 'projects', label: 'Projects', icon: Code2 },
            { id: 'team', label: 'Team', icon: Users },
            { id: 'achievements', label: 'Trophies', icon: Trophy },
            { id: 'gallery', label: 'Gallery', icon: ImageIcon },
            { id: 'announcements', label: 'Notices', icon: Radio },
            { id: 'social', label: 'Social', icon: Share2 },
            { id: 'recruitment', label: 'Recruit', icon: UserPlus },
            { id: 'payment', label: 'Treasury', icon: QrCode },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center justify-center gap-1 py-2 px-2.5 text-[10px] font-bold uppercase tracking-wider transition-all rounded-t-lg shrink-0 ${
                activeTab === tab.id
                  ? 'text-blue-400 bg-white/[0.06] border-t border-x border-white/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
              }`}
            >
              <tab.icon size={12} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Builder Panels */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          {/* THEMES & TEMPLATES TAB */}
          {activeTab === 'themes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Curated Site Themes</span>
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setThemeFilter('all')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${themeFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setThemeFilter('dark')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${themeFilter === 'dark' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                  >
                    <Moon size={11} /> Dark
                  </button>
                  <button
                    type="button"
                    onClick={() => setThemeFilter('light')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${themeFilter === 'light' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                  >
                    <Sun size={11} /> Light
                  </button>
                </div>
              </div>

              {/* Themes Grid */}
              <div className="space-y-3">
                {filteredThemes.map(theme => {
                  const isSelected = (editedClub.siteTheme || 'obsidian-pro') === theme.id;
                  return (
                    <div
                      key={theme.id}
                      onClick={() => handleSelectTheme(theme)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/10 shadow-lg ring-1 ring-blue-500'
                          : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">{theme.name}</span>
                            <span
                              className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                                theme.category === 'dark'
                                  ? 'bg-slate-900 text-slate-300 border-slate-700'
                                  : 'bg-amber-100 text-amber-900 border-amber-300'
                              }`}
                            >
                              {theme.category === 'dark' ? 'Dark Mode' : 'Light Mode'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{theme.description}</p>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                            <CheckCircle2 size={14} />
                          </div>
                        )}
                      </div>

                      {/* Color swatch indicator */}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.06]">
                        <span className="text-[10px] text-slate-500 font-mono">Palette:</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-full border border-white/20" style={{ background: theme.bgMain }} title="Background" />
                          <div className="w-4 h-4 rounded-full border border-white/20" style={{ background: theme.surface }} title="Surface Card" />
                          <div className="w-4 h-4 rounded-full border border-white/20" style={{ background: theme.accent }} title="Accent Glow" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* BRANDING TAB */}
          {activeTab === 'branding' && (
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Organization Name
                <input
                  value={editedClub.name}
                  onChange={e => setEditedClub({ ...editedClub, name: e.target.value })}
                  className="mt-1.5 block w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-blue-500"
                />
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Subdomain Prefix
                <div className="mt-1.5 flex items-center rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                  <input
                    value={editedClub.subdomain || editedClub.id}
                    onChange={e => setEditedClub({ ...editedClub, subdomain: e.target.value })}
                    className="w-full bg-transparent px-3.5 py-2.5 text-xs font-semibold text-white outline-none font-mono"
                  />
                  <span className="px-3 text-xs font-mono text-slate-500 bg-white/[0.03] border-l border-white/10">.mitsgwl.ac.in</span>
                </div>
              </label>

              {/* Theme Color Override */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Accent Color Override
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={editedClub.themeColor || '#3b82f6'}
                    onChange={e => setEditedClub({ ...editedClub, themeColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    value={editedClub.themeColor || '#3b82f6'}
                    onChange={e => setEditedClub({ ...editedClub, themeColor: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-mono font-bold text-white uppercase outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Hero Tagline
                <input
                  value={editedClub.tagline || ''}
                  onChange={e => setEditedClub({ ...editedClub, tagline: e.target.value })}
                  placeholder="e.g. Empowering Next-Gen Robotics Engineers"
                  className="mt-1.5 block w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs font-medium text-white outline-none focus:border-blue-500"
                />
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Description & Mission
                <textarea
                  rows={3}
                  value={editedClub.description || ''}
                  onChange={e => setEditedClub({ ...editedClub, description: e.target.value })}
                  placeholder="Outline the core missions, regular workshops, and institutional achievements..."
                  className="mt-1.5 block w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs font-normal text-white outline-none focus:border-blue-500 resize-none leading-relaxed"
                />
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Logo URL
                <input
                  value={editedClub.logoUrl || ''}
                  onChange={e => setEditedClub({ ...editedClub, logoUrl: e.target.value })}
                  placeholder="https://... / logo.png"
                  className="mt-1.5 block w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs font-medium text-white outline-none focus:border-blue-500"
                />
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Banner Background URL
                <input
                  value={editedClub.bannerUrl || ''}
                  onChange={e => setEditedClub({ ...editedClub, bannerUrl: e.target.value })}
                  placeholder="https://... / banner.jpg"
                  className="mt-1.5 block w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs font-medium text-white outline-none focus:border-blue-500"
                />
              </label>
            </div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2.5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">Add Portfolio Project</h3>
                <input
                  value={newProjTitle}
                  onChange={e => setNewProjTitle(e.target.value)}
                  placeholder="Project Name (e.g. Autonomous Drone)"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-white outline-none"
                />
                <textarea
                  rows={2}
                  value={newProjDesc}
                  onChange={e => setNewProjDesc(e.target.value)}
                  placeholder="Brief description..."
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-xs font-normal text-white outline-none resize-none"
                />
                <input
                  value={newProjTech}
                  onChange={e => setNewProjTech(e.target.value)}
                  placeholder="Tech stack (e.g. Python, ROS, PyTorch)"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-white outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={newProjGithub}
                    onChange={e => setNewProjGithub(e.target.value)}
                    placeholder="GitHub Repo URL"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-white outline-none"
                  />
                  <input
                    value={newProjDemo}
                    onChange={e => setNewProjDemo(e.target.value)}
                    placeholder="Live Demo URL"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-white outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={addProject}
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus size={13} /> Add Project
                </button>
              </div>

              {/* Projects List */}
              <div className="space-y-2">
                {editedClub.projects?.map(proj => (
                  <div key={proj.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-white truncate">{proj.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{proj.techStack?.join(' • ')}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProject(proj.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEAM TAB WITH AUTO DATABASE SYNC & CUSTOM MEMBERS */}
          {activeTab === 'team' && (
            <div className="space-y-5">
              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">Executive Council</h3>
                  <span className="text-[9px] font-mono text-emerald-400">Auto-Synced with DB</span>
                </div>

                <label className="block text-xs font-semibold text-slate-400">
                  Faculty Mentor Name
                  <input
                    value={editedClub.facultyCoordinatorNames?.[0] || ''}
                    onChange={e => setEditedClub({ ...editedClub, facultyCoordinatorNames: [e.target.value] })}
                    placeholder="Dr. Rajesh Sharma"
                    className="mt-1 block w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-500"
                  />
                </label>

                <label className="block text-xs font-semibold text-slate-400">
                  President Name
                  <input
                    value={editedClub.leadership?.['President'] || ''}
                    onChange={e => setEditedClub({
                      ...editedClub,
                      leadership: { ...editedClub.leadership, President: e.target.value }
                    })}
                    placeholder="Student Full Name"
                    className="mt-1 block w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-blue-500"
                  />
                </label>

                <label className="block text-xs font-semibold text-slate-400">
                  Vice President Name
                  <input
                    value={editedClub.leadership?.['Vice President'] || ''}
                    onChange={e => setEditedClub({
                      ...editedClub,
                      leadership: { ...editedClub.leadership, 'Vice President': e.target.value }
                    })}
                    placeholder="Student Full Name"
                    className="mt-1 block w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-blue-500"
                  />
                </label>

                <label className="block text-xs font-semibold text-slate-400">
                  General Secretary Name
                  <input
                    value={editedClub.leadership?.['General Secretary'] || ''}
                    onChange={e => setEditedClub({
                      ...editedClub,
                      leadership: { ...editedClub.leadership, 'General Secretary': e.target.value }
                    })}
                    placeholder="Student Full Name"
                    className="mt-1 block w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-blue-500"
                  />
                </label>
              </div>

              {/* Add Member Profile */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2.5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">Add Core Team Member</h3>
                <input
                  value={newMemName}
                  onChange={e => setNewMemName(e.target.value)}
                  placeholder="Member Name (e.g. Aditi Gupta)"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-white outline-none"
                />
                <input
                  value={newMemRole}
                  onChange={e => setNewMemRole(e.target.value)}
                  placeholder="Role (e.g. Technical Lead, UI/UX Head)"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-white outline-none"
                />
                <input
                  value={newMemPhoto}
                  onChange={e => setNewMemPhoto(e.target.value)}
                  placeholder="Photo URL (https://... / leave blank for auto avatar)"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-white outline-none"
                />
                <input
                  value={newMemBatch}
                  onChange={e => setNewMemBatch(e.target.value)}
                  placeholder="Batch (e.g. Batch of 2026)"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-white outline-none"
                />
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus size={13} /> Add Member
                </button>
              </div>

              {/* Member Roster List */}
              <div className="space-y-2">
                {editedClub.teamMembers?.map(m => (
                  <div key={m.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={m.photoUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(m.name)}`}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover border border-white/10"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-white truncate">{m.name}</p>
                        <p className="text-[10px] text-blue-400">{m.role} • {m.batch || 'Member'}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTeamMember(m.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {activeTab === 'achievements' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2.5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">Add Accolade / Trophy</h3>
                <input
                  value={newAchTitle}
                  onChange={e => setNewAchTitle(e.target.value)}
                  placeholder="Title (e.g. 1st Prize Hackathon)"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-white outline-none"
                />
                <input
                  value={newAchDate}
                  onChange={e => setNewAchDate(e.target.value)}
                  placeholder="Year (e.g. 2025)"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-white outline-none"
                />
                <textarea
                  rows={2}
                  value={newAchDesc}
                  onChange={e => setNewAchDesc(e.target.value)}
                  placeholder="Description..."
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-xs font-normal text-white outline-none resize-none"
                />
                <button
                  type="button"
                  onClick={addAchievement}
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus size={13} /> Add Trophy
                </button>
              </div>

              {/* Achievements List */}
              <div className="space-y-2">
                {editedClub.achievements?.map((ach: any) => (
                  <div key={ach.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-white truncate">{ach.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{ach.date} • {ach.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAchievement(ach.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GALLERY TAB */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2.5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">Add Gallery Photo</h3>
                <input
                  value={newGalTitle}
                  onChange={e => setNewGalTitle(e.target.value)}
                  placeholder="Caption"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-white outline-none"
                />
                <select
                  value={newGalCategory}
                  onChange={e => setNewGalCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-white outline-none"
                >
                  <option>Events</option>
                  <option>Workshops</option>
                  <option>Competitions</option>
                  <option>Team</option>
                </select>
                <input
                  value={newGalUrl}
                  onChange={e => setNewGalUrl(e.target.value)}
                  placeholder="Image URL (https://...)"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-white outline-none"
                />
                <button
                  type="button"
                  onClick={addGalleryItem}
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus size={13} /> Add Photo
                </button>
              </div>

              {/* Gallery Items List */}
              <div className="space-y-2">
                {editedClub.gallery?.map(g => (
                  <div key={g.id} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-2.5">
                    <img src={g.mediaUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-white truncate">{g.title}</p>
                      <p className="text-[9px] text-blue-400 font-mono">{g.category}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeGalleryItem(g.id)}
                      className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/10 shrink-0"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ANNOUNCEMENTS TAB */}
          {activeTab === 'announcements' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2.5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">Add Notice / Broadcast</h3>
                <input
                  value={newAnnTitle}
                  onChange={e => setNewAnnTitle(e.target.value)}
                  placeholder="Title (e.g. Venue Change)"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-white outline-none"
                />
                <select
                  value={newAnnTag}
                  onChange={e => setNewAnnTag(e.target.value as any)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-white outline-none"
                >
                  <option>Notice</option>
                  <option>Event</option>
                  <option>Recruitment</option>
                  <option>Results</option>
                </select>
                <textarea
                  rows={2}
                  value={newAnnContent}
                  onChange={e => setNewAnnContent(e.target.value)}
                  placeholder="Notice message..."
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-xs font-normal text-white outline-none resize-none"
                />
                <button
                  type="button"
                  onClick={addAnnouncement}
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus size={13} /> Broadcast Notice
                </button>
              </div>

              {/* Announcements List */}
              <div className="space-y-2">
                {editedClub.announcements?.map(ann => (
                  <div key={ann.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-white truncate">{ann.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{ann.tag} • {ann.content}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAnnouncement(ann.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SOCIAL LINKS TAB */}
          {activeTab === 'social' && (
            <div className="space-y-3.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                GitHub Organization URL
                <input
                  value={editedClub.socialLinks?.github || ''}
                  onChange={e => setEditedClub({
                    ...editedClub,
                    socialLinks: { ...editedClub.socialLinks, github: e.target.value }
                  })}
                  placeholder="https://github.com/..."
                  className="mt-1.5 block w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs font-medium text-white outline-none focus:border-blue-500"
                />
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                LinkedIn Page URL
                <input
                  value={editedClub.socialLinks?.linkedin || ''}
                  onChange={e => setEditedClub({
                    ...editedClub,
                    socialLinks: { ...editedClub.socialLinks, linkedin: e.target.value }
                  })}
                  placeholder="https://linkedin.com/company/..."
                  className="mt-1.5 block w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs font-medium text-white outline-none focus:border-blue-500"
                />
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Instagram URL
                <input
                  value={editedClub.socialLinks?.instagram || ''}
                  onChange={e => setEditedClub({
                    ...editedClub,
                    socialLinks: { ...editedClub.socialLinks, instagram: e.target.value }
                  })}
                  placeholder="https://instagram.com/..."
                  className="mt-1.5 block w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs font-medium text-white outline-none focus:border-blue-500"
                />
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                YouTube Channel URL
                <input
                  value={editedClub.socialLinks?.youtube || ''}
                  onChange={e => setEditedClub({
                    ...editedClub,
                    socialLinks: { ...editedClub.socialLinks, youtube: e.target.value }
                  })}
                  placeholder="https://youtube.com/@..."
                  className="mt-1.5 block w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs font-medium text-white outline-none focus:border-blue-500"
                />
              </label>
            </div>
          )}

          {/* RECRUITMENT TAB */}
          {activeTab === 'recruitment' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs text-white">Recruitment Portal Status</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Toggle live application button on your microsite.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditedClub({ ...editedClub, recruitmentActive: !editedClub.recruitmentActive })}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    editedClub.recruitmentActive
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {editedClub.recruitmentActive ? 'Open' : 'Closed'}
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium space-y-1.5">
                <p className="font-bold">Active Open Tracks for Candidates:</p>
                <ul className="list-disc list-inside text-[11px] space-y-0.5 text-slate-300">
                  <li>Technical Development (AI, Web, App, Robotics)</li>
                  <li>Design & Creative Media (UI/UX, 3D, Motion)</li>
                  <li>Operations & Event Logistics</li>
                  <li>Outreach & Public Relations</li>
                </ul>
              </div>
            </div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === 'payment' && (
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Club Treasury UPI ID
                <input
                  value={editedClub.defaultUpiQrUrl || 'mits.treasury@okicici'}
                  onChange={e => setEditedClub({ ...editedClub, defaultUpiQrUrl: e.target.value })}
                  placeholder="e.g. acm.mits@okaxis"
                  className="mt-1.5 block w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs font-mono font-semibold text-white outline-none focus:border-blue-500"
                />
              </label>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-400 leading-relaxed">
                All paid event passes will automatically generate locked dynamic UPI QR codes using this treasury handle.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── RIGHT: LIVE INTERACTIVE RESIZABLE PREVIEW ───────────────────────── */}
      <div className="flex-1 flex flex-col bg-[#02040a] min-w-0 overflow-hidden">
        {/* Viewport Top Bar */}
        <div className="h-12 border-b border-white/[0.08] px-5 flex items-center justify-between shrink-0 bg-[#060a16]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Live Theme: {getClubTheme(editedClub.siteTheme).name} ({getClubTheme(editedClub.siteTheme).category.toUpperCase()})
            </span>
          </div>

          {/* Viewport Resizer & Presets */}
          <div className="flex items-center gap-3">
            {/* Custom Pixel Slider */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span>{viewportMode === 'fluid' ? '100% Fluid' : `${customWidth}px`}</span>
              <input
                type="range"
                min="340"
                max="1440"
                value={viewportMode === 'fluid' ? 1440 : customWidth}
                onChange={e => {
                  setViewportMode('laptop');
                  setCustomWidth(Number(e.target.value));
                }}
                className="w-24 accent-blue-500 cursor-pointer"
                title="Slide to resize viewport"
              />
            </div>

            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
              <button
                onClick={() => setViewportMode('fluid')}
                className={`p-1.5 rounded-md transition-all ${viewportMode === 'fluid' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                title="Full Responsive Fluid Screen"
              >
                <Maximize2 size={14} />
              </button>
              <button
                onClick={() => { setViewportMode('laptop'); setCustomWidth(1024); }}
                className={`p-1.5 rounded-md transition-all ${viewportMode === 'laptop' && customWidth === 1024 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                title="Laptop View (1024px)"
              >
                <Laptop size={14} />
              </button>
              <button
                onClick={() => { setViewportMode('tablet'); setCustomWidth(768); }}
                className={`p-1.5 rounded-md transition-all ${viewportMode === 'tablet' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                title="Tablet View (768px)"
              >
                <Tablet size={14} />
              </button>
              <button
                onClick={() => { setViewportMode('mobile'); setCustomWidth(375); }}
                className={`p-1.5 rounded-md transition-all ${viewportMode === 'mobile' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                title="Mobile View (375px)"
              >
                <Smartphone size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Viewport Canvas Frame */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex items-start justify-center bg-black/60 custom-scrollbar">
          <div
            style={{
              width: viewportMode === 'fluid' ? '100%' : `${customWidth}px`,
              maxWidth: '100%'
            }}
            className="transition-all duration-300 shadow-[0_25px_60px_rgba(0,0,0,0.7)] rounded-[2rem] border border-white/[0.1] overflow-hidden"
          >
            <ClubPublicWebsite
              club={editedClub}
              events={events}
              members={members}
              onRegister={() => alert('Registration pass action preview.')}
              onSubmitApplication={() => alert('Recruitment application submission preview.')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubSiteEditor;
