/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mango: {
          50: '#fffcf2',
          100: '#fff6e0',
          200: '#ffebb0',
          300: '#ffdb7a',
          400: '#ffc83b',
          500: '#ffaf00', // vibrant mango center
          600: '#e58e00',
          700: '#bf6c00',
          800: '#995200',
          900: '#7e4202',
          950: '#482100',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
