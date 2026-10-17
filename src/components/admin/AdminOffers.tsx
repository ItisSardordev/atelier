import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, X, Loader2, Power } from 'lucide-react';
import {
  adminFetchOffers,
  adminUpsertOffer,
  adminDeleteOffer,
} from '@/lib/data';
import { formatPrice } from '@/data/products';
import type { OfferRow } from '@/lib/types';

const offerTypes: OfferRow['offer_type'][] = ['percentage', 'fixed_amount', 'free_shipping'];

export function AdminOffers() {
  const [offers, setOffers] = useState<OfferRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<OfferRow | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminFetchOffers();
      setOffers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (offer: Partial<OfferRow> & { code: string }) => {
    await adminUpsertOffer(offer);
    await load();
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this offer?')) return;
    await adminDeleteOffer(id);
    await load();
  };

  const handleToggle = async (offer: OfferRow) => {
    await adminUpsertOffer({ ...offer, is_active: !offer.is_active });
    await load();
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-stone" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-wider2 text-stone">
          {offers.length} offers · {offers.filter((o) => o.is_active).length} active
        </p>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-ink px-5 py-3 font-mono text-[11px] uppercase tracking-wider2 text-ivory transition-colors hover:bg-charcoal"
        >
          <Plus size={14} strokeWidth={1.5} />
          Add offer
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={`border p-6 ${
              offer.is_active
                ? 'border-seasonal/30 bg-seasonal/5'
                : 'border-ink/10 bg-white/30'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl font-light text-ink">{offer.title}</h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider2 text-stone">
                  {offer.offer_type === 'percentage' && `${offer.value}% off`}
                  {offer.offer_type === 'fixed_amount' && `${formatPrice(Number(offer.value))} off`}
                  {offer.offer_type === 'free_shipping' && 'Free shipping'}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleToggle(offer)}
                  className={`flex h-8 w-8 items-center justify-center transition-colors ${
                    offer.is_active ? 'text-seasonal-dark' : 'text-stone hover:text-ink'
                  }`}
                >
                  <Power size={14} />
                </button>
                <button
                  onClick={() => {
                    setEditing(offer);
                    setShowForm(true);
                  }}
                  className="flex h-8 w-8 items-center justify-center text-stone transition-colors hover:bg-ink/10 hover:text-ink"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(offer.id)}
                  className="flex h-8 w-8 items-center justify-center text-stone transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <p className="mt-3 font-sans text-sm font-light text-stone">
              {offer.description}
            </p>

            <div className="mt-4 flex items-center gap-3 border-t border-ink/10 pt-4">
              <span className="border border-ink/20 px-3 py-1 font-mono text-[11px] text-ink">
                {offer.code}
              </span>
              <span className={`font-mono text-[10px] uppercase tracking-wider2 ${
                offer.is_active ? 'text-seasonal-dark' : 'text-stone'
              }`}>
                {offer.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="mt-3 font-mono text-[10px] text-stone">
              {offer.ends_at
                ? `Until ${new Date(offer.ends_at).toLocaleDateString('en-GB')}`
                : 'No end date'}
              {offer.applicable_category && ` · ${offer.applicable_category} only`}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <OfferForm
          offer={editing}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function OfferForm({
  offer,
  onSave,
  onCancel,
}: {
  offer: OfferRow | null;
  onSave: (o: Partial<OfferRow> & { code: string }) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    id: offer?.id ?? crypto.randomUUID(),
    title: offer?.title ?? '',
    description: offer?.description ?? '',
    offer_type: offer?.offer_type ?? 'percentage' as OfferRow['offer_type'],
    value: offer?.value ?? 10,
    code: offer?.code ?? '',
    is_active: offer?.is_active ?? true,
    starts_at: offer?.starts_at ?? new Date().toISOString(),
    ends_at: offer?.ends_at ?? '',
    applicable_category: offer?.applicable_category ?? '',
  });
  const [saving, setSaving] = useState(false);

  const update = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      onSave({
        id: form.id,
        title: form.title,
        description: form.description,
        offer_type: form.offer_type,
        value: Number(form.value),
        code: form.code.toUpperCase(),
        is_active: form.is_active,
        starts_at: form.starts_at,
        ends_at: form.ends_at || null,
        applicable_category: form.applicable_category || null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-ivory p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-light text-ink">
            {offer ? 'Edit offer' : 'New offer'}
          </h2>
          <button onClick={onCancel}>
            <X size={20} className="text-stone" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="Title" value={form.title} onChange={(v) => update('title', v)} required />
          <TextAreaField label="Description" value={form.description} onChange={(v) => update('description', v)} />

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Type"
              value={form.offer_type}
              onChange={(v) => update('offer_type', v)}
              options={offerTypes}
            />
            <FormField
              label={form.offer_type === 'percentage' ? 'Value (%)' : 'Value (€)'}
              type="number"
              value={String(form.value)}
              onChange={(v) => update('value', v)}
              required
            />
          </div>

          <FormField label="Coupon code" value={form.code} onChange={(v) => update('code', v.toUpperCase())} required />

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Category (optional)"
              value={form.applicable_category}
              onChange={(v) => update('applicable_category', v)}
              options={['', 'OUTERWEAR', 'KNITWEAR', 'TROUSERS', 'ACCESSORIES']}
            />
            <FormField
              label="End date (optional)"
              type="date"
              value={form.ends_at ? form.ends_at.split('T')[0] : ''}
              onChange={(v) => update('ends_at', v ? new Date(v).toISOString() : '')}
            />
          </div>

          <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider2 text-stone">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => update('is_active', e.target.checked)}
            />
            Active
          </label>

          <div className="flex gap-3 border-t border-ink/10 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-ink px-6 py-3 font-mono text-[11px] uppercase tracking-wider2 text-ivory transition-colors hover:bg-charcoal disabled:opacity-50"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {offer ? 'Save changes' : 'Create offer'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 font-mono text-[11px] uppercase tracking-wider2 text-stone transition-colors hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({
  label, value, onChange, type = 'text', required,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-wider2 text-stone">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
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
          <option key={o} value={o}>{o || 'All categories'}</option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({
  label, value, onChange,
}: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-wider2 text-stone">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="mt-1.5 w-full border border-ink/15 px-3 py-2.5 font-sans text-sm text-ink focus:border-ink focus:outline-none"
      />
    </label>
  );
}
