'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from '@/lib/supabase/client';
import { profileSchema, ProfileInput } from '@/lib/validations';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/shared/Navbar';
import { toast } from 'sonner';
import { Mail, Phone, Shield, ArrowUpRight } from 'lucide-react';

const inputCls = 'w-full bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm px-4 py-2.5 placeholder:text-white/25 focus:outline-none focus:border-white/25 transition-colors font-body';
const labelCls = 'block text-white/50 text-xs mb-1.5 font-body font-light';
const errorCls = 'text-red-400 text-xs mt-1 font-body';

export default function ProfilePage() {
  const { user, profile, refetchProfile } = useAuth();
  const supabase = createClient();

  const { register, handleSubmit, reset, formState: { errors, isDirty, isSubmitting } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) reset({ full_name: profile.full_name || '', phone: profile.phone || '' });
  }, [profile, reset]);

  const onSubmit = async (data: ProfileInput) => {
    const { error } = await supabase
      .from('profiles').update({ full_name: data.full_name, phone: data.phone || null }).eq('id', user!.id);
    if (error) { toast.error('Failed to update profile'); return; }
    toast.success('Profile updated');
    await refetchProfile?.();
    reset(data);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1
            className="text-white text-3xl mb-1"
            style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
          >
            Profile
          </h1>
          <p className="text-white/40 text-sm font-body font-light">Manage your account settings</p>
        </div>

        <div className="space-y-4">
          {/* Account info */}
          <div className="liquid-glass rounded-2xl p-6">
            <h2
              className="text-white text-base mb-4"
              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
            >
              Account Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-white/30" />
                  <span className="text-white/40 text-xs font-body font-light">Email</span>
                  <span className="text-white/80 text-sm font-body">{profile?.email}</span>
                </div>
                <span className="liquid-glass rounded-full px-2.5 py-1 text-white/50 text-[10px] font-body">
                  Verified
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Shield className="h-4 w-4 text-white/30" />
                <span className="text-white/40 text-xs font-body font-light">Role</span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-body liquid-glass ${
                    profile?.role === 'admin' ? 'text-violet-400' : 'text-blue-400'
                  }`}
                >
                  {profile?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Edit form */}
          <div className="liquid-glass rounded-2xl p-6">
            <h2
              className="text-white text-base mb-1"
              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
            >
              Edit Profile
            </h2>
            <p className="text-white/35 text-xs font-body font-light mb-5">Update your personal information</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className={labelCls}>Full Name</label>
                <input type="text" placeholder="Your name" className={inputCls} {...register('full_name')} />
                {errors.full_name && <p className={errorCls}>{errors.full_name.message}</p>}
              </div>
              <div>
                <label className={labelCls}>
                  <Phone className="inline h-3 w-3 mr-1" /> Phone (optional)
                </label>
                <input type="tel" placeholder="+91 98765 43210" className={inputCls} {...register('phone')} />
                {errors.phone && <p className={errorCls}>{errors.phone.message}</p>}
              </div>
              <button
                type="submit"
                disabled={!isDirty || isSubmitting}
                className="bg-white text-black rounded-full px-6 py-2.5 text-sm font-medium font-body flex items-center gap-1.5 hover:bg-white/90 transition-all disabled:opacity-40"
              >
                {isSubmitting ? 'Saving…' : <><span>Save Changes</span><ArrowUpRight className="h-3.5 w-3.5" /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
