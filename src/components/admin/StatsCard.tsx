import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
}

export function StatsCard({
  title, value, change, changeType = 'neutral', icon: Icon, iconColor = 'text-white',
}: StatsCardProps) {
  return (
    <div className="liquid-glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-white/45 text-xs font-body font-light">{title}</p>
        <div className="liquid-glass-strong rounded-full w-8 h-8 flex items-center justify-center shrink-0">
          <Icon className={cn('h-3.5 w-3.5', iconColor)} />
        </div>
      </div>
      <p
        className="text-white text-3xl"
        style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
      >
        {value}
      </p>
      {change && (
        <p
          className={cn(
            'text-xs mt-1.5 font-body font-light',
            changeType === 'positive' && 'text-emerald-400',
            changeType === 'negative' && 'text-red-400',
            changeType === 'neutral' && 'text-white/30',
          )}
        >
          {change}
        </p>
      )}
    </div>
  );
}
