import React from 'react';
import { cn } from '../../utils/cn';

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'spinner' | 'pulse-dots' | 'pulse-ring';
  size?: 'sm' | 'md' | 'lg';
  themeColor?: 'marvel' | 'dc' | 'default';
}

export const Loader: React.FC<LoaderProps> = ({
  className,
  variant = 'spinner',
  size = 'md',
  themeColor = 'default',
  ...props
}) => {
  const colors = {
    default: 'text-primary',
    marvel: 'text-accent-marvel',
    dc: 'text-accent-dc',
  };

  const bgGlows = {
    default: 'bg-primary',
    marvel: 'bg-accent-marvel shadow-marvel-glow',
    dc: 'bg-accent-dc shadow-dc-glow',
  };

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex items-center justify-center', className)} {...props}>
      {variant === 'spinner' && (
        <svg
          className={cn('animate-spin', sizes[size], colors[themeColor])}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3.5"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {variant === 'pulse-dots' && (
        <div className="flex gap-1.5 items-center">
          <div
            className={cn(
              'rounded-full animate-bounce [animation-delay:-0.3s]',
              size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2.5 h-2.5' : 'w-4 h-4',
              bgGlows[themeColor]
            )}
          />
          <div
            className={cn(
              'rounded-full animate-bounce [animation-delay:-0.15s]',
              size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2.5 h-2.5' : 'w-4 h-4',
              bgGlows[themeColor]
            )}
          />
          <div
            className={cn(
              'rounded-full animate-bounce',
              size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2.5 h-2.5' : 'w-4 h-4',
              bgGlows[themeColor]
            )}
          />
        </div>
      )}

      {variant === 'pulse-ring' && (
        <div className={cn('relative flex items-center justify-center', sizes[size])}>
          <span
            className={cn(
              'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
              bgGlows[themeColor]
            )}
          />
          <span
            className={cn('relative inline-flex rounded-full', sizes[size], bgGlows[themeColor])}
          />
        </div>
      )}
    </div>
  );
};
