import { useRef } from 'react';
import { useReveal } from '@/hooks/useReveal';

const steps = [
  {
    n: '01',
    label: 'CUT',
    img: 'https://images.pexels.com/photos/4621904/pexels-photo-4621904.jpeg?auto=compress&cs=tinysrgb&w=1400',
    caption:
      'Each panel is cut by hand from a single cloth to preserve the grain and align the pattern.',
  },
  {
    n: '02',
    label: 'CONSTRUCT',
    img: 'https://images.pexels.com/photos/7147652/pexels-photo-7147652.jpeg?auto=compress&cs=tinysrgb&w=1400',
    caption:
      'Panels are joined on century-old machines, then pressed open by hand — never fused.',
  },
  {
    n: '03',
    label: 'FINISH',
    img: 'https://images.pexels.com/photos/4614201/pexels-photo-4614201.jpeg?auto=compress&cs=tinysrgb&w=1400',
    caption:
      'Buttonholes are cut by hand. Edges are eased. The garment is pressed and rested before it leaves.',
  },
  {
    n: '04',
    label: 'MATERIAL',
    img: 'https://images.pexels.com/photos/36013149/pexels-photo-36013149.png?auto=compress&cs=tinysrgb&w=1400',
    caption:
      'Dense wool from a single mill in Biella — woven slowly, finished dry to the hand.',
  },
  {
    n: '05',
    label: 'STITCH',
    img: 'https://images.pexels.com/photos/531759/pexels-photo-531759.jpeg?auto=compress&cs=tinysrgb&w=1400',
    caption:
      'Hand-stitching where the garment moves most. Machine-stitching where it must hold.',
  },
  {
    n: '06',
    label: 'PACK',
    img: 'https://images.pexels.com/photos/4568724/pexels-photo-4568724.jpeg?auto=compress&cs=tinysrgb&w=1400',
    caption:
      'Folded in unbleached cotton, tied with linen cord. No plastic, no excess.',
  },
];

export function Craft() {
  const ref = useReveal<HTMLDivElement>();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.7), behavior: 'smooth' });
  };

  return (
    <section ref={ref} className="bg-ivory py-24 md:py-36">
      {/* Header */}
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="reveal-line font-mono text-[11px] uppercase tracking-widest2 text-stone">
              <span>CRAFT — THE PROCESS</span>
            </p>
            <h2 className="reveal-line mt-4 max-w-3xl font-display text-5xl font-light leading-[1.05] tracking-tightest text-ink md:text-7xl">
              <span>Made by hand.</span>
            </h2>
            <h2 className="reveal-line font-display text-5xl font-light italic leading-[1.05] tracking-tightest text-ink md:text-7xl">
              <span>Designed for years.</span>
            </h2>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Previous"
              className="flex h-12 w-12 items-center justify-center border border-ink/20 text-ink transition-colors duration-500 hover:bg-ink hover:text-ivory"
            >
              ←
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Next"
              className="flex h-12 w-12 items-center justify-center border border-ink/20 text-ink transition-colors duration-500 hover:bg-ink hover:text-ivory"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal scroll gallery */}
      <div
        ref={scrollRef}
        data-cursor="drag"
        data-cursor-label="DRAG"
        className="no-scrollbar mt-12 flex snap-x-mandatory gap-5 overflow-x-auto px-6 pb-4 md:mt-16 md:gap-8 md:px-10"
      >
        {steps.map((s) => (
          <figure
            key={s.n}
            className="snap-start shrink-0 w-[78vw] sm:w-[55vw] md:w-[40vw] lg:w-[30vw]"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-beige">
              <img
                src={s.img}
                alt={s.label}
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-luxurious hover:scale-105"
              />
              <span className="absolute left-5 top-5 font-mono text-[11px] uppercase tracking-widest2 text-ivory mix-blend-difference">
                {s.n} / {s.label}
              </span>
            </div>
            <figcaption className="mt-4 max-w-xs font-sans text-sm font-light leading-relaxed text-stone">
              {s.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
