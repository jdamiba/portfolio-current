import React from "react";

export function Badge({
  children,
  className = "",
  variant = "secondary",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "secondary" | "outline";
}) {
  const base =
    "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium transition-colors";
  const variants: Record<string, string> = {
    secondary: "bg-gray-100 dark:bg-gray-800 text-foreground",
    outline: "border border-border text-foreground",
  };
  return (
    <span className={`${base} ${variants[variant] || ""} ${className}`}>
      {children}
    </span>
  );
}
