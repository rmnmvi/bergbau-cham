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
        orange: {
          DEFAULT: '#F97316',  // orange-500
          light: '#FED7AA',    // orange-200
          dark: '#EA580C'      // orange-600
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