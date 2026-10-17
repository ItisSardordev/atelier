import { useState } from 'react';
import { ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { formatPrice, type ProductImage } from '@/data/products';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import { useReveal } from '@/hooks/useReveal';

interface ProductPageProps {
  productId: string;
  onBack: () => void;
  onCheckout: () => void;
}

const galleryOrder: (keyof ProductImage)[] = [
  'full',
  'front',
  'back',
  'detail',
  'material',
  'editorial',
];

const galleryLabels: Record<keyof ProductImage, string> = {
  full: 'Full product',
  front: 'Front',
  back: 'Back',
  detail: 'Detail',
  material: 'Material',
  editorial: 'Editorial',
};

const accordions = [
  { key: 'materials', title: 'Materials' },
  { key: 'fit', title: 'Fit & sizing' },
  { key: 'shipping', title: 'Shipping' },
  { key: 'care', title: 'Care' },
  { key: 'atelier', title: 'Atelier notes' },
];

export function ProductPage({ productId, onBack, onCheckout }: ProductPageProps) {
  const ref = useReveal<HTMLDivElement>();
  const { getProduct, loading } = useStore();
  const { add } = useCart();
  const product = getProduct(productId);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [openAcc, setOpenAcc] = useState<string | null>('materials');
  const [added, setAdded] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <p className="font-display text-2xl text-stone">Loading…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <p className="font-display text-2xl text-stone">Piece not found.</p>
      </div>
    );
  }

  const handleAdd = () => {
    if (!size || !color) return;
    add({ product, size, color, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div ref={ref} className="min-h-screen bg-ivory pt-20">
      <div className="mx-auto max-w-[1600px] px-6 py-6 md:px-10">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider2 text-stone transition-colors hover:text-ink"
        >
          <ArrowLeft
            size={14}
            strokeWidth={1.5}
            className="transition-transform duration-500 group-hover:-translate-x-1"
          />
          Back to collection
        </button>
      </div>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-6 pb-24 md:px-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <div className="relative aspect-[3/4] overflow-hidden bg-beige">
            {galleryOrder.map((key, i) => (
              <img
                key={key}
                src={product.images[key]}
                alt={`${product.name} — ${galleryLabels[key]}`}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1200ms] ease-luxurious ${
                  activeImg === i ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            <span className="absolute bottom-5 left-5 z-10 font-mono text-[10px] uppercase tracking-wider2 text-ivory mix-blend-difference">
              {String(activeImg + 1).padStart(2, '0')} / {galleryOrder.length}{' '}
              — {galleryLabels[galleryOrder[activeImg]]}
            </span>
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar">
            {galleryOrder.map((key, i) => (
              <button
                key={key}
                onClick={() => setActiveImg(i)}
                className={`relative h-24 shrink-0 overflow-hidden transition-all duration-500 ${
                  activeImg === i
                    ? 'opacity-100 outline outline-1 outline-ink'
                    : 'opacity-50 hover:opacity-80'
                }`}
                style={{ width: '4.5rem' }}
              >
                <img
                  src={product.images[key]}
                  alt={galleryLabels[key]}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="font-mono text-[11px] uppercase tracking-widest2 text-stone">
              {product.category}
              {product.is_new && (
                <span className="ml-3 text-seasonal-dark">NEW</span>
              )}
            </p>
            <h1 className="mt-3 font-display text-5xl font-light leading-none tracking-tightest text-ink md:text-6xl">
              {product.name}
            </h1>
            <p className="mt-5 font-mono text-lg tabular-nums text-ink">
              {formatPrice(product.price)}
            </p>

            <p className="mt-6 font-sans text-base font-light leading-relaxed text-stone">
              {product.description}
            </p>

            <div className="mt-8">
              <p className="font-mono text-[10px] uppercase tracking-wider2 text-stone">
                Colour — {color ?? 'select'}
              </p>
              <div className="mt-3 flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    aria-label={c.name}
                    className={`h-9 w-9 rounded-full border transition-all duration-500 ${
                      color === c.name
                        ? 'ring-1 ring-ink ring-offset-2 ring-offset-ivory'
                        : 'border-ink/15 hover:border-ink/40'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8">
              <p className="font-mono text-[10px] uppercase tracking-wider2 text-stone">
                Size — {size ?? 'select'}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-[3rem] border px-4 py-3 font-mono text-[11px] uppercase tracking-wider2 transition-all duration-500 ${
                      size === s
                        ? 'border-ink bg-ink text-ivory'
                        : 'border-ink/15 text-ink hover:border-ink'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAdd}
                disabled={!size || !color}
                className={`flex flex-1 items-center justify-center gap-2 py-4 font-mono text-[11px] uppercase tracking-wider2 transition-all duration-500 ${
                  !size || !color
                    ? 'cursor-not-allowed bg-ink/20 text-ivory/60'
                    : added
                      ? 'bg-seasonal-dark text-ivory'
                      : 'bg-ink text-ivory hover:bg-charcoal'
                }`}
              >
                {added ? 'Added to bag' : 'Add to bag'}
              </button>
              <button
                onClick={() => {
                  handleAdd();
                  setTimeout(onCheckout, 400);
                }}
                disabled={!size || !color}
                className="flex flex-1 items-center justify-center gap-2 border border-ink py-4 font-mono text-[11px] uppercase tracking-wider2 text-ink transition-colors duration-500 enabled:hover:bg-ink enabled:hover:text-ivory disabled:border-ink/20 disabled:text-ink/40"
              >
                Buy now
                <ArrowRight size={14} strokeWidth={1.5} />
              </button>
            </div>
            {(!size || !color) && (
              <p className="mt-3 font-mono text-[10px] uppercase tracking-wider2 text-stone">
                Please select a size and colour.
              </p>
            )}

            <div className="mt-10 border-t border-ink/10">
              {accordions.map((acc) => {
                const isOpen = openAcc === acc.key;
                const content =
                  acc.key === 'materials'
                    ? product.material
                    : acc.key === 'fit'
                      ? product.fit
                      : acc.key === 'shipping'
                        ? 'Complimentary shipping on orders above €200. Dispatched within 2 business days from our Paris atelier. Delivered in unbleached cotton, tied with linen cord.'
                        : acc.key === 'care'
                          ? 'Wool: dry clean sparingly, air between wears, store folded. Linen: cold wash, hang dry. Leather: condition seasonally.'
                          : acc.key === 'atelier'
                            ? `${product.origin}. Each piece is numbered and signed by the artisan who finished it.`
                            : '';
                return (
                  <div key={acc.key} className="border-b border-ink/10">
                    <button
                      onClick={() => setOpenAcc(isOpen ? null : acc.key)}
                      className="flex w-full items-center justify-between py-5"
                    >
                      <span className="font-mono text-[11px] uppercase tracking-wider2 text-ink">
                        {acc.title}
                      </span>
                      <ChevronDown
                        size={16}
                        strokeWidth={1.25}
                        className={`text-ink transition-transform duration-500 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`grid transition-all duration-700 ease-luxurious ${
                        isOpen ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-md font-sans text-sm font-light leading-relaxed text-stone">
                          {content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
