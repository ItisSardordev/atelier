import { useRef, useState, useEffect } from 'react';
import { useReveal } from '@/hooks/useReveal';

const slides = [
  {
    img: 'https://images.pexels.com/photos/1066171/pexels-photo-1066171.jpeg?auto=compress&cs=tinysrgb&w=1600',
    collection: 'COLLECTION 06',
    name: 'The Archive Coat',
    season: 'Autumn / Winter',
  },
  {
    img: 'https://images.pexels.com/photos/987577/pexels-photo-987577.jpeg?auto=compress&cs=tinysrgb&w=1600',
    collection: 'COLLECTION 06',
    name: 'Oversized Blazer',
    season: 'Autumn / Winter',
  },
  {
    img: 'https://images.pexels.com/photos/9142805/pexels-photo-9142805.jpeg?auto=compress&cs=tinysrgb&w=1600',
    collection: 'COLLECTION 06',
    name: 'Signature Knit',
    season: 'Autumn / Winter',
  },
  {
    img: 'https://images.pexels.com/photos/19222080/pexels-photo-19222080.jpeg?auto=compress&cs=tinysrgb&w=1600',
    collection: 'COLLECTION 06',
    name: 'The Atelier Story',
    season: 'Autumn / Winter',
  },
  {
    img: 'https://images.pexels.com/photos/17945059/pexels-photo-17945059.jpeg?auto=compress&cs=tinysrgb&w=1600',
    collection: 'COLLECTION 06',
    name: 'Linen Shirt',
    season: 'Autumn / Winter',
  },
  {
    img: 'https://images.pexels.com/photos/28263000/pexels-photo-28263000.jpeg?auto=compress&cs=tinysrgb&w=1600',
    collection: 'COLLECTION 06',
    name: 'Structured Tote',
    season: 'Autumn / Winter',
  },
  {
    img: 'https://images.pexels.com/photos/7697685/pexels-photo-7697685.jpeg?auto=compress&cs=tinysrgb&w=1600',
    collection: 'COLLECTION 06',
    name: 'Pleated Trouser',
    season: 'Autumn / Winter',
  },
  {
    img: 'https://images.pexels.com/photos/14408067/pexels-photo-14408067.jpeg?auto=compress&cs=tinysrgb&w=1600',
    collection: 'COLLECTION 06',
    name: 'Hand-Knit Cardigan',
    season: 'Autumn / Winter',
  },
];

export function Lookbook() {
  const ref = useReveal<HTMLDivElement>();
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(slides.length - 1, i));
    setCurrent(clamped);
    const el = trackRef.current;
    if (el) {
      el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setCurrent(idx);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Drag handlers
  const onDown = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el) return;
    dragging.current = true;
    startX.current = e.clientX;
    startScroll.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const el = trackRef.current;
    if (!el) return;
    const dx = e.clientX - startX.current;
    el.scrollLeft = startScroll.current - dx;
  };
  const onUp = () => {
    dragging.current = false;
  };

  return (
    <section ref={ref} id="lookbook" className="relative bg-ink text-ivory">
      {/* Header */}
      <div className="absolute inset-x-0 top-0 z-20 px-6 pt-28 md:px-10 md:pt-32">
        <div className="flex items-end justify-between">
          <div>
            <p className="reveal-line font-mono text-[11px] uppercase tracking-widest2 text-ivory/50">
              <span>LOOKBOOK</span>
            </p>
            <h2 className="reveal-line mt-3 font-display text-4xl font-light tracking-tightest md:text-6xl">
              <span>Collection 06</span>
            </h2>
          </div>
          <p className="hidden font-mono text-[11px] uppercase tracking-wider2 text-ivory/50 md:block">
            Drag / Swipe →
          </p>
        </div>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        data-cursor="drag"
        data-cursor-label="DRAG"
        className="no-scrollbar flex h-screen min-h-[680px] snap-x-mandatory overflow-x-auto touch-pan-x"
        style={{ cursor: 'grab' }}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className="relative h-screen min-h-[680px] w-full shrink-0 snap-start"
          >
            <img
              src={s.img}
              alt={s.name}
              className="h-full w-full object-cover object-center"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />

            {/* Slide content */}
            <div className="absolute bottom-12 left-6 z-10 md:bottom-16 md:left-10">
              <p className="font-mono text-[11px] uppercase tracking-widest2 text-ivory/60">
                {s.collection}
              </p>
              <h3 className="mt-2 font-display text-4xl font-light tracking-tightest md:text-6xl">
                {s.name}
              </h3>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-wider2 text-ivory/50">
                {s.season}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="absolute inset-x-0 bottom-8 z-20 flex items-center justify-center gap-6">
        <button
          onClick={() => goTo(current - 1)}
          aria-label="Previous look"
          className="text-ivory/60 transition-colors hover:text-ivory"
        >
          ←
        </button>
        <span className="font-mono text-[11px] tabular-nums tracking-wider2 text-ivory/80">
          {String(current + 1).padStart(2, '0')} /{' '}
          {String(slides.length).padStart(2, '0')}
        </span>
        <button
          onClick={() => goTo(current + 1)}
          aria-label="Next look"
          className="text-ivory/60 transition-colors hover:text-ivory"
        >
          →
        </button>
      </div>
    </section>
  );
}
