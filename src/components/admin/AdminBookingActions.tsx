'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookingStatus } from '@/lib/supabase/types';
import { toast } from 'sonner';
import { MoreHorizontal } from 'lucide-react';

const STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  confirmed: ['active', 'cancelled'],
  active: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

interface AdminBookingActionsProps {
  bookingId: string;
  currentStatus: BookingStatus | string;
}

export function AdminBookingActions({ bookingId, currentStatus }: AdminBookingActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const transitions = STATUS_TRANSITIONS[currentStatus as BookingStatus] ?? [];

  if (transitions.length === 0) return <span className="text-xs text-muted-foreground">—</span>;

  const updateStatus = async (status: BookingStatus) => {
    setLoading(true);
    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setLoading(false);

    if (res.ok) {
      toast.success(`Booking marked as ${status}`);
      router.refresh();
    } else {
      const json = await res.json();
      toast.error(json.error || 'Failed to update');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={loading}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md p-0 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
      >
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border">
        {transitions.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => updateStatus(status)}
            className="cursor-pointer"
          >
            Mark as {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
