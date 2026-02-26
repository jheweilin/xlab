"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 28, text: "text-lg" },
    md: { icon: 36, text: "text-xl" },
    lg: { icon: 48, text: "text-2xl" },
    xl: { icon: 64, text: "text-3xl" },
  };

  const { icon, text } = sizes[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* X Icon Mark */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Background hexagon */}
        <defs>
          <linearGradient id="xlab-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#FF431B" />
          </linearGradient>
          <linearGradient id="xlab-gradient-reverse" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF431B" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>

        {/* Outer hexagon frame */}
        <path
          d="M32 4L56 18V46L32 60L8 46V18L32 4Z"
          stroke="url(#xlab-gradient)"
          strokeWidth="2"
          fill="none"
        />

        {/* Inner X shape */}
        <path
          d="M20 20L32 32M32 32L44 44M32 32L44 20M32 32L20 44"
          stroke="url(#xlab-gradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Center dot */}
        <circle cx="32" cy="32" r="3" fill="url(#xlab-gradient)" />

        {/* Corner accents */}
        <circle cx="32" cy="4" r="2" fill="#8B5CF6" />
        <circle cx="56" cy="18" r="2" fill="#EC4899" />
        <circle cx="56" cy="46" r="2" fill="#FF431B" />
        <circle cx="32" cy="60" r="2" fill="#FF431B" />
        <circle cx="8" cy="46" r="2" fill="#EC4899" />
        <circle cx="8" cy="18" r="2" fill="#8B5CF6" />
      </svg>

      {/* Text */}
      {showText && (
        <span className={cn("font-bold tracking-wider", text)}>
          <span className="text-gradient">X</span>
          <span className="text-white">LAB</span>
        </span>
      )}
    </div>
  );
}

// Alternative minimal version
export function LogoMinimal({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="xlab-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#FF431B" />
        </linearGradient>
      </defs>

      {/* Simple X with gradient */}
      <path
        d="M16 16L32 32M32 32L48 48M32 32L48 16M32 32L16 48"
        stroke="url(#xlab-grad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
