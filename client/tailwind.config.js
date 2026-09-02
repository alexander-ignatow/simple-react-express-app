/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Font stacks are system-only; the design makes no network request.
      fontFamily: {
        display: ['Georgia', '"Iowan Old Style"', '"Times New Roman"', 'serif'],
        ui: ['ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', '"SF Mono"', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      // Each step carries its own line-height and tracking so callers cannot
      // pair a size with the wrong leading.
      fontSize: {
        heading: ['44px', { lineHeight: '1.08', letterSpacing: '-0.015em' }],
        'heading-sm': ['32px', { lineHeight: '1.08', letterSpacing: '-0.015em' }],
        quote: ['32px', { lineHeight: '1.34', letterSpacing: '-0.005em' }],
        'quote-sm': ['26px', { lineHeight: '1.34', letterSpacing: '-0.005em' }],
        empty: ['26px', { lineHeight: '1.34' }],
        body: ['15px', { lineHeight: '1.5' }],
        author: ['14px'],
        control: ['14px'],
        error: ['13px', { lineHeight: '1.55' }],
        meta: ['11px', { lineHeight: '1.4', letterSpacing: '0.13em' }],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        // Panels read as pages, controls read as controls.
        panel: '4px',
        control: '8px',
      },
      // The only two shadows in the design.
      boxShadow: {
        panel: '0 18px 44px -28px hsl(225 30% 8% / 0.30)',
        'primary-glow': '0 8px 22px -12px hsl(var(--primary) / 0.55)',
      },
      maxWidth: {
        column: '640px',
      },
      transitionTimingFunction: {
        design: 'cubic-bezier(0.2, 0, 0.2, 1)',
      },
      keyframes: {
        'quote-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        dot: {
          '0%, 100%': { opacity: '0.25' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'quote-in': 'quote-in 240ms cubic-bezier(0.2, 0, 0.2, 1) both',
        dot: 'dot 1s cubic-bezier(0.2, 0, 0.2, 1) infinite',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
    },
  },
  plugins: [],
}
