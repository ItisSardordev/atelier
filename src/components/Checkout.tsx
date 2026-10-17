import { useState } from 'react';
import { Check, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import { createOrder } from '@/lib/data';

interface CheckoutProps {
  onComplete: () => void;
  onBack: () => void;
}

const steps = ['Information', 'Delivery', 'Payment', 'Confirmation'] as const;
type Step = (typeof steps)[number];

const shippingOptions = [
  { id: 'standard', name: 'Standard', detail: '3–5 business days', price: 0 },
  { id: 'express', name: 'Express', detail: '1–2 business days', price: 18 },
];

export function Checkout({ onComplete, onBack }: CheckoutProps) {
  const { items, subtotal, clear } = useCart();
  const [step, setStep] = useState<Step>('Information');
  const [shipping, setShipping] = useState(0);
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [orderNumber, setOrderNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepIndex = steps.indexOf(step);
  const total = subtotal + shipping;

  const updateForm = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const next = () => {
    const i = steps.indexOf(step);
    if (i < steps.length - 1) setStep(steps[i + 1]);
  };
  const prev = () => {
    const i = steps.indexOf(step);
    if (i > 0) setStep(steps[i - 1]);
    else onBack();
  };

  const placeOrder = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const orderNum = `ATL-${Math.floor(100000 + Math.random() * 899999)}`;
      const result = await createOrder({
        order_number: orderNum,
        customer_email: form.email,
        customer_name: `${form.firstName} ${form.lastName}`,
        shipping_address: {
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
        subtotal,
        shipping_cost: shipping,
        total,
        payment_method: 'card',
        payment_status: 'paid',
        status: 'paid',
        items: items.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          unit_price: item.product.price,
          line_total: item.product.price * item.quantity,
        })),
      });
      setOrderNumber(result.order_number);
      clear();
      setStep('Confirmation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && step !== 'Confirmation') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ivory px-6 text-center">
        <p className="font-display text-4xl font-light italic text-stone">
          Nothing to check out.
        </p>
        <button
          onClick={onBack}
          className="font-mono text-[11px] uppercase tracking-wider2 text-ink underline underline-offset-4"
        >
          Return to collection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pt-20">
      <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-10">
        <button
          onClick={prev}
          className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider2 text-stone transition-colors hover:text-ink"
        >
          <ArrowLeft
            size={14}
            strokeWidth={1.5}
            className="transition-transform duration-500 group-hover:-translate-x-1"
          />
          {stepIndex === 0 ? 'Continue shopping' : 'Back'}
        </button>

        <div className="mt-8 flex items-center gap-3 md:gap-6">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3 md:gap-6">
              <button
                onClick={() => i < stepIndex && setStep(s)}
                disabled={i >= stepIndex}
                className="flex items-center gap-2"
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[10px] tabular-nums transition-all duration-500 ${
                    i < stepIndex
                      ? 'border-ink bg-ink text-ivory'
                      : i === stepIndex
                        ? 'border-ink text-ink'
                        : 'border-ink/20 text-stone'
                  }`}
                >
                  {i < stepIndex ? <Check size={12} /> : String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={`hidden font-mono text-[11px] uppercase tracking-wider2 sm:block ${
                    i === stepIndex ? 'text-ink' : 'text-stone'
                  }`}
                >
                  {s}
                </span>
              </button>
              {i < steps.length - 1 && (
                <span
                  className={`h-px w-6 transition-colors duration-500 md:w-12 ${
                    i < stepIndex ? 'bg-ink' : 'bg-ink/15'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 pb-24 md:px-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          {step === 'Information' && (
            <>
              <FormBlock title="Contact">
                <Field
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(v) => updateForm('email', v)}
                />
              </FormBlock>
              <FormBlock title="Shipping address" className="mt-10">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First name" placeholder="Léa" value={form.firstName} onChange={(v) => updateForm('firstName', v)} />
                  <Field label="Last name" placeholder="Marchand" value={form.lastName} onChange={(v) => updateForm('lastName', v)} />
                </div>
                <Field label="Address" placeholder="12 Rue de Turenne" value={form.address} onChange={(v) => updateForm('address', v)} />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="City" placeholder="Paris" value={form.city} onChange={(v) => updateForm('city', v)} />
                  <Field label="Postal code" placeholder="75003" value={form.postalCode} onChange={(v) => updateForm('postalCode', v)} />
                </div>
                <Field label="Country" placeholder="France" value={form.country} onChange={(v) => updateForm('country', v)} />
              </FormBlock>
            </>
          )}

          {step === 'Delivery' && (
            <FormBlock title="Delivery method">
              <div className="space-y-3">
                {shippingOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setShipping(opt.price)}
                    className={`flex w-full items-center justify-between border p-5 text-left transition-all duration-500 ${
                      shipping === opt.price
                        ? 'border-ink bg-beige/40'
                        : 'border-ink/15 hover:border-ink/40'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-500 ${
                          shipping === opt.price ? 'border-ink bg-ink' : 'border-ink/30'
                        }`}
                      >
                        {shipping === opt.price && (
                          <span className="h-2 w-2 rounded-full bg-ivory" />
                        )}
                      </span>
                      <div>
                        <p className="font-sans text-sm font-medium text-ink">{opt.name}</p>
                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider2 text-stone">
                          {opt.detail}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-sm tabular-nums text-ink">
                      {opt.price === 0 ? 'Free' : formatPrice(opt.price)}
                    </span>
                  </button>
                ))}
              </div>
            </FormBlock>
          )}

          {step === 'Payment' && (
            <FormBlock title="Payment">
              <Field label="Card number" placeholder="0000 0000 0000 0000" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Expiry" placeholder="MM / YY" />
                <Field label="CVC" placeholder="123" />
              </div>
              <Field label="Name on card" placeholder="L. Marchand" />
              <p className="mt-4 font-mono text-[10px] uppercase tracking-wider2 text-stone">
                Secure payment — processed on confirmation.
              </p>
              {error && (
                <p className="mt-4 font-mono text-[10px] uppercase tracking-wider2 text-red-600">
                  {error}
                </p>
              )}
            </FormBlock>
          )}

          {step === 'Confirmation' && (
            <div className="flex flex-col items-start gap-6 py-10">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink text-ivory">
                <Check size={28} strokeWidth={1.25} />
              </span>
              <div>
                <h2 className="font-display text-4xl font-light italic leading-none tracking-tightest text-ink md:text-6xl">
                  Thank you.
                </h2>
                <p className="mt-4 max-w-md font-sans text-base font-light leading-relaxed text-stone">
                  Your order has been received. A confirmation has been sent to
                  your email. Your pieces will be prepared by hand and dispatched
                  within two business days.
                </p>
              </div>
              <div className="mt-4 w-full border-t border-ink/10 pt-6">
                <p className="font-mono text-[10px] uppercase tracking-wider2 text-stone">
                  Order number
                </p>
                <p className="mt-1 font-mono text-sm tabular-nums text-ink">
                  {orderNumber}
                </p>
              </div>
              <button
                onClick={onComplete}
                className="mt-4 flex items-center gap-3 bg-ink px-8 py-4 text-ivory transition-colors duration-500 hover:bg-charcoal"
              >
                <span className="font-mono text-[11px] uppercase tracking-wider2">
                  Continue browsing
                </span>
                <ArrowRight size={15} strokeWidth={1.5} />
              </button>
            </div>
          )}

          {step !== 'Confirmation' && (
            <button
              onClick={stepIndex === steps.length - 2 ? placeOrder : next}
              disabled={submitting}
              className="mt-10 flex items-center gap-3 bg-ink px-10 py-4 text-ivory transition-colors duration-500 hover:bg-charcoal disabled:opacity-50"
            >
              {submitting && <Loader2 size={15} className="animate-spin" />}
              <span className="font-mono text-[11px] uppercase tracking-wider2">
                {submitting
                  ? 'Processing…'
                  : stepIndex === steps.length - 2
                    ? 'Place order'
                    : 'Continue'}
              </span>
              {!submitting && <ArrowRight size={15} strokeWidth={1.5} />}
            </button>
          )}
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28 border border-ink/10 bg-beige/20 p-6 md:p-8">
            <h3 className="font-mono text-[11px] uppercase tracking-wider2 text-stone">
              Order summary
            </h3>
            <ul className="mt-6 space-y-4">
              {items.map((item) => (
                <li key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-4">
                  <div className="relative h-24 w-16 shrink-0 overflow-hidden bg-beige">
                    <img
                      src={item.product.images.full}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink font-mono text-[9px] text-ivory">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="font-display text-base font-light text-ink">
                      {item.product.name}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider2 text-stone">
                      {item.size} / {item.color}
                    </p>
                  </div>
                  <p className="self-center font-mono text-sm tabular-nums text-ink">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-3 border-t border-ink/10 pt-6">
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              <Row label="Shipping" value={shipping === 0 ? 'Free' : formatPrice(shipping)} />
              <div className="flex items-baseline justify-between border-t border-ink/10 pt-4">
                <span className="font-mono text-[11px] uppercase tracking-wider2 text-ink">
                  Total
                </span>
                <span className="font-display text-2xl font-light tabular-nums text-ink">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormBlock({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="font-display text-3xl font-light tracking-tight text-ink md:text-4xl">
        {title}
      </h2>
      <div className="mt-6 space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  optional,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  optional?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-wider2 text-stone">
        {label}
        {optional && <span className="ml-2 text-stone/60">— optional</span>}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="mt-2 w-full border-b border-ink/20 bg-transparent py-3 font-sans text-sm font-light text-ink placeholder:text-stone/40 transition-colors duration-300 focus:border-ink focus:outline-none"
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="font-mono text-[11px] uppercase tracking-wider2 text-stone">
        {label}
      </span>
      <span className="font-mono text-sm tabular-nums text-ink">{value}</span>
    </div>
  );
}
