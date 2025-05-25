
import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo = ({ size = "md", className = "" }: LogoProps) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl",
  };

  return (
    <div className={`flex items-center ${className}`}>
      <span className={`font-bold ${sizeClasses[size]} text-white`}>
        Metall<span className="text-metall-purple">App</span>
      </span>
    </div>
  );
};

export default Logo;
