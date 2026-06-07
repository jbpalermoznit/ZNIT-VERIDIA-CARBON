import type { Config } from "tailwindcss";

/**
 * Design tokens da VeridIA / ZNIT.
 * Paleta oficial do brand book (assets/color-codes.pdf):
 *   verde-água: 56B7A5 / 81C8B9 / A9D7CD / E6F3EE
 *   neutros:    030304 / 404040 / 808181 / BDBDBC / FFFFFF
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Verde-água da marca (escala do mais saturado ao mais claro)
        brand: {
          DEFAULT: "#56B7A5",
          600: "#3f9686",
          500: "#56B7A5",
          400: "#81C8B9",
          300: "#A9D7CD",
          100: "#E6F3EE",
        },
        ink: {
          DEFAULT: "#030304", // preto da marca
          900: "#030304",
          700: "#404040",
          500: "#808181",
          300: "#BDBDBC",
        },
        // Estados semânticos (derivados, mantendo a linguagem visual)
        favoravel: "#3f9686",
        atencao: "#C98A2B",
        critico: "#C0492F",
      },
      fontFamily: {
        // Gotham é proprietária — Montserrat é o substituto geométrico mais próximo.
        sans: ["var(--font-montserrat)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(3,3,4,0.04), 0 8px 24px rgba(3,3,4,0.06)",
        float: "0 8px 40px rgba(3,3,4,0.12)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.45s cubic-bezier(0.22,1,0.36,1) both",
        "pulse-soft": "pulse-soft 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
