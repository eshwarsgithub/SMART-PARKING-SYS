'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { ParkingSpot, ParkingLot, PricingRule } from '@/lib/supabase/types';
import { BookingForm } from '@/components/booking/BookingForm';

interface QuickBookDrawerProps {
  spot: ParkingSpot | null;
  lot: ParkingLot | null;
  pricingRule?: PricingRule;
  onClose: () => void;
}

export function QuickBookDrawer({ spot, lot, pricingRule, onClose }: QuickBookDrawerProps) {
  const isOpen = !!spot && !!lot;

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSuccess = (bookingId: string) => {
    onClose();
    toast.success('Booking confirmed!', {
      description: 'View details in My Bookings.',
      action: { label: 'View', onClick: () => window.location.href = `/bookings/${bookingId}` },
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop — above navbar (z-1100) */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1200]"
        onClick={onClose}
      />

      {/* Drawer — bottom sheet on mobile, right slide-in on desktop */}
      <div className="fixed z-[1300] bottom-0 left-0 right-0 md:bottom-auto md:top-0 md:right-0 md:left-auto md:w-[480px] md:h-full flex flex-col">
        <div className="liquid-glass-strong md:h-full rounded-t-3xl md:rounded-none md:rounded-l-3xl border-t border-l border-white/[0.07] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
            <div>
              <p
                className="text-white text-base"
                style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
              >
                Reserve Spot {spot!.spot_number}
              </p>
              <p className="text-white/35 text-xs font-body font-light" style={{ fontFamily: "'Barlow', sans-serif" }}>
                {lot!.name} · Floor {spot!.floor}
              </p>
            </div>
            <button
              onClick={onClose}
              className="liquid-glass rounded-full w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Scrollable form area */}
          <div className="flex-1 overflow-y-auto p-5">
            <BookingForm
              spot={spot!}
              lot={lot!}
              pricingRule={pricingRule}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      </div>
    </>
  );
}
