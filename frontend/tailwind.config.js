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
      },
      animation: {
        'marquee-left': 'marquee-left 20s linear infinite',
        'marquee-right': 'marquee-right 20s linear infinite',
      },
      keyframes: {
        'marquee-left': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-33.333%)' }
        },
        'marquee-right': {
          '0%': { transform: 'translateX(-33.333%)' },
          '100%': { transform: 'translateX(0%)' }
        }
      }
    },
  },
  plugins: [],
}
