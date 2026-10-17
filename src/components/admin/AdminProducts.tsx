import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, X, Loader2, Eye, EyeOff } from 'lucide-react';
import {
  adminFetchAllProducts,
  adminUpsertProduct,
  adminDeleteProduct,
} from '@/lib/data';
import { formatPrice } from '@/data/products';
import type { ProductRow } from '@/lib/types';

export function AdminProducts() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminFetchAllProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (product: ProductRow) => {
    await adminUpsertProduct(product);
    await load();
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    await adminDeleteProduct(id);
    await load();
  };

  const handleToggleActive = async (product: ProductRow) => {
    await adminUpsertProduct({ ...product, is_active: !product.is_active });
    await load();
  };

  const handleNew = () => {
    setEditing(null);
    setShowForm(true);
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
          {products.length} products
        </p>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 bg-ink px-5 py-3 font-mono text-[11px] uppercase tracking-wider2 text-ivory transition-colors hover:bg-charcoal"
        >
          <Plus size={14} strokeWidth={1.5} />
          Add product
        </button>
      </div>

      <div className="overflow-x-auto border border-ink/10">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ink/10 bg-beige/30">
              <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider2 text-stone">Product</th>
              <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider2 text-stone">Category</th>
              <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-wider2 text-stone">Price</th>
              <th className="px-4 py-3 text-center font-mono text-[10px] uppercase tracking-wider2 text-stone">Status</th>
              <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-wider2 text-stone">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-beige/20">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images.full}
                      alt={p.name}
                      className="h-12 w-10 object-cover"
                    />
                    <div>
                      <p className="font-sans text-sm text-ink">{p.name}</p>
                      <p className="font-mono text-[10px] text-stone">{p.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-stone">{p.category}</td>
                <td className="px-4 py-3 text-right font-mono text-sm tabular-nums text-ink">{formatPrice(p.price)}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleToggleActive(p)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 font-mono text-[9px] uppercase tracking-wider2 transition-colors ${
                      p.is_active
                        ? 'bg-seasonal/15 text-seasonal-dark'
                        : 'bg-ink/10 text-stone'
                    }`}
                  >
                    {p.is_active ? <Eye size={11} /> : <EyeOff size={11} />}
                    {p.is_active ? 'Live' : 'Hidden'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditing(p);
                        setShowForm(true);
                      }}
                      className="flex h-8 w-8 items-center justify-center text-stone transition-colors hover:bg-ink/10 hover:text-ink"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="flex h-8 w-8 items-center justify-center text-stone transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProductForm
          product={editing}
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

function ProductForm({
  product,
  onSave,
  onCancel,
}: {
  product: ProductRow | null;
  onSave: (p: ProductRow) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ProductRow>(
    product ?? {
      id: '',
      name: '',
      price: 0,
      category: 'OUTERWEAR',
      is_new: false,
      description: '',
      material: '',
      origin: '',
      fit: '',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: [{ name: 'Ivory', hex: '#F6F3EE' }],
      images: {
        full: '',
        front: '',
        back: '',
        detail: '',
        material: '',
        editorial: '',
      },
      is_active: true,
      sort_order: 99,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  );
  const [sizesText, setSizesText] = useState(form.sizes.join(', '));
  const [saving, setSaving] = useState(false);

  const update = (key: keyof ProductRow, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateImage = (key: keyof ProductRow['images'], value: string) =>
    setForm((prev) => ({
      ...prev,
      images: { ...prev.images, [key]: value },
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const sizes = sizesText.split(',').map((s) => s.trim()).filter(Boolean);
      onSave({ ...form, sizes, updated_at: new Date().toISOString() });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-ivory p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-light text-ink">
            {product ? 'Edit product' : 'New product'}
          </h2>
          <button onClick={onCancel}>
            <X size={20} className="text-stone" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="ID (slug)" value={form.id} onChange={(v) => update('id', v)} required disabled={!!product} />
            <FormField label="Name" value={form.name} onChange={(v) => update('name', v)} required />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField label="Price (€)" type="number" value={String(form.price)} onChange={(v) => update('price', parseInt(v) || 0)} required />
            <SelectField
              label="Category"
              value={form.category}
              onChange={(v) => update('category', v)}
              options={['OUTERWEAR', 'KNITWEAR', 'TROUSERS', 'ACCESSORIES']}
            />
            <FormField label="Sort order" type="number" value={String(form.sort_order)} onChange={(v) => update('sort_order', parseInt(v) || 0)} />
          </div>

          <TextAreaField label="Description" value={form.description} onChange={(v) => update('description', v)} />
          <FormField label="Material" value={form.material} onChange={(v) => update('material', v)} />
          <FormField label="Origin" value={form.origin} onChange={(v) => update('origin', v)} />
          <FormField label="Fit" value={form.fit} onChange={(v) => update('fit', v)} />

          <FormField label="Sizes (comma separated)" value={sizesText} onChange={setSizesText} />

          {/* Colors */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider2 text-stone">Colours</label>
            <div className="mt-2 space-y-2">
              {form.colors.map((color, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={color.name}
                    onChange={(e) => {
                      const colors = [...form.colors];
                      colors[i] = { ...colors[i], name: e.target.value };
                      update('colors', colors);
                    }}
                    placeholder="Colour name"
                    className="flex-1 border border-ink/15 px-3 py-2 font-sans text-sm text-ink focus:border-ink focus:outline-none"
                  />
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) => {
                      const colors = [...form.colors];
                      colors[i] = { ...colors[i], hex: e.target.value };
                      update('colors', colors);
                    }}
                    className="h-10 w-12 border border-ink/15"
                  />
                  <button
                    type="button"
                    onClick={() => update('colors', form.colors.filter((_, idx) => idx !== i))}
                    className="px-2 text-stone hover:text-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => update('colors', [...form.colors, { name: '', hex: '#000000' }])}
                className="font-mono text-[10px] uppercase tracking-wider2 text-ink underline underline-offset-4"
              >
                + Add colour
              </button>
            </div>
          </div>

          {/* Image URLs */}
          <div className="space-y-3 border-t border-ink/10 pt-4">
            <p className="font-mono text-[10px] uppercase tracking-wider2 text-stone">Image URLs</p>
            {(Object.keys(form.images) as (keyof ProductRow['images'])[]).map((key) => (
              <FormField
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                value={form.images[key]}
                onChange={(v) => updateImage(key, v)}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider2 text-stone">
              <input
                type="checkbox"
                checked={form.is_new}
                onChange={(e) => update('is_new', e.target.checked)}
              />
              Mark as NEW
            </label>
            <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider2 text-stone">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => update('is_active', e.target.checked)}
              />
              Published
            </label>
          </div>

          <div className="flex gap-3 border-t border-ink/10 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-ink px-6 py-3 font-mono text-[11px] uppercase tracking-wider2 text-ivory transition-colors hover:bg-charcoal disabled:opacity-50"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {product ? 'Save changes' : 'Create product'}
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
  label,
  value,
  onChange,
  type = 'text',
  required,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
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
        disabled={disabled}
        className="mt-1.5 w-full border border-ink/15 px-3 py-2.5 font-sans text-sm text-ink focus:border-ink focus:outline-none disabled:bg-beige/50"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
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

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-wider2 text-stone">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="mt-1.5 w-full border border-ink/15 px-3 py-2.5 font-sans text-sm text-ink focus:border-ink focus:outline-none"
      />
    </label>
  );
}
