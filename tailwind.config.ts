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
      },
      fontFamily: {
        sans:  ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "Times New Roman", "serif"],
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
