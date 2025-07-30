import React from "react";

const CircularProgress = ({ value, size = 32, stroke = 4, color = "#4f46e5", bg = "#e5e7eb", children }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} style={{ display: "inline-block" }}>
      <circle
        stroke={bg}
        fill="none"
        strokeWidth={stroke}
        cx={size / 2}
        cy={size / 2}
        r={radius}
      />
      <circle
        stroke={color}
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        style={{ transition: "stroke-dashoffset 0.3s" }}
      />
      {children}
    </svg>
  );
};

export default CircularProgress;
