import { cn } from "@/lib/utils";
import React from "react";

interface TileProps {
  value: string | undefined;
  visible?: boolean;
  bgColor?: string;
  textColor?: string;
  className?: string;
}

const Tile = ({
  value,
  visible = true,
  bgColor = "#CFFAFE",
  textColor = "#164E63",
  className,
}: TileProps) => {
  if (visible) {
    return (
      <span
        className={cn("py-2 px-3 text-sm rounded-lg", className)}
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {value}
      </span>
    );
  }
  return null;
};

export default Tile;
