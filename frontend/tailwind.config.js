/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['var(--font-syne)', 'sans-serif'],
        display: ['var(--font-fraunces)', 'serif'],
        mono:    ['var(--font-dm-mono)', 'monospace']
      },
      colors: {
        cream:  { DEFAULT: '#FAF7F2', dark: '#F0EBE1' },
        forest: { light: '#6B8C6B', DEFAULT: '#3D6B3D', dark: '#2A4A2A' },
        gold:   { light: '#D4A853', DEFAULT: '#B8921F', dark: '#8C6E10' },
        ink:    { light: '#4A4A4A', DEFAULT: '#1A1A1A', dark: '#0D0D0D' }
      },
      animation: {
        'fade-up':   'fadeUp 0.6s ease forwards',
        'fade-in':   'fadeIn 0.4s ease forwards',
        'shimmer':   'shimmer 1.5s infinite'
      },
      keyframes: {
        fadeUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } }
      }
    }
  },
  plugins: []
};
