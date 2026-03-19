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
      {/* Infinity-X Icon Mark */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="xlab-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#FF431B" />
          </linearGradient>
        </defs>

        {/* Left loop */}
        <path
          d="M 26,26 C 20,18 4,16 4,32 C 4,48 20,46 26,38"
          stroke="url(#xlab-gradient)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Right loop */}
        <path
          d="M 38,26 C 44,18 60,16 60,32 C 60,48 44,46 38,38"
          stroke="url(#xlab-gradient)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />

        {/* X crossing */}
        <path
          d="M 26,26 L 38,38 M 38,26 L 26,38"
          stroke="url(#xlab-gradient)"
          strokeWidth="5"
          strokeLinecap="round"
        />
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

      {/* Left loop */}
      <path
        d="M 26,26 C 20,18 4,16 4,32 C 4,48 20,46 26,38"
        stroke="url(#xlab-grad)"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Right loop */}
      <path
        d="M 38,26 C 44,18 60,16 60,32 C 60,48 44,46 38,38"
        stroke="url(#xlab-grad)"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />

      {/* X crossing */}
      <path
        d="M 26,26 L 38,38 M 38,26 L 26,38"
        stroke="url(#xlab-grad)"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
