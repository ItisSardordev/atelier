import { useState, useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/data/products';
import { useReveal } from '@/hooks/useReveal';
import type { ProductRow } from '@/lib/types';

const categories = ['ALL', 'OUTERWEAR', 'KNITWEAR', 'TROUSERS', 'ACCESSORIES'] as const;

interface CollectionProps {
  onProduct: (id: string) => void;
}

export function Collection({ onProduct }: CollectionProps) {
  const { products, loading } = useStore();
  const [filter, setFilter] = useState<string>('ALL');
  const ref = useReveal<HTMLDivElement>();

  const filtered = useMemo(
    () =>
      filter === 'ALL'
        ? products
        : products.filter((p) => p.category === filter),
    [filter, products]
  );

  return (
    <section ref={ref} id="collection" className="bg-ivory py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="reveal-line font-mono text-[11px] uppercase tracking-widest2 text-stone">
              <span>COLLECTION 06 — A/W</span>
            </p>
            <h2 className="reveal-line mt-4 font-display text-6xl font-light leading-none tracking-tightest text-ink md:text-8xl">
              <span>The Collection</span>
            </h2>
          </div>
          <p className="reveal-line max-w-sm font-sans text-sm font-light leading-relaxed text-stone">
            <span>
              {loading
                ? 'Loading pieces…'
                : `${filtered.length} considered pieces. Each made in limited runs, designed to be worn for years rather than seasons.`}
            </span>
          </p>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-1 border-y border-ink/10 py-4 md:gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 font-mono text-[11px] uppercase tracking-wider2 transition-colors duration-500 md:px-6 ${
                filter === cat
                  ? 'bg-ink text-ivory'
                  : 'text-stone hover:text-ink'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto font-mono text-[11px] text-stone tabular-nums">
            {String(filtered.length).padStart(2, '0')} PIECES
          </span>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-[1600px] px-6 md:mt-16 md:px-10">
        {loading ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 md:gap-x-8 md:gap-y-24 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-beige" />
                <div className="mt-5 h-5 w-1/2 bg-beige" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 md:gap-x-8 md:gap-y-24 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                onProduct={onProduct}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

interface CardProps {
  product: ProductRow;
  index: number;
  onProduct: (id: string) => void;
}

function ProductCard({ product, index, onProduct }: CardProps) {
  const [hovered, setHovered] = useState(false);
  const offset = index % 3 === 1 ? 'md:mt-20' : '';
  const span = index % 5 === 0 ? 'sm:col-span-2 sm:row-span-1' : '';

  return (
    <article
      className={`group relative ${offset} ${span}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onProduct(product.id)}
      data-cursor="view"
      data-cursor-label="VIEW"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-beige">
        <img
          src={product.images.full}
          alt={product.name}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1200ms] ease-luxurious ${
            hovered ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
          }`}
        />
        <img
          src={product.images.editorial}
          alt={`${product.name} editorial`}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1200ms] ease-luxurious ${
            hovered ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
          }`}
        />

        {product.is_new && (
          <span className="absolute left-4 top-4 z-10 bg-ivory/90 px-3 py-1 font-mono text-[9px] uppercase tracking-widest2 text-ink backdrop-blur-sm">
            NEW
          </span>
        )}

        <div
          className={`absolute bottom-0 left-0 right-0 z-10 overflow-hidden bg-gradient-to-t from-ink/80 to-transparent p-5 transition-all duration-700 ease-luxurious ${
            hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
        >
          <p className="font-sans text-xs font-light leading-relaxed text-ivory/90">
            {product.material}
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-wider2 text-ivory/60">
            View piece →
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-start justify-between">
        <div>
          <h3 className="font-display text-xl font-light tracking-tight text-ink md:text-2xl">
            {product.name}
          </h3>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider2 text-stone">
            {product.category}
          </p>
        </div>
        <p className="font-mono text-sm tabular-nums text-ink">
          {formatPrice(product.price)}
        </p>
      </div>
    </article>
  );
}
