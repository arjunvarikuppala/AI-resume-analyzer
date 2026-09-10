/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        navy: {
          900: "#0b1120",
          950: "#060a14",
        },
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
        coral: "#ff6b4a",
        mint: "#10b981",
      },
      boxShadow: {
        soft: "0 20px 45px -10px rgba(15, 23, 42, 0.08)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        glow: "0 0 30px -5px rgba(99, 102, 241, 0.25)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 10px 25px -5px rgba(0, 0, 0, 0.05)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s infinite linear",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};
