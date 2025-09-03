/** @type {import('tailwindcss').Config} */
import { COLOR } from "./src/constants/color";
import { FONT } from "./src/constants/font";
import { FONT_SIZE } from "./src/constants/font-size";
import { LINE_HEIGHT } from "./src/constants/line-height";
import { SPACING } from "./src/constants/spacing";

export default {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: COLOR,
      fontFamily: FONT,
      fontSize: FONT_SIZE,
      lineHeight: LINE_HEIGHT,
      spacing: SPACING,
    },
  },
  plugins: [],
};
