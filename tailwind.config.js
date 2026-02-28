/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cinematic: {
          dark: "#0a0d14",
          card: "#111827",
        },
      },
    },
  },
  plugins: [],
};