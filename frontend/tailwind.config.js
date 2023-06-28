/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        ph_xs: '361px',
        ph_sm: '401px',
        ph: '501px',
        lg2: '1051px',
      },
      colors: {
        twitter: {
          light: '#DEEFFA',
          DEFAULT: '#1D9BF0',
          dark: '#098ae0',
        },
        like: {
          light: '#FCD7E8',
          DEFAULT: '#F91880',
        },
      },
    },
  },
  plugins: [],
};
