import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "icon";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-mono text-label uppercase tracking-widest transition-all duration-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ai focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  
  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-[10px]",
    md: "px-5 py-2.5 text-xs",
    lg: "px-6 py-3.5 text-sm",
  };

  const variantStyles = {
    primary: "bg-accent-ai hover:bg-accent-ai/90 border border-accent-ai/10 text-bg-base font-bold shadow-lg hover:shadow-accent-ai/20",
    secondary: "bg-bg-surface hover:bg-bg-elevated border border-border text-text-primary",
    outline: "border border-border hover:border-accent-ai hover:bg-bg-surface/50 text-text-secondary hover:text-text-primary",
    ghost: "hover:bg-bg-surface/50 text-text-secondary hover:text-text-primary",
    icon: "p-2 hover:bg-bg-surface/50 text-text-secondary hover:text-text-primary",
  };

  const resolvedSize = variant === "icon" ? "" : sizeStyles[size];

  return (
    <button
      className={`${baseStyles} ${resolvedSize} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && iconPosition === "left" && <span className="mr-2 shrink-0">{icon}</span>}
      {variant !== "icon" && children}
      {icon && iconPosition === "right" && <span className="ml-2 shrink-0">{icon}</span>}
      {variant === "icon" && icon}
    </button>
  );
}
