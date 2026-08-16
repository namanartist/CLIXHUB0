export interface ClubThemeDefinition {
  id: string;
  name: string;
  category: 'dark' | 'light';
  description: string;
  bgMain: string;
  surface: string;
  surfaceSubtle: string;
  borderColor: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  badgeGradient: string;
  previewClass: string;
}

export const CLUB_THEMES: ClubThemeDefinition[] = [
  // ─── DARK THEMES ─────────────────────────────────────────────────────────────
  {
    id: 'obsidian-pro',
    name: 'Obsidian Pro',
    category: 'dark',
    description: 'Deep midnight obsidian with sapphire neon accents. Linear / Apple studio aesthetic.',
    bgMain: '#030712',
    surface: '#0b0f19',
    surfaceSubtle: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    accent: '#3b82f6',
    badgeGradient: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    previewClass: 'bg-[#030712] border-blue-500/40 text-white',
  },
  {
    id: 'cyber-matrix',
    name: 'Cyber Matrix',
    category: 'dark',
    description: 'High-contrast pitch black with radiant cyber emerald. Robotics & Security vibe.',
    bgMain: '#020408',
    surface: '#080d14',
    surfaceSubtle: 'rgba(16, 185, 129, 0.04)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
    textPrimary: '#ffffff',
    textSecondary: '#6ee7b7',
    accent: '#10b981',
    badgeGradient: 'linear-gradient(135deg, #065f46, #10b981)',
    previewClass: 'bg-[#020408] border-emerald-500/40 text-emerald-400',
  },
  {
    id: 'nordic-aurora',
    name: 'Nordic Aurora',
    category: 'dark',
    description: 'Midnight navy with electric violet and amethyst highlights. AI & Research focus.',
    bgMain: '#080b16',
    surface: '#0f1527',
    surfaceSubtle: 'rgba(139, 92, 246, 0.04)',
    borderColor: 'rgba(139, 92, 246, 0.15)',
    textPrimary: '#f8fafc',
    textSecondary: '#c4b5fd',
    accent: '#8b5cf6',
    badgeGradient: 'linear-gradient(135deg, #5b21b6, #8b5cf6)',
    previewClass: 'bg-[#080b16] border-purple-500/40 text-purple-300',
  },
  {
    id: 'crimson-dynasty',
    name: 'Crimson Dynasty',
    category: 'dark',
    description: 'Black carbon with vibrant rose/ruby neon. Aerospace, Gaming & Sports energy.',
    bgMain: '#080406',
    surface: '#13090e',
    surfaceSubtle: 'rgba(244, 63, 94, 0.04)',
    borderColor: 'rgba(244, 63, 94, 0.2)',
    textPrimary: '#ffffff',
    textSecondary: '#fda4af',
    accent: '#f43f5e',
    badgeGradient: 'linear-gradient(135deg, #9f1239, #f43f5e)',
    previewClass: 'bg-[#080406] border-rose-500/40 text-rose-300',
  },

  // ─── LIGHT THEMES ────────────────────────────────────────────────────────────
  {
    id: 'apple-clean-white',
    name: 'Apple Clean White',
    category: 'light',
    description: 'Snow white surfaces with crisp slate typography and sapphire royal blue.',
    bgMain: '#f8fafc',
    surface: '#ffffff',
    surfaceSubtle: '#f1f5f9',
    borderColor: 'rgba(0, 0, 0, 0.08)',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    accent: '#2563eb',
    badgeGradient: 'linear-gradient(135deg, #2563eb, #3b82f6)',
    previewClass: 'bg-[#f8fafc] border-blue-600/30 text-slate-900',
  },
  {
    id: 'stanford-ivory',
    name: 'Stanford Ivory',
    category: 'light',
    description: 'Warm collegiate ivory with prestigious cardinal crimson and gold highlights.',
    bgMain: '#fcfaf6',
    surface: '#ffffff',
    surfaceSubtle: '#f7f2ea',
    borderColor: 'rgba(153, 27, 27, 0.12)',
    textPrimary: '#1c1917',
    textSecondary: '#57534e',
    accent: '#991b1b',
    badgeGradient: 'linear-gradient(135deg, #7f1d1d, #991b1b)',
    previewClass: 'bg-[#fcfaf6] border-red-800/30 text-stone-900',
  },
  {
    id: 'emerald-botanical',
    name: 'Emerald Botanical',
    category: 'light',
    description: 'Fresh mint cream with deep forest emerald accents. Sustainability & Social focus.',
    bgMain: '#f0fdf4',
    surface: '#ffffff',
    surfaceSubtle: '#dcfce7',
    borderColor: 'rgba(4, 120, 87, 0.12)',
    textPrimary: '#064e3b',
    textSecondary: '#047857',
    accent: '#059669',
    badgeGradient: 'linear-gradient(135deg, #047857, #10b981)',
    previewClass: 'bg-[#f0fdf4] border-emerald-600/30 text-emerald-950',
  },
  {
    id: 'monochrome-minimal',
    name: 'Monochrome Minimal',
    category: 'light',
    description: 'Ultra-clean alabaster with pure carbon typography and sleek design aesthetics.',
    bgMain: '#f1f5f9',
    surface: '#ffffff',
    surfaceSubtle: '#e2e8f0',
    borderColor: 'rgba(15, 23, 42, 0.12)',
    textPrimary: '#09090b',
    textSecondary: '#3f3f46',
    accent: '#09090b',
    badgeGradient: 'linear-gradient(135deg, #18181b, #3f3f46)',
    previewClass: 'bg-[#f1f5f9] border-black/30 text-black',
  },
];

export function getClubTheme(themeId?: string): ClubThemeDefinition {
  if (!themeId) return CLUB_THEMES[0];
  const found = CLUB_THEMES.find(t => t.id === themeId);
  return found || CLUB_THEMES[0];
}
