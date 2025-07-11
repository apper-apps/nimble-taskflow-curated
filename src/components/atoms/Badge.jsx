import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md",
  children,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-primary/30",
    secondary: "bg-gradient-to-r from-secondary/20 to-secondary/10 text-secondary border-secondary/30",
    success: "bg-gradient-to-r from-success/20 to-success/10 text-success border-success/30",
    warning: "bg-gradient-to-r from-warning/20 to-warning/10 text-warning border-warning/30",
    error: "bg-gradient-to-r from-error/20 to-error/10 text-error border-error/30",
    gray: "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border-gray-300",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;