/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Premium color palette
        primary: {
          green: '#10b981',
          emerald: '#059669',
          orange: '#f59e0b',
          amber: '#d97706',
          blue: '#3b82f6',
          indigo: '#4f46e5',
        },
        background: {
          primary: '#f0fdf4',
          secondary: '#f8fafc',
          white: '#ffffff',
          dark: '#0f172a',
        },
        text: {
          primary: '#0f172a',
          secondary: '#475569',
          muted: '#64748b',
          light: '#94a3b8',
        },
        accent: {
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
        }
      },
      fontFamily: {
        system: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 
                   'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 
                   'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'large': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(16, 185, 129, 0.15)',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 2s infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}