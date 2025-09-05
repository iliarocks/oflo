import { ReactNode } from "react";
import { Text as DefaultText } from "react-native";
import { FONT_SIZE } from "@/constants/font-size";
import { FONT } from "@/constants/font";

type FontFamily = "ubuntu" | "roboto-mono";
type Size = "xs" | "sm" | "md" | "lg" | "xl";
type Weight = "rg" | "md" | "bd";
type Color = "0" | "25" | "50" | "75" | "100";

type TextProps = {
  font?: FontFamily;
  size?: Size;
  weight?: Weight;
  color?: Color;
  children?: ReactNode;
};

export default function Text({
  font = "ubuntu",
  size = "sm",
  weight = "md",
  color = "75",
  children,
}: TextProps) {
  const fontSize = getFontSize(size);
  const fontFamily = getFont(font, weight);
  const fontColor = getFontColor(color);
  const styles = [fontSize, fontColor, fontFamily].join(" ");

  return <DefaultText className={styles}>{children}</DefaultText>;
}

function getFontColor(color: Color) {
  const fontColors = {
    0: "text-text-0",
    25: "text-text-25",
    50: "text-text-50",
    75: "text-text-75",
    100: "text-text-100",
  };

  return fontColors[color];
}

function getFont(font: FontFamily, weight: Weight) {
  const fonts = {
    ubuntu: {
      rg: "font-ubuntu-rg",
      md: "font-ubuntu-md",
      bd: "font-ubuntu-bd",
    },
    "roboto-mono": {
      rg: "font-roboto-mono-rg",
      md: "font-roboto-mono-md",
      bd: "font-roboto-mono-bd",
    },
  };

  return fonts[font][weight];
}

function getFontSize(size: Size) {
  const fontSizes = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-md",
    lg: "text-lg",
    xl: "text-xl",
  };

  return fontSizes[size];
}
