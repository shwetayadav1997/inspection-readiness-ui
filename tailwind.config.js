/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#D72027',
          dark: '#b8102e',
          light: '#f03039',
        },
        amber: {
          DEFAULT: '#C77F3E',
          light: '#FFF4E6',
        },
        status: {
          critical: '#DC2626',
          risk: '#F59E0B',
          review: '#FB923C',
          ready: '#10B981',
        },
      },
      borderRadius: {
        DEFAULT: '0.625rem',
      },
    },
  },
  plugins: [],
}

