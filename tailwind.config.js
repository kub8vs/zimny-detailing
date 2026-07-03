/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#04050a',
          900: '#070811',
          850: '#0a0c15',
          800: '#0e1019',
          700: '#151827',
          600: '#1e2233',
        },
        ice: {
          100: '#e8fbff',
          200: '#cff4ff',
          300: '#a8e9ff',
          400: '#7fdbff',
          500: '#4fc8f8',
          600: '#2fb3ec',
          700: '#1b93cc',
        },
        marble: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e5e8ec',
          300: '#d3d8de',
        },
      },
      fontFamily: {
        display: ['Syncopate', 'ui-sans-serif', 'sans-serif'],
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.35em',
        widest3: '0.5em',
      },
      boxShadow: {
        'glow-ice': '0 0 24px rgba(79, 200, 248, 0.35), 0 0 64px rgba(79, 200, 248, 0.18)',
        'glow-ice-lg': '0 0 32px rgba(79, 200, 248, 0.5), 0 0 96px rgba(79, 200, 248, 0.28)',
        'card-dark': '0 24px 64px -24px rgba(0, 0, 0, 0.55)',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
