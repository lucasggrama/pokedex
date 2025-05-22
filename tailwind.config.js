module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Cores do tema Dracula
        "dracula-background": "#282a36",
        "dracula-current-line": "#44475a",
        "dracula-selection": "#44475a",
        "dracula-foreground": "#f8f8f2",
        "dracula-comment": "#6272a4",
        "dracula-cyan": "#8be9fd",
        "dracula-green": "#50fa7b",
        "dracula-orange": "#ffb86c",
        "dracula-pink": "#ff79c6",
        "dracula-purple": "#bd93f9",
        "dracula-red": "#ff5555",
        "dracula-yellow": "#f1fa8c",

        // Adaptação das cores dos tipos para o tema Dracula
        "normal-type": "#6272a4",
        "fire-type": "#ff5555",
        "water-type": "#8be9fd",
        "electric-type": "#f1fa8c",
        "grass-type": "#50fa7b",
        "ice-type": "#8be9fd",
        "fighting-type": "#ff5555",
        "poison-type": "#bd93f9",
        "ground-type": "#ffb86c",
        "flying-type": "#bd93f9",
        "psychic-type": "#ff79c6",
        "bug-type": "#50fa7b",
        "rock-type": "#ffb86c",
        "ghost-type": "#bd93f9",
        "dragon-type": "#bd93f9",
        "dark-type": "#6272a4",
        "steel-type": "#6272a4",
        "fairy-type": "#ff79c6",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
  darkMode: "class", // Habilita o modo escuro baseado em classe
};
