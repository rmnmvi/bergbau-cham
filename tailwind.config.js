/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.hbs",
    "./dist/**/*.html",
    "./src/**/*.{html,js}",
    "./*.html"
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F4E4BC'
        },
        'gray-dark': '#1F2937'
      },
      fontFamily: {
        'sans': ['Open Sans', 'system-ui', 'sans-serif'],
        'sans-body': ['Open Sans', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}