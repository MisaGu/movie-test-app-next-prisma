import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    colors: {
      transparent: "transparent",
      white: "#FFFFFF",
      black: "#000000",
      bg: "#093545",
      input_error: "#EB5757",
      input_bg: "#224957",
      primary: "#2BD17E",
      card_bg: "#C3C8D4",
    },
    borderWidth: {
      "1": "1px",
      chevron: "0 2px 2px 0",
    },
    borderRadius: {
      "4": "4px",
      "5": "5px",
      "10": "10px",
      "12": "12px",
    },
    flexBasis: {
      "1": "6.5%",
      "2": "15%",
      "3": "23.5%",
      "4": "32%",
      "5": "40.5%",
      "6": "49%",
      "7": "57.5%",
      "8": "66%",
      "9": "74.5%",
      "10": "83%",
      "11": "91.5%",
      "12": "100%",
    },
    spacing: {
      "0": "0px",
      "2": "2px",
      "4": "4px",
      "8": "8px",
      "12": "12px",
      "16": "16px",
      "24": "24px",
      "32": "32px",
      "40": "40px",
      "48": "48px",
      "56": "56px",
      "64": "64px",
      "80": "80px",
      "120": "120px",
      "160": "160px",
      auto: "auto",
    },
  },
  plugins: [],
  important: true,
};
export default config;
