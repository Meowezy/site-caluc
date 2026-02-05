import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        card: '0 10px 30px rgba(15, 23, 42, 0.08)'
      },
      colors: {
        bank: {
          50: '#eff6ff',
          600: '#2563eb',
          700: '#1d4ed8'
        }
      }
    }
  },
  plugins: []
} satisfies Config;
