/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        persian: ["AmirRoox", "Tahoma", "Arial", "sans-serif"],
      },
      spacing: {
        rtl: "0 0 0 1rem",
      },
    },
  },
  plugins: [],
};
