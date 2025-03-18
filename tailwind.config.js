/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'orange': '#fb9b04',
      'blue': '#045383',
      'white': '#fff',
    },
    extend: {
      fontFamily: {
        "montserrat": ["Montserrat", "sans-serif"],
        "hind": ["Hind", "sans-serif"],
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}