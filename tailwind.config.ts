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
        // Snippt Premium-Palette (Dark Barbershop)
        // Rohe Hex-Tokens — verwendbar als bg-snippt-bg, text-snippt-text usw.
        snippt: {
          bg: "#F8F7F4",      // Off-White Hintergrund
          primary: "#0F0F0F", // Tiefschwarz
          accent: "#C9A84C",  // Warmgold
          text: "#1C1C1E",    // Dunkelgrau
        },
        // Kurz-Aliase für die Premium-Palette (Geist-Style, knapp)
        ink: "#0F0F0F",   // Tiefschwarz (=primary)
        gold: "#C9A84C",  // Warmgold (=accent)
        bone: "#F8F7F4",  // Off-White (=bg)
        coal: "#1C1C1E",  // Dunkelgrau (=text)
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
