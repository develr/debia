/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./renderer/pages/**/*.{js,ts,jsx,tsx}",
    "./renderer/components/**/*.{js,ts,jsx,tsx}",
    "./renderer/containers/**/*.{js,ts,jsx,tsx}",
    "./renderer/templates/**/*.{js,ts,jsx,tsx}",
    "./renderer/app/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [require("daisyui")],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
  },
};
