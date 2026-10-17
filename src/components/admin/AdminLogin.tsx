import { useState } from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

interface AdminLoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function AdminLogin({ onSuccess, onBack }: AdminLoginProps) {
  const { signIn } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
      } else {
        onSuccess();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6 text-ivory">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <p className="font-display text-4xl font-light tracking-tightest">
            ATELIER
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-widest2 text-ivory/40">
            Admin Dashboard
          </p>
        </div>

        <div className="border border-ivory/10 bg-charcoal/50 p-8">
          <div className="mb-8 border-b border-ivory/10 pb-4 text-center">
            <p className="font-mono text-[10px] uppercase tracking-wider2 text-ivory/40">
              Authorized Access Only
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-wider2 text-ivory/40">
                  Email
                </span>
                <div className="mt-2 flex items-center gap-3 border-b border-ivory/20 pb-3">
                  <Mail size={15} className="text-ivory/40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@atelier.com"
                    className="flex-1 bg-transparent font-sans text-sm font-light text-ivory placeholder:text-ivory/30 focus:outline-none"
                  />
                </div>
              </label>
            </div>

            <div>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-wider2 text-ivory/40">
                  Password
                </span>
                <div className="mt-2 flex items-center gap-3 border-b border-ivory/20 pb-3">
                  <Lock size={15} className="text-ivory/40" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="flex-1 bg-transparent font-sans text-sm font-light text-ivory placeholder:text-ivory/30 focus:outline-none"
                  />
                </div>
              </label>
            </div>

            {error && (
              <p className="font-mono text-[10px] uppercase tracking-wider2 text-seasonal-light">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 bg-ivory py-4 font-mono text-[11px] uppercase tracking-wider2 text-ink transition-colors hover:bg-ivory/90 disabled:opacity-50"
            >
              {loading ? 'Processing…' : 'Sign In'}
              <ArrowRight size={14} strokeWidth={1.5} />
            </button>
          </form>
        </div>

        <button
          onClick={onBack}
          className="mt-6 block w-full text-center font-mono text-[10px] uppercase tracking-wider2 text-ivory/40 transition-colors hover:text-ivory"
        >
          ← Back to store
        </button>
      </div>
    </div>
  );
}
