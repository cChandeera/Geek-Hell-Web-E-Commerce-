import React, { forwardRef, useState, useEffect } from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'marvel' | 'dc' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      type = 'button',
      onMouseDown,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading) return;

      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const newRipple = { id: Date.now(), x, y, size };

      setRipples((prev) => [...prev, newRipple]);

      if (onMouseDown) {
        onMouseDown(e);
      }
    };

    useEffect(() => {
      if (ripples.length > 0) {
        const timeout = setTimeout(() => {
          setRipples((prev) => prev.slice(1));
        }, 600);
        return () => clearTimeout(timeout);
      }
      return undefined;
    }, [ripples]);

    const baseStyles = 'inline-flex items-center justify-center font-display font-semibold transition-all duration-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none select-none relative overflow-hidden hover:scale-[1.03] active:scale-95';
    
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary shadow-marvel-glow',
      secondary: 'bg-secondary text-background hover:bg-secondary-hover focus:ring-secondary shadow-dc-glow',
      marvel: 'bg-accent-marvel text-white hover:bg-primary-hover focus:ring-accent-marvel shadow-marvel-glow',
      dc: 'bg-accent-dc text-white hover:bg-accent-dc/90 focus:ring-accent-dc shadow-dc-glow',
      outline: 'border border-surface-border text-text-primary hover:bg-surface-hover/30 hover:text-white focus:ring-surface-border',
      ghost: 'text-text-secondary hover:bg-surface-hover/30 hover:text-white focus:ring-surface-border',
      glass: 'glass-panel text-white hover:bg-surface-hover/50 hover:border-text-secondary/20 focus:ring-surface-border',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs rounded',
      md: 'px-5 py-2.5 text-sm rounded-md',
      lg: 'px-8 py-3.5 text-base rounded-lg',
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        onMouseDown={handleMouseDown}
        {...props}
      >
        {/* Click ripples */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="animate-ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        ))}

        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current relative z-10"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="mr-2 inline-flex relative z-10">{leftIcon}</span>}
        <span className="relative z-10">{children}</span>
        {!isLoading && rightIcon && <span className="ml-2 inline-flex relative z-10">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
