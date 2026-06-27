/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050810',
          900: '#0A0F1E',
          800: '#0F1629',
          700: '#141D36',
          600: '#1C2847',
        },
        lavender: {
          100: '#EDE9FF',
          200: '#D5CCFF',
          300: '#B8ACFF',
          400: '#9A88FF',
          500: '#7C6FCD',
          600: '#6356B0',
        },
        sage: {
          100: '#E8F3EA',
          200: '#C9E4CD',
          300: '#A8D1AE',
          400: '#8EBD9B',
          500: '#6FA57E',
          600: '#528D62',
        },
        rose: {
          mood: '#E87070',
        },
        amber: {
          wellness: '#F5C842',
        },
        pearl: '#F8F9FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'xl': '20px',
        '2xl': '28px',
      },
      animation: {
        'rotate-slow': 'rotate 20s linear infinite',
        'marquee': 'marquee 40s linear infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}
