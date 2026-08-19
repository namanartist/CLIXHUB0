import React from 'react';
import { Palette, CheckCircle2, Wand2, Sparkles, Loader2, Sliders, RefreshCw } from 'lucide-react';
import { Club } from '@/types';

export const PRESET_THEMES = [
  { id: 'cyberpunk-blue',  name: 'Cyberpunk Blue',  color: '#0055FF', desc: 'Electric high-contrast precision' },
  { id: 'emerald-pulse',   name: 'Emerald Pulse',   color: '#10B981', desc: 'Growth, sustainability & code' },
  { id: 'crimson-force',  name: 'Crimson Sunset',  color: '#EF4444', desc: 'Bold energy & vibrant leadership' },
  { id: 'institutional-gold', name: 'Institutional Gold', color: '#F59E0B', desc: 'Academic warmth & prestige' },
  { id: 'cosmic-purple',  name: 'Cosmic Violet',   color: '#8B5CF6', desc: 'Galaxy-level modern aesthetics' },
  { id: 'rose-quartz',    name: 'Rose Quartz',     color: '#EC4899', desc: 'Creative arts & media vibes' },
  { id: 'arctic-frost',   name: 'Arctic Cyan',     color: '#06B6D4', desc: 'Clean STEM & robotics precision' },
  { id: 'solarized-dark',  name: 'Solarized Dark',  color: '#6366F1', desc: 'Deep indigo developer mode' },
];

interface ThemesTabProps {
  formData: Club;
  applyTheme: (color: string) => void;
  aiThemePrompt: string;
  setAiThemePrompt: (val: string) => void;
  handleGenerateAITheme: () => void;
  isGeneratingTheme: boolean;
  aiTheme: { color: string; name: string; desc: string } | null;
}

export const ThemesTab: React.FC<ThemesTabProps> = ({
  formData, applyTheme, aiThemePrompt, setAiThemePrompt, handleGenerateAITheme, isGeneratingTheme, aiTheme
}) => (
  <div className="space-y-6">
    {/* Preset Color Choices Grid */}
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-main)]/60">Select Theme Palette</p>
        <span className="text-[9px] font-mono text-slate-400">8 Presets Available</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {PRESET_THEMES.map(theme => {
          const active = formData.themeColor === theme.color;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => applyTheme(theme.color)}
              className={`text-left p-3.5 rounded-2xl border transition-all hover:scale-[1.02] active:scale-95 ${
                active ? 'border-2 scale-[1.02] shadow-lg shadow-blue-500/10' : 'border-white/10 hover:border-white/20 bg-white/[0.03]'
              }`}
              style={active ? { borderColor: theme.color, background: `${theme.color}15` } : {}}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-6 h-6 rounded-lg shadow-md" style={{ background: theme.color }} />
                {active && <CheckCircle2 size={14} style={{ color: theme.color }} />}
              </div>
              <p className="text-xs font-bold text-[var(--text-main)] tracking-tight">{theme.name}</p>
              <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{theme.desc}</p>
            </button>
          );
        })}
      </div>
    </div>

    {/* Custom Color Picker Choice */}
    <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-blue-400" />
          <span className="text-xs font-bold text-[var(--text-main)]">Custom Primary Color Choice</span>
        </div>
        <input
          type="color"
          value={formData.themeColor || '#0055FF'}
          onChange={(e) => applyTheme(e.target.value)}
          className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={formData.themeColor || '#0055FF'}
          onChange={(e) => applyTheme(e.target.value)}
          placeholder="#0055FF"
          className="flex-1 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={() => applyTheme('#0055FF')}
          className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-medium"
        >
          Reset
        </button>
      </div>
    </div>

    {/* Smart AI Color Schematics Generator */}
    <div className="p-4 rounded-2xl border border-primary/20 space-y-3" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(0,85,255,0.08))' }}>
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-primary/15 text-primary"><Wand2 size={16} /></div>
        <div>
          <p className="text-xs font-bold text-[var(--text-main)]">AI Palette Generator</p>
          <p className="text-[9px] text-slate-400">Describe your club theme or domain</p>
        </div>
      </div>
      <div className="flex gap-2">
        <input
          value={aiThemePrompt}
          onChange={e => setAiThemePrompt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleGenerateAITheme()}
          placeholder="e.g. cyber robotics, ethical hacking..."
          className="flex-1 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition-all"
        />
        <button
          type="button"
          onClick={handleGenerateAITheme}
          disabled={isGeneratingTheme || !aiThemePrompt.trim()}
          className="px-3 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-all disabled:opacity-40 flex items-center gap-1.5"
        >
          {isGeneratingTheme ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
        </button>
      </div>
      {aiTheme && (
        <button
          type="button"
          onClick={() => applyTheme(aiTheme.color)}
          className={`w-full p-3 rounded-xl border-2 text-left hover:scale-[1.01] transition-all ${formData.themeColor === aiTheme.color ? 'opacity-100' : 'opacity-75 hover:opacity-100'}`}
          style={{ borderColor: aiTheme.color, background: `${aiTheme.color}18` }}
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg" style={{ background: aiTheme.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[var(--text-main)] truncate">{aiTheme.name}</p>
              <p className="text-[9px] text-slate-400 truncate">{aiTheme.desc}</p>
            </div>
            {formData.themeColor === aiTheme.color && <CheckCircle2 size={14} style={{ color: aiTheme.color }} />}
          </div>
        </button>
      )}
    </div>
  </div>
);
