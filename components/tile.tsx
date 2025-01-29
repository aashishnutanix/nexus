import { cn } from "@/lib/utils";
import React from "react";

interface TileProps {
  value: string | undefined;
  visible?: boolean;
  bgColor?: string;
  textColor?: string;
}

const Tile = ({ value, visible = true, bgColor, textColor }: TileProps) => {
  const bgColorValue = bgColor || "#CFFAFE";
  const textColorValue = textColor || "#164E63";
  if (visible) {
    return (
      <span
        className={cn(
          "py-2 px-3 text-sm rounded-lg",
          `bg-[${bgColorValue}] text-[${textColorValue}]`
        )}
      >
        {value}
      </span>
    );
  }
  return null;
};

export default Tile;
