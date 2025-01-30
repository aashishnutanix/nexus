import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipProps {
  children: React.ReactNode;
  value: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

export function TooltipWrapper({
  children,
  value,
  side = "top",
}: TooltipProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}>{value}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
