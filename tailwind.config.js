/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eefbf3',
          100: '#d5f5e3',
          200: '#aeeac9',
          300: '#79d8a8',
          400: '#43be82',
          500: '#1fa463',
          600: '#13834e',
          700: '#116940',
          800: '#115436',
          900: '#0f452e',
          950: '#07271b',
        },
        bio: {
          emerald: '#10b981',
          cyan: '#06b6d4',
          teal: '#14b8a6',
          lime: '#84cc16',
          violet: '#8b5cf6',
          agar: '#fef08a',
        },
        danger: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
        warn: {
          400: '#fb923c',
          500: '#f97316',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bio-drift': 'bioDrift 14s ease-in-out infinite alternate',
        'bio-pulse': 'bioPulse 4s ease-in-out infinite',
        'dna-drift': 'dnaDrift 20s linear infinite',
        'reticle-spin': 'reticleSpin 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        bioDrift: {
          '0%': { transform: 'translate(0px, 0px) rotate(0deg) scale(1)' },
          '50%': { transform: 'translate(20px, -25px) rotate(15deg) scale(1.05)' },
          '100%': { transform: 'translate(-15px, 15px) rotate(-10deg) scale(0.95)' },
        },
        bioPulse: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.12)' },
        },
        dnaDrift: {
          '0%': { transform: 'translateY(0) rotate(0deg)' },
          '100%': { transform: 'translateY(-200px) rotate(360deg)' },
        },
        reticleSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};