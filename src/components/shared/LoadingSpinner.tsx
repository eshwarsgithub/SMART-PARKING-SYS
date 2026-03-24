import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export function LoadingSpinner({ size = 'md', className, label }: LoadingSpinnerProps) {
  const sizes = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-2', lg: 'h-10 w-10 border-2' };
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className={cn('animate-spin rounded-full border-white/20 border-t-white/70', sizes[size])} />
      {label && (
        <p className="text-white/40 text-xs font-body font-light">{label}</p>
      )}
    </div>
  );
}
