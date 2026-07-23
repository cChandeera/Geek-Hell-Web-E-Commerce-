import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  focusTheme?: 'default' | 'marvel' | 'dc';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, focusTheme = 'default', disabled, ...props }, ref) => {
    const focusGlows = {
      default: 'focus:border-primary focus:ring-primary/30',
      marvel: 'focus:border-accent-marvel focus:ring-accent-marvel/30',
      dc: 'focus:border-accent-dc focus:ring-accent-dc/30',
    };

    return (
      <div className="w-full flex flex-col gap-1.5 select-none">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary font-display">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            className={cn(
              'w-full px-4 py-3 bg-background-surface/80 border border-surface-border text-text-primary text-sm rounded-md transition-all duration-300 focus:outline-none focus:ring-4',
              focusGlows[focusTheme],
              error && 'border-danger focus:border-danger focus:ring-danger/25',
              disabled && 'opacity-50 cursor-not-allowed bg-background-surface/30',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs font-medium text-danger transition-all duration-200">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span className="text-xs text-text-muted">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
