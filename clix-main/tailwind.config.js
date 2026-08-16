/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-soft': 'var(--primary-soft)',
        'accent-gold': 'var(--uni-gold)',
        'accent-navy': 'var(--uni-navy)',
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        uni: '1.25rem',
        'uni-lg': '1.75rem',
        'uni-xl': '2.5rem',
      },
      boxShadow: {
        glass: 'var(--glass-shadow)',
        'glass-lg': 'var(--glass-premium-shadow)',
      },
    },
  },
  plugins: [],
}
