'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { loginSchema, otpSchema, LoginInput, OtpInput } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Car, Mail, KeyRound, ArrowLeft } from 'lucide-react';

export function OtpLoginForm() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/map';
  const supabase = createClient();

  const emailForm = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });
  const otpForm = useForm<OtpInput>({ resolver: zodResolver(otpSchema) });

  const onSendOtp = async (data: LoginInput) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: data.email,
      options: { shouldCreateUser: true },
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setEmail(data.email);
    setStep('otp');
    toast.success('OTP sent to ' + data.email);
  };

  const onVerifyOtp = async (data: OtpInput) => {
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: data.token,
      type: 'email',
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Welcome to SafePark!');
    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Car className="h-8 w-8" />
            <span>SafePark</span>
          </div>
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-xl">
              {step === 'email' ? 'Sign in to SafePark' : 'Enter OTP'}
            </CardTitle>
            <CardDescription>
              {step === 'email'
                ? 'Enter your email to receive a one-time password'
                : `We sent a 6-digit code to ${email}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'email' ? (
              <form onSubmit={emailForm.handleSubmit(onSendOtp)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      {...emailForm.register('email')}
                    />
                  </div>
                  {emailForm.formState.errors.email && (
                    <p className="text-destructive text-sm">{emailForm.formState.errors.email.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send OTP'}
                </Button>
              </form>
            ) : (
              <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="token">6-Digit Code</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="token"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="123456"
                      className="pl-10 tracking-widest text-center text-lg"
                      {...otpForm.register('token')}
                    />
                  </div>
                  {otpForm.formState.errors.token && (
                    <p className="text-destructive text-sm">{otpForm.formState.errors.token.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify & Sign In'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setStep('email')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
