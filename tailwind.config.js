/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#2e1065',
          DEFAULT: '#6366f1',
          primary: '#5B4BF5',
          hover: '#4A3CE0',
          soft: '#EEF0FD',
        },
        safe: {
          bg: '#ECFDF5',
          border: '#A7F3D0',
          text: '#065F46',
          DEFAULT: '#10B981',
        },
        caution: {
          bg: '#FFFBEB',
          border: '#FDE68A',
          text: '#92400E',
          DEFAULT: '#F59E0B',
        },
        danger: {
          bg: '#FEF2F2',
          border: '#FECACA',
          text: '#991B1B',
          DEFAULT: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
