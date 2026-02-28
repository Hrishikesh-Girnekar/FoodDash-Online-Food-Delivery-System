/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        surface: {
          light: '#fafaf9',
          card:  '#ffffff',
          dark:  '#1c1917',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card:   '0 2px 20px rgba(0,0,0,0.06)',
        hover:  '0 8px 40px rgba(0,0,0,0.12)',
        brand:  '0 4px 24px rgba(249,115,22,0.25)',
        glow:   '0 0 30px rgba(249,115,22,0.15)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial':   'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient':     'linear-gradient(135deg, #fff7ed 0%, #fed7aa 50%, #fef3c7 100%)',
        'card-gradient':     'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
        'shimmer-gradient':  'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      },
    },
  },
  plugins: [],
}
