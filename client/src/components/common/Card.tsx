import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass-panel' | 'glass-card' | 'solid';
  hoverGlow?: 'none' | 'marvel' | 'dc';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'glass-card', hoverGlow = 'none', children, ...props }, ref) => {
    const glows = {
      none: '',
      marvel: 'hover-glow-marvel',
      dc: 'hover-glow-dc',
    };

    const variants = {
      'glass-panel': 'glass-panel shadow-glass rounded-xl',
      'glass-card': 'glass-card shadow-lg rounded-xl',
      solid: 'bg-background-surface border border-surface-border rounded-xl',
    };

    return (
      <div
        ref={ref}
        className={cn(
          variants[variant],
          glows[hoverGlow],
          'overflow-hidden transition-all duration-300',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-5 border-b border-surface-border/50', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('px-6 py-5', className)} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-4 border-t border-surface-border/50 bg-background-surface/30', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
