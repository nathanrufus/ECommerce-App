/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#70B244",
          dark: "#1B1D30",
          light: "#FFFFFF",
        },
        fontFamily: {
          sans: 'var(--font-sans), system-ui, sans-serif',
          mono: 'var(--font-mono), Menlo, monospace',
        },
        colors: {
          background: "var(--background)",
          foreground: "var(--foreground)",
        },
      },
    },
    plugins: [
          require('tailwind-scrollbar-hide'),
    ],
  };
  