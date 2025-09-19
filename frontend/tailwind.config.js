/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily : {
        menu : [ "Anton SC", "sans-serif"],
        home : ["Poppins", "sans-serif"]
      },
      fontWeight : {
        menuBold : "900",
        homeBold : "800"
      }
    },
  },
  plugins: [],
}