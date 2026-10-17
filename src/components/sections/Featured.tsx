import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/data/products';
import { useReveal } from '@/hooks/useReveal';

interface FeaturedProps {
  onView: (id: string) => void;
}

export function Featured({ onView }: FeaturedProps) {
  const ref = useReveal<HTMLDivElement>();
  const { products, loading } = useStore();
  const product = products[0];
  const [activeImg, setActiveImg] = useState(0);

  if (loading || !product) {
    return (
      <section ref={ref} className="bg-charcoal py-24 text-ivory md:py-36">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <div className="animate-pulse">
            <div className="aspect-[4/5] max-w-2xl bg-ink/40" />
          </div>
        </div>
      </section>
    );
  }

  const images = [
    product.images.full,
    product.images.detail,
    product.images.material,
  ];

  return (
    <section ref={ref} className="bg-charcoal py-24 text-ivory md:py-36">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-6 md:px-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden bg-ink/40">
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${product.name} ${i}`}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1400ms] ease-luxurious ${
                  activeImg === i ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`h-20 w-16 overflow-hidden transition-all duration-500 ${
                  activeImg === i
                    ? 'opacity-100 outline outline-1 outline-ivory/60'
                    : 'opacity-40 hover:opacity-70'
                }`}
              >
                <img
                  src={src}
                  alt={`thumb ${i}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center lg:pl-8">
          <p className="reveal-line font-mono text-[11px] uppercase tracking-widest2 text-ivory/50">
            <span>FEATURED PIECE</span>
          </p>
          <h2 className="reveal-line mt-6 font-display text-5xl font-light leading-none tracking-tightest md:text-7xl">
            <span>{product.name.split(' ').slice(0, -1).join(' ')}</span>
          </h2>
          <h2 className="reveal-line font-display text-5xl font-light italic leading-none tracking-tightest md:text-7xl">
            <span>{product.name.split(' ').slice(-1)}</span>
          </h2>

          <p className="mt-8 font-mono text-sm tabular-nums text-ivory">
            {formatPrice(product.price)}
          </p>

          <p className="reveal-line mt-8 max-w-md font-sans text-base font-light leading-relaxed text-ivory/75">
            <span>{product.description}</span>
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-ivory/15 pt-8">
            <Spec label="Material" value={product.material} />
            <Spec label="Origin" value={product.origin} />
            <Spec label="Fit" value={product.fit} />
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider2 text-ivory/40">
                Sizes
              </dt>
              <dd className="mt-2 font-sans text-sm font-light text-ivory/80">
                {product.sizes.join(' / ')}
              </dd>
            </div>
          </dl>

          <button
            onClick={() => onView(product.id)}
            data-cursor="view"
            data-cursor-label="VIEW"
            className="group mt-10 flex w-fit items-center gap-3 bg-ivory px-8 py-4 text-ink transition-colors duration-500 hover:bg-transparent hover:text-ivory hover:outline hover:outline-1 hover:outline-ivory/60"
          >
            <span className="font-mono text-[11px] uppercase tracking-wider2">
              View piece
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-wider2 text-ivory/40">
        {label}
      </dt>
      <dd className="mt-2 font-sans text-sm font-light leading-relaxed text-ivory/80">
        {value}
      </dd>
    </div>
  );
}
