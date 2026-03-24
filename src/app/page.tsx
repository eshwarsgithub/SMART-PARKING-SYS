import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
  ArrowUpRight, MapPin, Zap, Shield, Clock,
  Car, Calendar, CheckCircle2, Navigation2,
} from 'lucide-react';
import { LandingNavbar } from '@/components/shared/LandingNavbar';
import { FadeIn } from '@/components/shared/FadeIn';

export const dynamic = 'force-dynamic';

/* ─── Word-by-word blur animation ───────────────────────────── */
function BlurHeading({
  text,
  className = '',
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const words = text.split(' ');
  return (
    <h1 className={className} style={style}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block animate-blur-word"
          style={{
            animationDelay: `${i * 0.12}s`,
            animationFillMode: 'both',
          }}
        >
          {word}
          {i < words.length - 1 ? '\u00a0' : ''}
        </span>
      ))}
    </h1>
  );
}

/* ─── Section badge ──────────────────────────────────────────── */
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="liquid-glass rounded-full inline-flex px-3.5 py-1 mb-5">
      <span
        className="text-white/65 text-xs font-medium"
        style={{ fontFamily: "'Barlow', sans-serif" }}
      >
        {children}
      </span>
    </div>
  );
}

/* ─── Dot grid background ────────────────────────────────────── */
const dotGrid = {
  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
  backgroundSize: '38px 38px',
} as React.CSSProperties;

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default async function HomePage() {
  const supabase = await createClient();
  const { data: lots } = await supabase
    .from('parking_lots')
    .select('*')
    .eq('is_active', true)
    .limit(3);

  return (
    <div className="bg-black overflow-x-hidden">
      <LandingNavbar />

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
        {/* ambient orbs */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div
            className="absolute top-[15%] left-[10%] w-[700px] h-[700px] rounded-full bg-blue-600/8 blur-[140px] animate-float"
          />
          <div
            className="absolute bottom-[20%] right-[8%] w-[500px] h-[500px] rounded-full bg-indigo-500/6 blur-[120px] animate-float-alt"
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-violet-500/4 blur-[180px]"
          />
          {/* dot grid */}
          <div className="absolute inset-0" style={dotGrid} />
          {/* vignette edges */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_40%,black_100%)]" />
        </div>

        {/* content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto pt-36 pb-12">
          {/* badge pill */}
          <div
            className="inline-flex items-center gap-2.5 liquid-glass rounded-full px-4 py-2 mb-10 animate-fade-up"
            style={{ animationDelay: '0s' }}
          >
            <span
              className="bg-white text-black text-[10px] font-semibold rounded-full px-2 py-0.5 tracking-wide"
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              LIVE
            </span>
            <span
              className="text-white/70 text-sm"
              style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
            >
              Real-time parking for smart cities
            </span>
          </div>

          {/* heading */}
          <BlurHeading
            text="Find Your Spot. Park with Confidence."
            className="text-white tracking-[-3px] leading-[0.88] mb-7"
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(3rem, 8vw, 6.5rem)',
            } as React.CSSProperties}
          />

          {/* subtext */}
          <p
            className="text-white/55 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up"
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              animationDelay: '0.55s',
              animationFillMode: 'both',
            }}
          >
            Real-time availability. Instant reservations. Smart pricing.
            SafePark connects you to hundreds of parking spots across the city—
            before you even leave home.
          </p>

          {/* CTAs */}
          <div
            className="flex items-center justify-center gap-3 flex-wrap animate-fade-up"
            style={{ animationDelay: '0.8s', animationFillMode: 'both' }}
          >
            <Link
              href="/map"
              className="liquid-glass-strong rounded-full px-7 py-3.5 flex items-center gap-2 text-white text-sm font-medium hover:bg-white/[0.06] transition-all"
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              Find Parking <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="bg-white text-black rounded-full px-7 py-3.5 flex items-center gap-2 text-sm font-medium hover:bg-white/90 transition-all"
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              Get Started Free
            </Link>
          </div>
        </div>

        {/* floating stat pills */}
        <div
          className="relative z-10 flex flex-wrap justify-center gap-3 pb-20 animate-fade-up"
          style={{ animationDelay: '1.05s', animationFillMode: 'both' }}
        >
          {[
            { value: '500+', label: 'Parking Spots' },
            { value: 'Live', label: 'Real-time Updates' },
            { value: '₹30/hr', label: 'Starting Price' },
            { value: '24/7', label: 'Open Access' },
          ].map(({ value, label }) => (
            <div key={label} className="liquid-glass rounded-full px-5 py-2.5 flex items-center gap-3">
              <span
                className="text-white text-base"
                style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
              >
                {value}
              </span>
              <span
                className="text-white/45 text-xs"
                style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-[2] pointer-events-none" />
      </section>

      {/* ══════════════════ TRUSTED BY ══════════════════ */}
      <section className="py-14 px-6 border-t border-white/[0.06]">
        <FadeIn className="max-w-5xl mx-auto text-center">
          <div className="liquid-glass rounded-full inline-flex px-4 py-1.5 mb-8">
            <span
              className="text-white/50 text-xs"
              style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
            >
              Trusted by parking operators across Bangalore
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-14 items-center">
            {['Koramangala', 'Whitefield', 'Indiranagar', 'Jayanagar', 'HSR Layout', 'MG Road'].map((name, i) => (
              <FadeIn key={name} delay={i * 0.06} direction="none">
                <span
                  className="text-white/30 text-xl md:text-2xl hover:text-white/60 transition-colors duration-300 cursor-default"
                  style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
                >
                  {name}
                </span>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ══════════════════ HOW IT WORKS ══════════════════ */}
      <section id="how-it-works" className="relative py-32 px-6 md:px-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-700/6 blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge>How It Works</Badge>
            <h2
              className="text-white tracking-tight leading-[0.9] text-4xl md:text-5xl lg:text-6xl mb-5"
              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
            >
              You arrive. We handle the rest.
            </h2>
            <p
              className="text-white/50 text-sm max-w-lg mx-auto leading-relaxed"
              style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
            >
              From search to spot in under a minute. SafePark makes finding and
              reserving parking as simple as three steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                step: '01',
                icon: MapPin,
                title: 'Search your area',
                desc: 'Browse real-time availability on our interactive map. Filter by spot type, price, and distance from your destination.',
              },
              {
                step: '02',
                icon: Calendar,
                title: 'Reserve your spot',
                desc: 'Pick your time window and confirm in seconds. Your spot is database-locked—no one else can take it.',
              },
              {
                step: '03',
                icon: CheckCircle2,
                title: 'Park & go',
                desc: 'Arrive, park, and walk away. Extend your booking or cancel anytime right from the app.',
              },
            ].map(({ step, icon: Icon, title, desc }, i) => (
              <FadeIn key={step} delay={i * 0.12} direction="up">
              <div className="liquid-glass rounded-2xl p-8 hover:bg-white/[0.025] hover:scale-[1.02] transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-7">
                  <span
                    className="text-white/15 text-4xl"
                    style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
                  >
                    {step}
                  </span>
                  <div className="liquid-glass-strong rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h3
                  className="text-white text-xl mb-2.5"
                  style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
                >
                  {title}
                </h3>
                <p
                  className="text-white/45 text-sm leading-relaxed"
                  style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
                >
                  {desc}
                </p>
              </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FEATURES CHESS ══════════════════ */}
      <section id="features" className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge>Capabilities</Badge>
            <h2
              className="text-white tracking-tight leading-[0.9] text-4xl md:text-5xl"
              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
            >
              Pro features. Zero friction.
            </h2>
          </div>

          {/* Row 1 — text left, visual right */}
          <FadeIn className="flex flex-col lg:flex-row gap-10 items-center mb-10" direction="left">
            <div className="flex-1 space-y-5">
              <h3
                className="text-white text-2xl md:text-3xl leading-tight"
                style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
              >
                Live availability. Zero guesswork.
              </h3>
              <p
                className="text-white/50 text-sm leading-relaxed"
                style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
              >
                See every spot update in real-time via Supabase subscriptions.
                No refresh needed—the map reacts the instant a spot opens or fills.
                Know exactly what's available before you leave.
              </p>
              <Link
                href="/map"
                className="liquid-glass-strong rounded-full inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-medium hover:bg-white/[0.06] transition-all"
                style={{ fontFamily: "'Barlow', sans-serif" }}
              >
                Explore the map <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* parking grid visualisation */}
            <div className="flex-1 w-full">
              <div className="liquid-glass rounded-2xl p-7 aspect-video flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/8 to-blue-500/4 rounded-2xl" />
                <div className="relative z-10 grid grid-cols-5 gap-2.5 w-full max-w-xs">
                  {Array.from({ length: 15 }).map((_, i) => {
                    const occupied = [0, 2, 6, 9, 11, 13].includes(i);
                    const available = [1, 4, 7, 12].includes(i);
                    return (
                      <div
                        key={i}
                        className={`h-9 rounded-lg animate-pulse-slow ${
                          occupied  ? 'bg-red-500/55' :
                          available ? 'bg-emerald-500/55' :
                                      'bg-white/8'
                        }`}
                        style={{ animationDelay: `${i * 0.18}s` }}
                      />
                    );
                  })}
                </div>
                {/* live badge */}
                <div className="absolute bottom-4 right-4 liquid-glass rounded-full px-3 py-1 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span
                    className="text-white/65 text-xs"
                    style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
                  >
                    Live
                  </span>
                </div>
                {/* legend */}
                <div className="absolute top-4 left-4 flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-sm bg-emerald-500/70" />
                    <span className="text-white/35 text-[10px]" style={{ fontFamily: "'Barlow', sans-serif" }}>Free</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-sm bg-red-500/70" />
                    <span className="text-white/35 text-[10px]" style={{ fontFamily: "'Barlow', sans-serif" }}>Taken</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Row 2 — visual left, text right */}
          <FadeIn className="flex flex-col lg:flex-row-reverse gap-10 items-center" direction="right" delay={0.05}>
            <div className="flex-1 space-y-5">
              <h3
                className="text-white text-2xl md:text-3xl leading-tight"
                style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
              >
                Your spot, secured. Guaranteed.
              </h3>
              <p
                className="text-white/50 text-sm leading-relaxed"
                style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
              >
                Database-level locking prevents double bookings completely.
                When you reserve, it's locked—no race conditions, no "sorry,
                someone else got it." Your confirmation is real.
              </p>
              <Link
                href="/login"
                className="liquid-glass-strong rounded-full inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-medium hover:bg-white/[0.06] transition-all"
                style={{ fontFamily: "'Barlow', sans-serif" }}
              >
                Start booking <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* booking card visualisation */}
            <div className="flex-1 w-full">
              <div className="liquid-glass rounded-2xl p-7 aspect-video flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/8 to-indigo-500/4 rounded-2xl" />
                <div className="relative z-10 flex flex-col items-center gap-3 w-full max-w-xs">
                  <div className="liquid-glass-strong rounded-xl p-5 w-full">
                    <div className="flex justify-between items-center mb-3">
                      <span
                        className="text-white/40 text-xs"
                        style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
                      >
                        Spot B-07 · Koramangala
                      </span>
                      <span
                        className="bg-emerald-500/20 text-emerald-400 text-[10px] rounded-full px-2 py-0.5"
                        style={{ fontFamily: "'Barlow', sans-serif" }}
                      >
                        Confirmed
                      </span>
                    </div>
                    <p
                      className="text-white text-lg mb-1"
                      style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
                    >
                      Reserved for you
                    </p>
                    <p
                      className="text-white/35 text-xs"
                      style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
                    >
                      10:00 AM – 2:00 PM · ₹120 total
                    </p>
                  </div>
                  <div className="flex gap-2.5 w-full">
                    {['Extend Booking', 'Get Directions'].map((label) => (
                      <div key={label} className="flex-1 liquid-glass rounded-lg py-2 text-center">
                        <span
                          className="text-white/30 text-xs"
                          style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
                        >
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════ FEATURES GRID ══════════════════ */}
      <section className="py-24 px-6 md:px-16 lg:px-24 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-12">
            <Badge>Why SafePark</Badge>
            <h2
              className="text-white tracking-tight leading-[0.9] text-4xl md:text-5xl"
              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
            >
              The difference is everything.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Zap,
                title: 'Instant Updates',
                desc: 'Sub-second real-time sync via Supabase. The map always reflects ground truth.',
              },
              {
                icon: Shield,
                title: 'Secure by Default',
                desc: 'Database-level booking locks. Your reservation is truly yours, no exceptions.',
              },
              {
                icon: MapPin,
                title: 'Visual Explorer',
                desc: 'Color-coded interactive map. Filter by spot type and availability in seconds.',
              },
              {
                icon: Clock,
                title: 'Flexible Timing',
                desc: 'Book 30 minutes or days in advance. Extend on the fly without losing your spot.',
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.1} direction="up">
              <div className="liquid-glass rounded-2xl p-6 hover:bg-white/[0.025] hover:scale-[1.02] transition-all duration-300">
                <div className="liquid-glass-strong rounded-full w-10 h-10 flex items-center justify-center mb-5">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <h3
                  className="text-white text-lg mb-2.5"
                  style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
                >
                  {title}
                </h3>
                <p
                  className="text-white/45 text-sm leading-relaxed"
                  style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
                >
                  {desc}
                </p>
              </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ AVAILABLE LOTS ══════════════════ */}
      {lots && lots.length > 0 && (
        <section className="py-24 px-6 md:px-16 lg:px-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <Badge>Live Now</Badge>
                <h2
                  className="text-white tracking-tight leading-[0.9] text-3xl md:text-4xl"
                  style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
                >
                  Spots near you.
                </h2>
              </div>
              <Link
                href="/map"
                className="liquid-glass rounded-full px-5 py-2 text-white/60 text-sm hover:text-white transition-colors flex items-center gap-1.5 mb-1"
                style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
              >
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lots.map((lot, i) => (
                <FadeIn key={lot.id} delay={i * 0.1} direction="up">
                <Link href={`/map?lot=${lot.id}`}>
                  <div className="liquid-glass rounded-2xl p-6 hover:bg-white/[0.03] hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full group">
                    <div className="flex justify-between items-start mb-4">
                      <h3
                        className="text-white text-lg group-hover:text-white/90 transition-colors"
                        style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
                      >
                        {lot.name}
                      </h3>
                      <span
                        className={`liquid-glass rounded-full px-2.5 py-1 text-xs ${
                          lot.available_spots > 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}
                        style={{ fontFamily: "'Barlow', sans-serif" }}
                      >
                        {lot.available_spots > 0 ? `${lot.available_spots} free` : 'Full'}
                      </span>
                    </div>
                    <p
                      className="text-white/35 text-xs flex items-center gap-1.5 mb-2"
                      style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
                    >
                      <MapPin className="h-3 w-3 shrink-0" /> {lot.address}
                    </p>
                    <p
                      className="text-white/35 text-xs flex items-center gap-1.5"
                      style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
                    >
                      <Clock className="h-3 w-3 shrink-0" /> {lot.open_time} – {lot.close_time}
                    </p>
                  </div>
                </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════ STATS ══════════════════ */}
      <section className="py-24 px-6 md:px-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/8 via-transparent to-purple-900/6" />
          <div className="absolute inset-0" style={dotGrid} />
        </div>
        <FadeIn className="relative z-10 max-w-5xl mx-auto">
          <div className="liquid-glass rounded-3xl p-12 md:p-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
              {[
                { value: '500+', label: 'Parking spots' },
                { value: '98%', label: 'Uptime guarantee' },
                { value: '< 1s', label: 'Live update speed' },
                { value: '₹30', label: 'Starting per hour' },
              ].map(({ value, label }, i) => (
                <FadeIn key={label} delay={i * 0.1} direction="up">
                <div>
                  <div
                    className="text-white text-4xl md:text-5xl lg:text-6xl mb-2.5"
                    style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
                  >
                    {value}
                  </div>
                  <div
                    className="text-white/45 text-sm"
                    style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
                  >
                    {label}
                  </div>
                </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <section className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-12">
            <Badge>What They Say</Badge>
            <h2
              className="text-white tracking-tight leading-[0.9] text-4xl md:text-5xl"
              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
            >
              Don't take our word for it.
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                quote:
                  'I used to waste 20 minutes every morning hunting for parking near my office. SafePark changed that completely — I book the night before and just walk in.',
                name: 'Priya Sharma',
                role: 'Product Manager · Koramangala',
              },
              {
                quote:
                  'The real-time map is incredible. I can see availability updating live as I drive. It\'s the kind of UX polish I didn\'t know I needed in a parking app.',
                name: 'Arjun Mehta',
                role: 'Software Engineer · Whitefield',
              },
              {
                quote:
                  'Managing our lot on the admin side is effortless. The analytics dashboard shows exactly when peak hours hit, so I can price dynamically and maximise revenue.',
                name: 'Kavya Reddy',
                role: 'Parking Operator · Indiranagar',
              },
            ].map(({ quote, name, role }, i) => (
              <FadeIn key={name} delay={i * 0.12} direction="up">
              <div className="liquid-glass rounded-2xl p-8 hover:bg-white/[0.02] transition-all duration-300">
                <p
                  className="text-white/65 text-sm italic leading-relaxed mb-7"
                  style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
                >
                  &ldquo;{quote}&rdquo;
                </p>
                <div>
                  <p
                    className="text-white text-sm font-medium"
                    style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 500 }}
                  >
                    {name}
                  </p>
                  <p
                    className="text-white/35 text-xs mt-0.5"
                    style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
                  >
                    {role}
                  </p>
                </div>
              </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
      <section className="relative py-36 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-blue-600/5 blur-[160px]" />
          <div className="absolute inset-0" style={dotGrid} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_30%,black_100%)]" />
        </div>
        <FadeIn className="relative z-10 text-center max-w-3xl mx-auto">
          <h2
            className="text-white tracking-[-2px] leading-[0.88] mb-6"
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            }}
          >
            Your next parking spot starts here.
          </h2>
          <p
            className="text-white/50 text-lg mb-12 leading-relaxed"
            style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
          >
            Join thousands of drivers who've stopped circling the block.
            Find a spot, book it instantly, park with total confidence.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/map"
              className="liquid-glass-strong rounded-full px-8 py-3.5 text-white text-sm font-medium flex items-center gap-2 hover:bg-white/[0.06] transition-all"
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              Find Parking Now <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="bg-white text-black rounded-full px-8 py-3.5 text-sm font-medium hover:bg-white/90 transition-all"
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              Create Free Account
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer className="border-t border-white/[0.06] py-8 px-6 md:px-16">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-white/40" />
            <span
              className="text-white/60"
              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
            >
              SafePark
            </span>
          </div>
          <p
            className="text-white/30 text-xs"
            style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
          >
            © 2026 SafePark. Smart City Parking System.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Contact'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-white/30 text-xs hover:text-white/60 transition-colors"
                style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-white/[0.04] flex justify-center">
          <p
            className="text-white/50 text-xs"
            style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
          >
            Built with ♥ by Sahithi
          </p>
        </div>
      </footer>
    </div>
  );
}
