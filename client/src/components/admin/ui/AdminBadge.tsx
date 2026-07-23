import React from 'react';
import { clsx } from 'clsx';

interface AdminBadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'purple' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

export const AdminBadge: React.FC<AdminBadgeProps> = ({ variant = 'neutral', children, className }) => {
  const styles = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
    info: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    neutral: 'bg-zinc-800/80 text-zinc-300 border-zinc-700/50',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all',
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
