import React, { useState } from 'react';
import { X, User, Lock, Mail, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { api, UserProfile } from '../services/api';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('sujitjha.ids@indusuni.ac.in');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (mode === 'register') {
        const trimmedName = name.trim() || email.split('@')[0];
        const res = await api.register(trimmedName, email.trim(), password);
        setSuccessMessage('Account created and logged in!');
        setTimeout(() => {
          onSuccess(res.user);
          onClose();
        }, 500);
      } else {
        const res = await api.login(email.trim(), password);
        setSuccessMessage(`Welcome back, ${res.user.name}!`);
        setTimeout(() => {
          onSuccess(res.user);
          onClose();
        }, 500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('sujitjha.ids@indusuni.ac.in');
    setPassword('password123');
    setName('Sujit Jha');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-zinc-200 overflow-hidden my-8 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <span className="text-[11px] font-bold text-[#FF5722] tracking-wider uppercase">
              {mode === 'login' ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
            </span>
            <h2 className="text-xl font-extrabold text-zinc-900 mt-0.5">
              {mode === 'login' ? 'Sign in to Rupal' : 'Join Rupal Platform'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="mt-5 grid grid-cols-2 p-1 bg-zinc-100 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              mode === 'login' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              mode === 'register' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">{errorMessage}</span>
              {errorMessage.includes('log in instead') && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                  }}
                  className="mt-1 font-bold text-[#FF5722] underline cursor-pointer"
                >
                  Switch to Login
                </button>
              )}
            </div>
          </div>
        )}

        {/* Success Banner */}
        {successMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sujit Jha"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 pl-9 pr-3 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#FF5722]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 pl-9 pr-3 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#FF5722]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-zinc-700">Password</label>
              {mode === 'register' && (
                <span className="text-[10px] text-zinc-400">Min 4 characters</span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 pl-9 pr-3 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#FF5722]"
              />
            </div>
          </div>

          {/* Quick Demo Fill button */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] text-zinc-500 hover:text-[#FF5722] flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Fill Seeded Credentials</span>
            </button>
            <span className="text-[10px] text-zinc-400">Backend Verified</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-[#FF5722] py-3 text-xs font-bold text-white shadow-md hover:bg-[#E64A19] transition-colors cursor-pointer mt-2 flex items-center justify-center gap-2 disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{mode === 'login' ? 'Sign In Now' : 'Complete Registration'}</span>
            )}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encrypted Backend Database</span>
          </div>
          <span className="text-[10px] text-zinc-400">PBKDF2 Secured</span>
        </div>
      </div>
    </div>
  );
};
