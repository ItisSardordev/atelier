import { useEffect, useState } from 'react';
import { CreditCard, Save, Loader2, Check, AlertCircle } from 'lucide-react';
import {
  adminFetchPaymentSettings,
  adminUpdatePaymentSettings,
} from '@/lib/data';
import type { PaymentSettingsRow } from '@/lib/types';

export function AdminPayment() {
  const [settings, setSettings] = useState<PaymentSettingsRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminFetchPaymentSettings()
      .then((data) => setSettings(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const update = (key: keyof PaymentSettingsRow, value: unknown) =>
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await adminUpdatePaymentSettings({
        provider_name: settings.provider_name,
        is_live_mode: settings.is_live_mode,
        publishable_key: settings.publishable_key,
        secret_key: settings.secret_key,
        currency: settings.currency,
        webhook_url: settings.webhook_url,
        is_enabled: settings.is_enabled,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-stone" size={24} />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="font-mono text-[11px] uppercase tracking-wider2 text-stone">
          No payment settings found.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Status banner */}
      <div className={`flex items-center gap-3 p-4 ${settings.is_enabled ? 'bg-seasonal/10 text-seasonal-dark' : 'bg-sand/30 text-stone'}`}>
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${settings.is_enabled ? 'bg-seasonal-dark text-ivory' : 'bg-stone text-ivory'}`}>
          <CreditCard size={18} strokeWidth={1.25} />
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider2">
            {settings.is_enabled ? 'Payments Enabled' : 'Payments Disabled'}
          </p>
          <p className="font-sans text-xs">
            {settings.provider_name} · {settings.is_live_mode ? 'Live mode' : 'Test mode'} · {settings.currency}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Provider */}
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Payment provider"
            value={settings.provider_name}
            onChange={(v) => update('provider_name', v)}
            options={['stripe', 'paypal', 'square']}
          />
          <SelectField
            label="Currency"
            value={settings.currency}
            onChange={(v) => update('currency', v)}
            options={['EUR', 'USD', 'GBP', 'JPY']}
          />
        </div>

        {/* Mode toggle */}
        <div className="flex gap-6 border border-ink/10 p-5">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="mode"
              checked={!settings.is_live_mode}
              onChange={() => update('is_live_mode', false)}
            />
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider2 text-ink">Test mode</p>
              <p className="font-sans text-xs text-stone">No real charges. Use test cards.</p>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="mode"
              checked={settings.is_live_mode}
              onChange={() => update('is_live_mode', true)}
            />
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider2 text-ink">Live mode</p>
              <p className="font-sans text-xs text-stone">Real transactions. Use live keys.</p>
            </div>
          </label>
        </div>

        {/* API Keys */}
        <div className="space-y-4 border-t border-ink/10 pt-5">
          <h3 className="font-mono text-[10px] uppercase tracking-wider2 text-stone">API Credentials</h3>
          <FormField
            label="Publishable key"
            value={settings.publishable_key}
            onChange={(v) => update('publishable_key', v)}
            placeholder="pk_live_... or pk_test_..."
          />
          <FormField
            label="Secret key"
            value={settings.secret_key}
            onChange={(v) => update('secret_key', v)}
            placeholder="sk_live_... or sk_test_..."
            type="password"
          />
          <FormField
            label="Webhook URL"
            value={settings.webhook_url}
            onChange={(v) => update('webhook_url', v)}
            placeholder="https://your-app.com/webhooks/payment"
          />
        </div>

        {/* Enable toggle */}
        <label className="flex items-center gap-3 border-t border-ink/10 pt-5">
          <input
            type="checkbox"
            checked={settings.is_enabled}
            onChange={(e) => update('is_enabled', e.target.checked)}
            className="h-5 w-5"
          />
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider2 text-ink">
              Enable payment processing
            </p>
            <p className="font-sans text-xs text-stone">
              When enabled, customers can complete checkout with card payments.
            </p>
          </div>
        </label>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 p-4 text-red-700">
            <AlertCircle size={16} />
            <p className="font-mono text-[10px] uppercase tracking-wider2">{error}</p>
          </div>
        )}

        {saved && (
          <div className="flex items-center gap-2 bg-seasonal/10 p-4 text-seasonal-dark">
            <Check size={16} />
            <p className="font-mono text-[10px] uppercase tracking-wider2">Settings saved.</p>
          </div>
        )}

        {/* Save */}
        <div className="flex gap-3 border-t border-ink/10 pt-6">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-ink px-6 py-3 font-mono text-[11px] uppercase tracking-wider2 text-ivory transition-colors hover:bg-charcoal disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save settings
          </button>
        </div>
      </form>
    </div>
  );
}

function FormField({
  label, value, onChange, placeholder, type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-wider2 text-stone">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full border border-ink/15 px-3 py-2.5 font-sans text-sm text-ink focus:border-ink focus:outline-none"
      />
    </label>
  );
}

function SelectField({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-wider2 text-stone">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full border border-ink/15 px-3 py-2.5 font-sans text-sm text-ink focus:border-ink focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
