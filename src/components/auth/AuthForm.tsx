'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { signInSchema, signUpSchema, SignInInput, SignUpInput } from '@/lib/validations';
import { toast } from 'sonner';
import { Car, Mail, Lock, User, Eye, EyeOff, ArrowUpRight } from 'lucide-react';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/* ── shared input style ─────────────────────────────────────── */
const inputCls =
  'w-full bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm pl-10 pr-4 py-2.5 placeholder:text-white/25 focus:outline-none focus:border-white/25 transition-colors';
const inputClsNoIcon =
  'w-full bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm px-4 py-2.5 placeholder:text-white/25 focus:outline-none focus:border-white/25 transition-colors';
const labelCls = 'block text-white/55 text-xs mb-1.5 font-body';
const errorCls = 'text-red-400 text-xs mt-1 font-body';

type Tab = 'signin' | 'signup';

export function AuthForm() {
  const [tab, setTab] = useState<Tab>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/map';
  const supabase = createClient();

  const signInForm = useForm<SignInInput>({ resolver: zodResolver(signInSchema) });
  const signUpForm = useForm<SignUpInput>({ resolver: zodResolver(signUpSchema) });

  const onSignIn = async (data: SignInInput) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Welcome back!');
    router.push(redirect);
    router.refresh();
  };

  const onSignUp = async (data: SignUpInput) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.full_name }, emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Account created! Check your email to confirm.');
    setTab('signin');
    signUpForm.reset();
  };

  const onGoogleSignIn = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback?next=${redirect}` },
    });
    if (error) { setGoogleLoading(false); toast.error(error.message); }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* ambient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/8 blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/6 blur-[100px] animate-float-alt" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '38px 38px' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="liquid-glass rounded-full w-14 h-14 flex items-center justify-center mb-3">
            <Car className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-white text-2xl" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
            SafePark
          </h1>
          <p className="text-white/40 text-xs mt-1 font-body">Smart city parking</p>
        </div>

        {/* Card */}
        <div className="liquid-glass rounded-2xl overflow-hidden">
          {/* Tab switcher */}
          <div className="flex p-1.5 gap-1 border-b border-white/[0.06]">
            {(['signin', 'signup'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm rounded-xl transition-all font-body ${
                  tab === t
                    ? 'liquid-glass-strong text-white font-medium'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {t === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-5">
            {/* Header */}
            <div>
              <p className="text-white text-lg" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
                {tab === 'signin' ? 'Welcome back' : 'Create account'}
              </p>
              <p className="text-white/40 text-xs mt-0.5 font-body font-light">
                {tab === 'signin' ? 'Sign in to manage your parking bookings' : 'Join SafePark to start booking spots'}
              </p>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={onGoogleSignIn}
              disabled={googleLoading || loading}
              className="w-full liquid-glass rounded-xl py-2.5 flex items-center justify-center gap-2.5 text-white/80 text-sm font-body hover:bg-white/[0.03] transition-all disabled:opacity-50"
            >
              <GoogleIcon />
              {googleLoading ? 'Redirecting…' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className="text-white/25 text-xs font-body">or</span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>

            {/* Sign In */}
            {tab === 'signin' && (
              <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                <div>
                  <label className={labelCls}>Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                    <input type="email" placeholder="you@example.com" className={inputCls} {...signInForm.register('email')} />
                  </div>
                  {signInForm.formState.errors.email && <p className={errorCls}>{signInForm.formState.errors.email.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className={`${inputCls} pr-10`}
                      {...signInForm.register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  {signInForm.formState.errors.password && <p className={errorCls}>{signInForm.formState.errors.password.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full bg-white text-black rounded-full py-2.5 text-sm font-medium font-body flex items-center justify-center gap-2 hover:bg-white/90 transition-all disabled:opacity-50 mt-2"
                >
                  {loading ? 'Signing in…' : <><span>Sign In</span><ArrowUpRight className="h-3.5 w-3.5" /></>}
                </button>
              </form>
            )}

            {/* Sign Up */}
            {tab === 'signup' && (
              <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                <div>
                  <label className={labelCls}>Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                    <input type="text" placeholder="John Doe" className={inputCls} {...signUpForm.register('full_name')} />
                  </div>
                  {signUpForm.formState.errors.full_name && <p className={errorCls}>{signUpForm.formState.errors.full_name.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                    <input type="email" placeholder="you@example.com" className={inputCls} {...signUpForm.register('email')} />
                  </div>
                  {signUpForm.formState.errors.email && <p className={errorCls}>{signUpForm.formState.errors.email.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className={`${inputCls} pr-10`}
                      {...signUpForm.register('password')}
                    />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  {signUpForm.formState.errors.password && <p className={errorCls}>{signUpForm.formState.errors.password.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="••••••••"
                      className={`${inputCls} pr-10`}
                      {...signUpForm.register('confirm_password')}
                    />
                    <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                      {showConfirm ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  {signUpForm.formState.errors.confirm_password && <p className={errorCls}>{signUpForm.formState.errors.confirm_password.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full bg-white text-black rounded-full py-2.5 text-sm font-medium font-body flex items-center justify-center gap-2 hover:bg-white/90 transition-all disabled:opacity-50 mt-2"
                >
                  {loading ? 'Creating account…' : <><span>Create Account</span><ArrowUpRight className="h-3.5 w-3.5" /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
