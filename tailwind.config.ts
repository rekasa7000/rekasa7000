// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode
        light: {
          background: "#ffffff",
          text: "#1a202c",
          primary: "#4a90e2",
          secondary: "#f0f4f8",
          accent: "#3182ce",
        },
        // Dark mode
        dark: {
          background: "#1a202c",
          text: "#f7fafc",
          primary: "#63b3ed",
          secondary: "#2d3748",
          accent: "#4299e1",
        },
        // Matcha mode
        matcha: {
          background: "#44624A",
          text: "#1e3a29",
          primary: "#44624A",
          secondary: "#e8f3e1",
          accent: "#87af77",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
// ceremonial: "#44624A",
// classic: "#8BA888",
// culinary: "#C0CFB2",
// kitchen: "#F1EBE1",
