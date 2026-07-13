/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: '#F6F4E8',
        sage: '#E5EEE4',
        mint: '#C0E1D2',
        coral: '#DC9B9B',
        ink: '#2A3439',
        // Dark theme surfaces
        night: '#222B31',
        abyss: '#181F24',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        flat: '4px 4px 0px 0px #2A3439',
        'flat-sm': '2px 2px 0px 0px #2A3439',
        'flat-soft': '4px 4px 0px 0px rgba(42, 52, 57, 0.15)',
        'flat-dark': '4px 4px 0px 0px #0E1316',
        'flat-sm-dark': '2px 2px 0px 0px #0E1316',
        'flat-soft-dark': '4px 4px 0px 0px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}
