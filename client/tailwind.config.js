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
        indigo: {
          light: '#c7d2fe',
          normal: '#6366f1',
          dark: '#1e1b4b',
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
        green: {
          light: '#bbf7d0',
          normal: '#16a34a',
          dark: '#052e16',
        },
        salmon: {
          light: '#ffe4e6', // Custom salmon light shade
          normal: '#fda4af', // Custom salmon default shade
          dark: '#fb7185', // Custom salmon dark shade
          darkest: '#881337',
        },
        orange: {
          light: '#fdba74', // Custom orange light shade (fixed typo)
          normal: '#fb923c', // Custom orange default shade
          dark: '#7c2d12', // Custom orange dark shade
        },
        maroon: {
          light:'',
          normal: '#500724',
          dark: '',
        },
        gray: {
          lightest: '#d1d5db',
          light:'#9ca3af',
          normal:'#1f2937',
          dark: '#0f172a',
          darkest: '#020617',
        },
        cyan: {
          light: '#67e8f9',
          normal: '#0891b2',
          dark: '#083344',
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
