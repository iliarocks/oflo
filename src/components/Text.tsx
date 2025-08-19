import { ReactNode } from "react";
import { Text as DefaultText } from "react-native";

type Type = "title" | "body";
type Style = "primary" | "secondary";
type Size = "sm" | "md" | "lg" | "xl";
type Decoration = "no-underline" | "underline";

interface TextProps {
  type?: Type;
  style?: Style;
  size?: Size;
  decoration?: Decoration;
  children?: ReactNode;
}

export default function Text({
  type = "body",
  style = "primary",
  size = "sm",
  decoration = "no-underline",
  children,
}: TextProps) {
  const fontSize = getFontSize(type, size);
  const color = getColor(style);
  const font = getFont(type);
  const lineHeight = getLineHeight(type, size);
  const styles = [fontSize, color, font, lineHeight, decoration];

  return <DefaultText className={styles.join(" ")}>{children}</DefaultText>;
}

function getFontSize(type: Type, size: Size) {
  const fontSizes = {
    title: {
      sm: "text-title-sm",
      md: "text-title-md",
      lg: "text-title-lg",
      xl: "text-title-xl",
    },
    body: {
      sm: "text-body-sm",
      md: "text-body-md",
      lg: "text-body-lg",
      xl: "text-body-lg",
    },
  };

  return fontSizes[type][size];
}

function getColor(style: Style) {
  const colors = {
    primary: "text-text-0",
    secondary: "text-text-5",
  };

  return colors[style];
}

function getFont(type: Type) {
  const fonts = {
    title: "font-roboto-mono-bd",
    body: "font-roboto-mono-md",
  };

  return fonts[type];
}

function getLineHeight(type: Type, size: Size) {
  if (type === "body") return "leading-base";

  const lineHeight = {
    sm: "leading-base",
    md: "leading-base",
    lg: "leading-title-lg",
    xl: "leading-title-xl",
  };

  return lineHeight[size];
}
