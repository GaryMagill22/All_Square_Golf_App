/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        blue: {
          light: '#38bdf8', // Custom blue light shade
          normal: '#0284c7', // Custom blue default shade
          dark: '#172554', // Custom blue dark shade
        },
        red: {
          light: '#fecaca',
          normal: '#b91c1c',
          dark: '#450a0a',
        },
        pink: {
          light: '#f5d0fe', // Custom pink light shade
          normal: '#ff49db', // Custom pink default shade
          dark: '#ff16d1', // Custom pink dark shade
        },
        salmon: {
          light: '#ffe4e6', // Custom salmon light shade
          normal: '#fda4af', // Custom salmon default shade
          dark: '#fb7185', // Custom salmon dark shade
        },
        orange: {
          light: '#fed7aa', // Custom orange light shade (fixed typo)
          normal: '#fb923c', // Custom orange default shade
          dark: '#7c2d12', // Custom orange dark shade
        },
        // Add more custom colors here
      },
      // Custom breakpoints if needed
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Enables forms plugin
  ],
};
