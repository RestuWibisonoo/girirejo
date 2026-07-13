/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          primary: '#047857', // emerald-700
          accent: '#f97316', // orange-500
        }
      }
    },
  },
  plugins: [],
}
