/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B132B',
          orange: '#2563EB', // Electric Royal Cobalt Blue (Modern BuildNexus Theme)
          'orange-hover': '#1D4ED8',
          blue: '#2563EB',
          'blue-hover': '#1D4ED8',
          cyan: '#06B6D4',
          indigo: '#4F46E5',
          slate: '#475569',
          light: '#F8FAFC',
          border: '#E2E8F0',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          'navy-light': '#1C2541',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(11, 19, 43, 0.06), 0 2px 6px -1px rgba(11, 19, 43, 0.04)',
        glow: '0 0 25px -5px rgba(37, 99, 235, 0.35)',
      },
    },
  },
  plugins: [],
};
