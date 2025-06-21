"use client";

import { cn } from "@/lib/utils";

const ShineBorder = ({
  children,
  className,
  duration = 2,
  shineColor = "#ffffff",
  borderWidth = 2,
  style,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full p-[2px]",
        className,
      )}
      style={{
        "--border-width": `${borderWidth}px`,
        "--shine-color": shineColor,
        "--duration": `${duration}s`,
        ...style,
      }}
      {...props}
    >
      <div
        className="absolute inset-0 rounded-full shine-border-spin"
        style={{
          background: `conic-gradient(from 0deg, transparent 220deg, var(--shine-color) 280deg, transparent 320deg)`,
          animationDuration: `var(--duration)`,
        }}
      />
      <div className="relative z-10 rounded-full bg-gray-900">
        {children}
      </div>
      {/* Local keyframes for shine border spin */}
      <style>{`
        @keyframes shine-border-spin {
          to { transform: rotate(360deg); }
        }
        .shine-border-spin {
          animation: shine-border-spin var(--duration, 2s) linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ShineBorder; 