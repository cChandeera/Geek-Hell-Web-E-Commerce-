import React from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AdminCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  accentColor?: 'red' | 'blue' | 'purple' | 'emerald';
}

export const AdminCard: React.FC<AdminCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  accentColor = 'red',
}) => {
  const accents = {
    red: 'from-red-500/20 to-transparent border-red-500/30 text-red-400 shadow-red-500/5',
    blue: 'from-blue-500/20 to-transparent border-blue-500/30 text-blue-400 shadow-blue-500/5',
    purple: 'from-purple-500/20 to-transparent border-purple-500/30 text-purple-400 shadow-purple-500/5',
    emerald: 'from-emerald-500/20 to-transparent border-emerald-500/30 text-emerald-400 shadow-emerald-500/5',
  };

  return (
    <div
      className={clsx(
        'relative overflow-hidden bg-gradient-to-b bg-[#121215] border rounded-2xl p-6 shadow-xl transition-all duration-300 hover:scale-[1.01]',
        accents[accentColor]
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">{title}</span>
        <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <h3 className="text-3xl font-extrabold text-white tracking-tight">{value}</h3>
        {change && (
          <span
            className={clsx(
              'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border',
              isPositive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            )}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>
    </div>
  );
};
