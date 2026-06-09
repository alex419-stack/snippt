import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // shadcn CSS-Variablen (HSL)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Snippt Premium-Palette — CSS-variablen-basiert für Dark/Light-Switching.
        // Syntax rgb(var(--tw-X) / <alpha-value>) aktiviert Tailwind-Opacity-Modifikatoren
        // (z.B. text-ink/65, bg-surface/40). Werte in globals.css definiert als
        // space-separated RGB (kein rgb()-Wrapper im CSS-Wert).
        ink:     "rgb(var(--tw-ink) / <alpha-value>)",
        bone:    "rgb(var(--tw-bone) / <alpha-value>)",
        coal:    "rgb(var(--tw-coal) / <alpha-value>)",
        surface: "rgb(var(--tw-surface) / <alpha-value>)",
        gold: "rgb(var(--tw-gold) / <alpha-value>)",  // Kupfer (light) / Warmgold (dark) — per CSS-Var dual-mode

        // ── Snippt v1 — Dark/Glow-Design (Pivot 2026-06-09, freigegeben SG2) ──
        // Eigenständige Palette für die echte App (lässt /demo-Pitch-Theme unberührt).
        snippt: {
          bg:       "#08080B",  // Obsidian-Hintergrund
          bg2:      "#0C0C12",
          surface:  "#141420",  // Karten/Panels
          surface2: "#1B1B2A",
          ink:      "#F4F2EE",  // Primärtext (warmes Off-White)
          muted:    "#9D9BAB",  // Sekundärtext
          faint:    "#6A6878",  // Tertiär/Hinweise
          glow1:    "#5468FF",  // Signatur-Glow Indigo
          glow2:    "#2BE7FF",  // Signatur-Glow Cyan
          ember:    "#FF8A4C",  // warmer Gegenpol — nur Stempelkarte/Belohnung
          da:       "#37E59B",  // Status: ist da
          weg:      "#FFC24B",  // Status: unterwegs
          still:    "#6A6878",  // Status: keine Antwort
        },
      },
      fontFamily: {
        sans:    ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        serif:   ["var(--font-serif)", "Georgia", "Times New Roman", "serif"],
        // Snippt v1
        display: ['"Clash Display"', "system-ui", "sans-serif"],
        body:    ['"General Sans"', "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
export default config;
