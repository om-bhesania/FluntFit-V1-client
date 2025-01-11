import React from "react";

// Define color variants
type ColorVariant =
  | "gray"
  | "red"
  | "yellow"
  | "green"
  | "blue"
  | "indigo"
  | "purple"
  | "pink"
  | "orange"
  | "teal";

// Define size variants
type SizeVariant = "xs" | "sm" | "md" | "lg" | "xl";

// Define font size variants
type FontSizeVariant =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl";

interface BadgeProps {
  content: React.ReactNode;
  color?: ColorVariant;
  size?: SizeVariant;
  fontSize?: FontSizeVariant;
  customHeight?: string;
  customWidth?: string;
  customClass?: string;
  customColor?: string;
  customFontSize?: string;
}

const Badge: React.FC<BadgeProps> = ({
  content,
  color = "blue",
  size = "xs",
  fontSize = "xs",
  customHeight,
  customWidth,
  customClass = "",
  customColor,
  customFontSize,
}) => {
  const colorClasses: Record<ColorVariant, string> = {
    gray: "bg-gray-100 text-gray-800 border-gray-200",
    red: "bg-red-100 text-red-800 border-red-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    green: "bg-green-100 text-green-800 border-green-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    indigo: "bg-indigo-100 text-indigo-800 border-indigo-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
    pink: "bg-pink-100 text-pink-800 border-pink-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
    teal: "bg-teal-100 text-teal-800 border-teal-200",
  };

  const sizeClasses: Record<SizeVariant, string> = {
    xs: "px-3 py-0.5",
    sm: "px-3 py-0.5",
    md: "px-3 py-0.5",
    lg: "px-3 py-0.5",
    xl: "px-3 py-0.5",
  };

  const fontSizeClasses: Record<FontSizeVariant, string> = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
  };

  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-full border";
  const colorClass = customColor ? "" : colorClasses[color];
  const sizeClass = customHeight || customWidth ? "" : sizeClasses[size];
  const fontSizeClass = customFontSize ? "" : fontSizeClasses[fontSize];

  const style: React.CSSProperties = {
    ...(customHeight && { height: customHeight }),
    ...(customWidth && { width: customWidth }),
    ...(customColor && {
      backgroundColor: `${customColor}20`, // 20% opacity
      color: customColor,
      borderColor: `${customColor}40`, // 40% opacity
    }),
    ...(customFontSize && { fontSize: customFontSize }),
  };

  return (
    <span
      className={`${baseClasses} ${colorClass} ${sizeClass} ${fontSizeClass} ${customClass}`}
      style={style}
    >
      {content}
    </span>
  );
};

export default Badge;
