/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        mediva: {
          page: '#eaf5ff',
          sidebar: '#dceeff',
          surface: '#ffffff',
          chip: '#eaf5ff',
          primary: '#1565c0',
          'primary-hover': '#0d47a1',
          accent: '#42a5f5',
          border: '#72bbee',
          'border-soft': '#d6e8fa',
          text: '#0d2f5e',
          muted: '#4a6f9c',
          'sidebar-text': '#0b3c6f',
          success: '#4caf50',
          'success-bg': '#c8f7cd',
          'success-text': '#1b5e20',
          warning: '#ff9800',
          'warning-bg': '#fef3c7',
          'warning-text': '#92400e',
          danger: '#f44336',
          'danger-bg': '#fee2e2',
          'danger-text': '#991b1b',
          info: '#2196f3',
          'info-bg': '#dbeafe',
          'info-text': '#1e40af',
          'expired-bg': '#ffedd5',
          'expired-text': '#9a3412',
        },
      },
      borderRadius: {
        'mediva-xs': '6px',
        'mediva-sm': '8px',
        'mediva-md': '12px',
        'mediva-lg': '16px',
        'mediva-xl': '20px',
        'mediva-2xl': '28px',
      },
      boxShadow: {
        'mediva-stat': '0 4px 14px rgba(15, 51, 102, 0.06)',
        'mediva-panel': '0 6px 20px rgba(15, 51, 102, 0.06)',
        'mediva-popover': '0 12px 28px rgba(15, 51, 102, 0.12)',
        'mediva-modal': '0 20px 48px rgba(13, 47, 94, 0.18)',
        'mediva-login': '0 24px 60px rgba(21, 101, 192, 0.22)',
        'mediva-cta': '0 10px 24px rgba(21, 101, 192, 0.32)',
      },
      keyframes: {
        'card-shimmer': {
          '0%, 15%': {
            transform: 'translateX(-150%) skewX(-20deg)',
            opacity: '0',
          },
          '16%': {
            opacity: '0.8',
          },
          '35%': {
            transform: 'translateX(350%) skewX(-20deg)',
            opacity: '0.8',
          },
          '36%, 100%': {
            transform: 'translateX(350%) skewX(-20deg)',
            opacity: '0',
          },
        },
      },
      animation: {
        'card-shimmer': 'card-shimmer 5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
}

