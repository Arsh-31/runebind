// src/components/GlowingDot.tsx
import React from "react";

interface GlowingDotProps {
  size?: "sm" | "md" | "lg" | "xl"; // Define different sizes
  color?: string; // Tailwind color class or hex, e.g., 'blue-400' or '#6C63FF'
  className?: string; // Optional additional classes for positioning or customization
}

const GlowingDot: React.FC<GlowingDotProps> = ({
  size = "md",
  color,
  className,
}) => {
  const sizeClasses = {
    sm: "w-1 h-1",
    md: "w-1.5 h-1.5",
    lg: "w-2 h-2",
    xl: "w-2.5 h-2.5",
  };

  const defaultColor = "var(--brand-primary-accent)"; // Use your accent color by default

  return (
    <div
      className={`${sizeClasses[size]} rounded-full ${className}`}
      style={{
        background: color
          ? `radial-gradient(circle, ${color} 0%, transparent 70%)`
          : `radial-gradient(circle, ${defaultColor} 0%, transparent 70%)`,
        opacity: 0.8, // Adjust for desired glow intensity
        filter:
          "brightness(1.2) drop-shadow(0 0 4px " +
          (color || defaultColor) +
          ")", // Add a slight shadow for depth
      }}
      aria-hidden="true" // Decorative, hide from screen readers
    />
  );
};

export default GlowingDot;
