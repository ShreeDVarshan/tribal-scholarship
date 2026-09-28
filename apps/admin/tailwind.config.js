/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A5C38', // forest green
          light: '#EBF5EE',
          dark: '#113F26',
        },
        secondary: {
          DEFAULT: '#2A7C6F', // muted teal
          light: '#E8F4F2',
        },
        accent: {
          DEFAULT: '#D4860A', // warm saffron
          light: '#FEF3E2',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          neutral: '#F9F7F4', // warm off-white
          border: '#E8E3DC',
        },
        charcoal: '#1A1A1A',
      },
    },
  },
  plugins: [],
}
