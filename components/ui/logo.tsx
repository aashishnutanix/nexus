export function Logo({
  size = "default",
}: {
  size?: "default" | "small" | "large";
}) {
  const sizes = {
    small: {
      text: "text-2xl",
      x: "text-3xl",
    },
    default: {
      text: "text-4xl",
      x: "text-5xl",
    },
    large: {
      text: "text-5xl",
      x: "text-6xl",
    },
  };

  const isCompact = size === "small";

  return (
    <h1 className={`font-bold tracking-tighter ${sizes[size].text}`}>
      {!isCompact && "NE"}
      <span className={`text-primary relative ${sizes[size].x}`}>
        X
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/50 rounded-full"></span>
      </span>
      {!isCompact && "US"}
    </h1>
  );
}
