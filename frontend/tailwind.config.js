/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#102033",
        mist: "#e8f0ff",
        coral: "#ff7a59",
        gold: "#f7b955",
        mint: "#8fd6c4",
      },
      boxShadow: {
        soft: "0 22px 70px rgba(16, 32, 51, 0.12)",
      },
    },
  },
  plugins: [],
};
