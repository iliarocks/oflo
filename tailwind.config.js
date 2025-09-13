/** @type {import('tailwindcss').Config} */
import LINE_HEIGHT from "./src/constants/line-height";
import COLOR from "./src/constants/color";
import FONT_SIZE from "./src/constants/font-size";
import SPACING from "./src/constants/spacing";

module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: COLOR,
			fontSize: FONT_SIZE,
			lineHeight: LINE_HEIGHT,
			spacing: SPACING,
		},
	},
	plugins: [],
};
