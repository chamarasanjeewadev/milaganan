/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'open-sans': ['"Open Sans"', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'source-code-pro': ['"Source Code Pro"', 'monospace'],
        'fira-code': ['"Fira Code"', 'monospace'],
        'arial': ['Arial', 'sans-serif'],
        'times': ['"Times New Roman"', 'serif'],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
