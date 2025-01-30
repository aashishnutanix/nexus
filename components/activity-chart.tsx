import { cn, generateShades } from "@/lib/utils";
import { isArray } from "lodash";
import { useState, useMemo } from "react";

export interface ActivityChartProps {
  data: { date: string; count: number }[];
  colors?: string[] | string;
  squareSize?: number;
  squareGap?: number;
  monthLabels?: boolean;
  theme?: "light" | "dark";
  className?: string;
}

export const ActivityChart = ({
  data,
  colors = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  squareSize = 12,
  squareGap = 3,
  monthLabels = true,
  theme = "light",
  className,
}: ActivityChartProps) => {
  const [activeDay, setActiveDay] = useState<{
    date: string;
    count: number;
  } | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  if (!isArray(colors)) {
    colors = generateShades(colors);
  }

  // Calculate chart dimensions and positions
  const weeks = 53;
  const daysInWeek = 7;
  const totalSquares = weeks * daysInWeek;

  // Generate all dates for the past year
  const endDate = useMemo(() => new Date(), []);
  const startDate = useMemo(() => {
    const date = new Date(endDate);
    date.setDate(date.getDate() - totalSquares);
    return date;
  }, [endDate, totalSquares]);

  // Create map for quick lookup
  const dataMap = useMemo(
    () => new Map(data.map((d) => [d.date, d.count])),
    [data]
  );

  // Generate array of all dates with counts
  const allDates = useMemo(
    () =>
      Array.from({ length: totalSquares }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateString = date.toISOString().split("T")[0];
        return {
          date: dateString,
          count: dataMap.get(dateString) || 0,
        };
      }),
    [dataMap, startDate, totalSquares]
  );

  // Group dates into weeks
  const weeksArray = useMemo(
    () =>
      Array.from({ length: weeks }, (_, weekIndex) =>
        allDates.slice(weekIndex * daysInWeek, (weekIndex + 1) * daysInWeek)
      ),
    [allDates, daysInWeek, weeks]
  );

  // Calculate viewBox dimensions
  const viewBoxWidth = weeks * (squareSize + squareGap);
  const viewBoxHeight = daysInWeek * (squareSize + squareGap);

  // Get color index based on count
  const getColorIndex = (count: number) => {
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 5) return 2;
    if (count <= 8) return 3;
    return 4;
  };

  return (
    <div className={cn("flex flex-col gap-4 w-full", className)}>
      <div
        className="relative w-full"
        style={{ paddingBottom: `${(viewBoxHeight / viewBoxWidth) * 100}%` }}
      >
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="absolute top-0 left-0 w-full h-full"
          onMouseLeave={() => setActiveDay(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMousePosition({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          }}
        >
          {monthLabels && (
            <text x="0" y="10" className="text-xs fill-muted-foreground">
              {startDate.toLocaleString("default", { month: "short" })}
            </text>
          )}

          {weeksArray.map((week, weekIndex) =>
            week.map((day, dayIndex) => {
              const colorIndex = getColorIndex(day.count);
              return (
                <rect
                  key={`${weekIndex}-${dayIndex}`}
                  x={weekIndex * (squareSize + squareGap)}
                  y={dayIndex * (squareSize + squareGap)}
                  width={squareSize}
                  height={squareSize}
                  fill={colors[colorIndex]}
                  rx={2}
                  onMouseEnter={() => setActiveDay(day)}
                  className="cursor-pointer transition-colors hover:opacity-80"
                />
              );
            })
          )}
        </svg>
      </div>

      <div
        className={cn(
          "absolute p-2 text-sm bg-popover text-popover-foreground rounded shadow-lg border transition-opacity",
          activeDay ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{
          transform: `translate(calc(${mousePosition.x}px - 50%), calc(${mousePosition.y}px - 100% - 8px))`,
        }}
      >
        {activeDay && (
          <>
            <strong>{activeDay.count} contributions</strong>
            <p className="text-muted-foreground">
              {new Date(activeDay.date).toLocaleDateString()}
            </p>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 justify-end">
        <span className="text-sm text-muted-foreground">Less</span>
        {colors.map((color) => (
          <div
            key={color}
            className="rounded-sm"
            style={{
              width: squareSize,
              height: squareSize,
              backgroundColor: color,
            }}
          />
        ))}
        <span className="text-sm text-muted-foreground">More</span>
      </div>
    </div>
  );
};
