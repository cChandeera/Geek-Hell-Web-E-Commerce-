import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'marvel' | 'dc' | 'success' | 'danger' | 'warning';
  outline?: boolean;
  glow?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'primary',
  outline = false,
  glow = false,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none border tracking-wide uppercase font-display';

  const solidVariants = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    marvel: 'bg-accent-marvel text-white border-transparent shadow-marvel-glow',
    dc: 'bg-accent-dc text-white border-transparent shadow-dc-glow',
    success: 'bg-success/10 text-success border-success/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
  };

  const outlineVariants = {
    primary: 'bg-transparent text-primary border-primary',
    secondary: 'bg-transparent text-secondary border-secondary',
    marvel: 'bg-transparent text-accent-marvel border-accent-marvel',
    dc: 'bg-transparent text-accent-dc border-accent-dc',
    success: 'bg-transparent text-success border-success',
    danger: 'bg-transparent text-danger border-danger',
    warning: 'bg-transparent text-warning border-warning',
  };

  const glowStyles = {
    primary: 'shadow-marvel-glow',
    secondary: 'shadow-dc-glow',
    marvel: 'shadow-marvel-glow',
    dc: 'shadow-dc-glow',
    success: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    danger: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]',
    warning: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]',
  };

  return (
    <span
      className={cn(
        baseStyles,
        outline ? outlineVariants[variant] : solidVariants[variant],
        glow && glowStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
