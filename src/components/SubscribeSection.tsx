import React, { useState, useEffect } from 'react';
import {
  Mail,
  Bell,
  Sparkles,
  Check,
  Copy,
  CheckCircle2,
  Gift,
  ShieldCheck,
  Clock,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { api } from '../services/api';

interface SubscribeSectionProps {
  id?: string;
  className?: string;
}

interface SubscriberData {
  email: string;
  preferences: string[];
  frequency: 'drops' | 'weekly';
  subscribedAt: string;
  promoCode: string;
}

const UPDATE_TOPICS = [
  { id: 'drops', label: 'New Hand-Block Drops', icon: '✨' },
  { id: 'sales', label: 'Flash Sales & Offers (Up to 70% Off)', icon: '🏷️' },
  { id: 'workshops', label: 'Artisan Stories & Woodcraft', icon: '🪵' },
  { id: 'bhimbetka', label: 'Heritage & Cave Art Archives', icon: '📜' },
];

const RECENT_DISPATCHES = [
  {
    tag: 'Private Drop',
    title: 'Revive Dupatta Edition: Natural Indigo & Alizarin',
    date: 'Yesterday',
    readTime: '2 min read',
  },
  {
    tag: 'Exclusive Promo',
    title: 'VIP Weekend: 25% Extra Off Bhimbetka Tunics',
    date: '3 days ago',
    readTime: 'Exclusive Code',
  },
  {
    tag: 'Craft Diary',
    title: 'Behind the Chisel: Seasoned Sagwan Teak Carving',
    date: 'Sep 21, 2026',
    readTime: 'Video Story',
  },
];

export const SubscribeSection: React.FC<SubscribeSectionProps> = ({
  id = 'newsletter',
  className = '',
}) => {
  const [email, setEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'drops',
    'sales',
  ]);
  const [frequency, setFrequency] = useState<'drops' | 'weekly'>('drops');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  // Stored subscriber in localStorage
  const [subscriber, setSubscriber] = useState<SubscriberData | null>(() => {
    try {
      const saved = localStorage.getItem('rupal_subscriber_info');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isSuccess, setIsSuccess] = useState(Boolean(subscriber));

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.length > 1
          ? prev.filter((t) => t !== topicId)
          : prev
        : [...prev, topicId]
    );
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmed = email.trim();
    if (!trimmed) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    // Basic email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setErrorMessage('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    setIsLoading(true);

    try {
      // Connect to backend API to persist subscriber
      await api.subscribe({
        email: trimmed,
        preferences: selectedTopics,
        frequency,
        promoCode: 'RUPAL500',
      });

      const newSub: SubscriberData = {
        email: trimmed,
        preferences: selectedTopics,
        frequency,
        subscribedAt: new Date().toISOString(),
        promoCode: 'RUPAL500',
      };

      try {
        localStorage.setItem('rupal_subscriber_info', JSON.stringify(newSub));
      } catch (err) {
        console.error('Storage error', err);
      }

      setSubscriber(newSub);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Subscription failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleResetSubscription = () => {
    localStorage.removeItem('rupal_subscriber_info');
    setSubscriber(null);
    setIsSuccess(false);
    setEmail('');
  };

  return (
    <section
      id={id}
      aria-label="Subscribe for New Updates"
      className={`relative py-16 sm:py-20 bg-gradient-to-b from-[#FFF8F5] via-white to-[#FFF5F0] overflow-hidden border-t border-orange-100/60 ${className}`}
    >
      {/* Decorative Warm Background Ornaments */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-amber-200/25 rounded-full blur-3xl pointer-events-none translate-y-1/3" />

      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-[#111827] rounded-[36px] p-8 sm:p-12 lg:p-16 text-white shadow-2xl relative overflow-hidden">
          {/* Subtle geometric craft print watermark pattern */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#FF5722 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Headline, Value Proposition & Perks */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Private Artisan Dispatch & VIP Access</span>
              </div>

              {/* Headline */}
              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  Subscribe for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] via-[#FF8A65] to-amber-300">New Updates</span> & Drops.
                </h2>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                  Receive private invitations to limited-edition hand-block collections,
                  seasonal flash discounts, Sagwan teak carving workshops, and Bhimbetka heritage motif releases.
                </p>
              </div>

              {/* 4 Trust Highlights / Perks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                  <Gift className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold block text-white">₹500 Gift</span>
                    <span className="text-[10px] text-zinc-400 block leading-tight">Welcome coupon</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                  <Bell className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold block text-white">Early Access</span>
                    <span className="text-[10px] text-zinc-400 block leading-tight">2 hrs before drops</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold block text-white">No Clutter</span>
                    <span className="text-[10px] text-zinc-400 block leading-tight">Curated dispatches</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold block text-white">Zero Spam</span>
                    <span className="text-[10px] text-zinc-400 block leading-tight">1-click unsubscribe</span>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-3 pt-2 text-xs text-zinc-400">
                <div className="flex -space-x-2">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 border-2 border-[#111827] flex items-center justify-center text-[10px] font-bold text-white">
                    RJ
                  </span>
                  <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 border-2 border-[#111827] flex items-center justify-center text-[10px] font-bold text-white">
                    AK
                  </span>
                  <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 border-2 border-[#111827] flex items-center justify-center text-[10px] font-bold text-white">
                    SM
                  </span>
                </div>
                <span>
                  Joined by <strong className="text-white">12,450+</strong> craft lovers and Indian textile collectors
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Subscription Form or Success Card */}
            <div className="lg:col-span-5">
              {!isSuccess ? (
                <div className="bg-white/[0.07] backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#FF5722]" />
                      Join the VIP Circle
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowPreferences(!showPreferences)}
                      className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>{showPreferences ? 'Hide Options' : 'Customise'}</span>
                    </button>
                  </div>

                  <form onSubmit={handleSubscribe} className="space-y-4">
                    {/* Email Input Field */}
                    <div className="space-y-1.5">
                      <label htmlFor="newsletter-email" className="sr-only">
                        Email address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          id="newsletter-email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errorMessage) setErrorMessage('');
                          }}
                          placeholder="Enter your email (e.g. rohit@indus.ac.in)"
                          className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white/10 text-white placeholder-zinc-400 text-sm border border-white/20 focus:outline-hidden focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/30 transition-all"
                          disabled={isLoading}
                        />
                      </div>
                      {errorMessage && (
                        <p className="text-xs text-rose-400 font-medium pl-1">
                          {errorMessage}
                        </p>
                      )}
                    </div>

                    {/* Collapsible / Expandable Preferences */}
                    {showPreferences && (
                      <div className="pt-2 pb-1 space-y-3 border-t border-white/10 animate-in fade-in duration-200">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                            Select Interests
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {UPDATE_TOPICS.map((topic) => {
                              const active = selectedTopics.includes(topic.id);
                              return (
                                <button
                                  key={topic.id}
                                  type="button"
                                  onClick={() => toggleTopic(topic.id)}
                                  className={`px-2.5 py-1.5 rounded-xl text-left text-xs font-medium border flex items-center gap-2 transition-all cursor-pointer ${
                                    active
                                      ? 'bg-[#FF5722]/20 border-[#FF5722] text-white'
                                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                                  }`}
                                >
                                  <span>{topic.icon}</span>
                                  <span className="truncate">{topic.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                            Frequency
                          </span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setFrequency('drops')}
                              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                frequency === 'drops'
                                  ? 'bg-white text-zinc-900 border-white'
                                  : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                              }`}
                            >
                              New Drops Only
                            </button>
                            <button
                              type="button"
                              onClick={() => setFrequency('weekly')}
                              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                frequency === 'weekly'
                                  ? 'bg-white text-zinc-900 border-white'
                                  : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                              }`}
                            >
                              Weekly Digest
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submit CTA */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FF5722] to-[#FF7043] hover:from-[#F4511E] hover:to-[#FF5722] text-white font-black text-sm tracking-wide shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Subscribe for Updates</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  <p className="text-[11px] text-zinc-400 text-center leading-tight">
                    Instant ₹500 welcome coupon code delivered on submission. Unsubscribe anytime.
                  </p>
                </div>
              ) : (
                /* Success Card with Promo Voucher & Details */
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-5 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">
                        You are Subscribed!
                      </h4>
                      <p className="text-xs text-emerald-300">
                        {subscriber?.email}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Thank you for supporting hand-crafted Indian textiles! You will receive notification whenever new hand-block collections or private sales go live.
                  </p>

                  {/* Promo Voucher Box */}
                  <div className="p-4 rounded-2xl bg-[#111827]/90 border border-orange-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 font-medium">Your Welcome Gift:</span>
                      <span className="text-[#FF5722] font-black">₹500 OFF Orders &gt; ₹1,999</span>
                    </div>

                    <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                      <span className="font-mono text-base font-black tracking-widest text-amber-300">
                        {subscriber?.promoCode || 'RUPAL500'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(subscriber?.promoCode || 'RUPAL500')}
                        className="flex items-center gap-1 text-xs font-bold text-white hover:text-[#FF5722] transition-colors cursor-pointer bg-white/10 px-2.5 py-1 rounded-lg"
                      >
                        {copiedCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                    <span className="text-zinc-400">Frequency: Drops &amp; Private Sales</span>
                    <button
                      type="button"
                      onClick={handleResetSubscription}
                      className="text-zinc-400 hover:text-white underline cursor-pointer text-[11px]"
                    >
                      Change email
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row: Recent Dispatches Preview */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {RECENT_DISPATCHES.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 hover:border-white/15 transition-all group"
              >
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-semibold">
                    {item.tag}
                  </span>
                  <span className="text-zinc-400">{item.date}</span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-orange-300 transition-colors line-clamp-1">
                  {item.title}
                </h4>
                <span className="text-[10px] text-zinc-400 mt-1 block">
                  {item.readTime}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
