/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

export const otpSchema = z.object({
  token: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
});

export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signUpSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export const bookingSchema = z.object({
  spot_id: z.string().uuid('Invalid spot ID'),
  lot_id: z.string().uuid('Invalid lot ID'),
  starts_at: z.string().datetime('Invalid start time'),
  ends_at: z.string().datetime('Invalid end time'),
  vehicle_plate: z.string()
    .min(2, 'Vehicle plate too short')
    .max(20, 'Vehicle plate too long')
    .toUpperCase(),
  notes: z.string().max(500).optional(),
}).refine(
  (data) => new Date(data.ends_at) > new Date(data.starts_at),
  { message: 'End time must be after start time', path: ['ends_at'] }
).refine(
  (data) => {
    const duration = (new Date(data.ends_at).getTime() - new Date(data.starts_at).getTime()) / (1000 * 60);
    return duration >= 30;
  },
  { message: 'Minimum booking duration is 30 minutes', path: ['ends_at'] }
);

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().regex(/^\+?[\d\s\-()]{7,15}$/, 'Invalid phone number').optional().or(z.literal('')),
});

export const lotSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  address: z.string().min(5, 'Address too short').max(200),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  open_time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  close_time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  is_active: z.boolean(),
});

export const pricingRuleSchema = z.object({
  lot_id: z.string().uuid(),
  spot_type: z.enum(['standard', 'ev', 'handicap', 'motorcycle']),
  price_per_hour: z.number().min(0, 'Price must be non-negative'),
  min_duration_minutes: z.number().min(15).max(480),
});

export const cancelBookingSchema = z.object({
  reason: z.string().max(200).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type LotInput = z.infer<typeof lotSchema>;
export type PricingRuleInput = z.infer<typeof pricingRuleSchema>;
