/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'safety-green': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        'primary': {
          DEFAULT: '#34C759',
          50: '#e8f8ed',
          100: '#d1f1db',
          200: '#a3e3b7',
          300: '#75d593',
          400: '#47c76f',
          500: '#34C759',
          600: '#2a9f47',
          700: '#1f7735',
          800: '#154f23',
          900: '#0a2711',
        },
      },
    },
  },
  plugins: [],
}

