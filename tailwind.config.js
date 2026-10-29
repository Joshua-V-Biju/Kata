/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        katana: {
          bg: '#0a0d14',
          surface: '#121722',
          surfaceLight: '#182030',
          glass: 'rgba(18, 23, 34, 0.72)',
          border: 'rgba(255, 255, 255, 0.08)',
          glowCyan: '#00f2fe',
          glowCoral: '#ff6b8b',
          glowMint: '#00e5a3',
          glowAmber: '#ffb300',
          glowIndigo: '#6366f1',
          sakura: '#f472b6',
        }
      },
      fontFamily: {
        display: ['"Zen Maru Gothic"', '"M PLUS Rounded 1c"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(0, 242, 254, 0.35)',
        'glow-coral': '0 0 20px -3px rgba(255, 107, 139, 0.35)',
        'glow-mint': '0 0 20px -3px rgba(0, 229, 163, 0.35)',
        'glow-amber': '0 0 20px -3px rgba(255, 179, 0, 0.35)',
        'glow-purple': '0 0 20px -3px rgba(168, 85, 247, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'petal': 'petalFall 10s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        petalFall: {
          '0%': { transform: 'translate(0, -10px) rotate(0deg)', opacity: '0' },
          '20%': { opacity: '0.8' },
          '80%': { opacity: '0.8' },
          '100%': { transform: 'translate(100px, 100vh) rotate(360deg)', opacity: '0' }
        }
      }
    },
  },
  plugins: [],
}
