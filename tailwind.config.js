/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'cc-',
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        'google-blue': '#4285f4',
        'button-active-blue': '#1669F2',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
