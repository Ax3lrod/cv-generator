/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'Garamond', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        cv: {
          slate: '#334155',
          navy: '#1e3a8a',
          emerald: '#065f46',
          burgundy: '#881337',
        }
      }
    },
  },
  plugins: [],
}
