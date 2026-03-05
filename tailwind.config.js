/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#e4af2e',
          DEFAULT: '#c9922a',
          dark: '#a87020',
        },
        obsidian: '#0a0a0a',
        charcoal: '#141414',
        smoke: '#1e1e1e',
        cream: '#f5f0e8',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
