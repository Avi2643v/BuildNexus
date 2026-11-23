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
        apple: {
          bg: '#f5f5f7',
          surface: '#ffffff',
          dark: '#1d1d1f',
          muted: '#86868b',
          lightMuted: '#6e6e73',
          border: '#d2d2d7',
          lightBorder: '#e8e8ed',
          card: '#f5f5f7',
          blue: '#0071e3',
          blueHover: '#0077ed',
          orange: '#b64400',
          orangeLight: '#ffefe6',
          green: '#1b8738',
          greenLight: '#eaf6ed',
        },
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '24px',
        '4xl': '32px',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Plus Jakarta Sans"',
          'Inter',
          'sans-serif',
        ],
      },
      boxShadow: {
        apple: '0 4px 20px -2px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        appleCard: '0 8px 30px rgba(0, 0, 0, 0.04)',
        appleHover: '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
