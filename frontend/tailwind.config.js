/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#002f5a',
          hover:   '#003f7a',
          light:   '#e8f0f8',
          border:  'rgba(0,47,90,0.2)',
        },
        accent:  '#c25d41',
        surface: '#f6faff',
        success: {
          DEFAULT: '#16a34a',
          bg:      '#f0fdf4',
        },
        danger: {
          DEFAULT: '#dc2626',
          bg:      '#fef2f2',
        },
        warning: {
          DEFAULT: '#d97706',
          bg:      '#fffbeb',
        },
        text: {
          main:      '#0f172a',
          secondary: '#475569',
          muted:     '#94a3b8',
        },
        card: {
          border: 'rgba(194,198,209,0.4)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 16px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
