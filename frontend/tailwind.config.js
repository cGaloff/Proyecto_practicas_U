/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:  '#002f5a',
        accent:   '#c25d41',
        surface:  '#f6faff',
        muted:    '#64748b',
        danger:   '#dc2626',
        success:  '#16a34a',
        warning:  '#d97706',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

