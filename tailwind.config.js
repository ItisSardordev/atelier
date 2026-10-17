/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F6F3EE',
        beige: '#E8E1D6',
        sand: '#D8CFC0',
        taupe: '#A89C8A',
        stone: '#8A8278',
        charcoal: '#2A2825',
        ink: '#17150F',
        seasonal: {
          DEFAULT: '#8A6B5A',
          light: '#B89B86',
          dark: '#5C4636',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        wider2: '0.15em',
        widest2: '0.3em',
      },
      fontSize: {
        '10xl': ['10rem', { lineHeight: '0.95' }],
        '11xl': ['14rem', { lineHeight: '0.9' }],
      },
      transitionTimingFunction: {
        luxurious: 'cubic-bezier(0.16, 1, 0.3, 1)',
        smooth: 'cubic-bezier(0.45, 0, 0.15, 1)',
      },
      transitionDuration: {
        '700': '700ms',
        '900': '900ms',
        '1200': '1200ms',
        '1500': '1500ms',
      },
      keyframes: {
        revealUp: {
          '0%': { transform: 'translateY(110%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(1.08)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        revealUp: 'revealUp 1.2s cubic-bezier(0.16,1,0.3,1) forwards',
        fadeIn: 'fadeIn 1.2s cubic-bezier(0.16,1,0.3,1) forwards',
        scaleIn: 'scaleIn 1.8s cubic-bezier(0.16,1,0.3,1) forwards',
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
};
