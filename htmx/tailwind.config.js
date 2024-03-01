/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,html,json}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'acme': ['Acme', 'sans-serif']
      },
    },
  },
  plugins: [],
}

