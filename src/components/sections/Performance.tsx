import { useEffect, useRef, useState } from 'react';
import { useReveal } from '@/hooks/useReveal';

export function Performance() {
  const ref = useReveal<HTMLDivElement>();
  const [val, setVal] = useState(0);
  const target = 38;
  const started = useRef(false);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const start = performance.now();
          const animate = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setVal(Math.round(eased * target));
            if (t < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(root);
    return () => obs.disconnect();
  }, [ref]);

  return (
    <section ref={ref} className="bg-charcoal py-24 text-ivory md:py-36">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-16">
          {/* Big number */}
          <div className="md:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-widest2 text-ivory/40">
              CASE STUDY — RESULT
            </p>
            <p className="mt-4 font-display text-[18vw] font-light leading-none tracking-tightest md:text-[12rem]">
              {val}
              <span className="text-seasonal-light">%</span>
            </p>
          </div>

          {/* Text */}
          <div className="md:col-span-6 md:col-start-7">
            <h2 className="reveal-line font-display text-3xl font-light leading-tight tracking-tight text-ivory md:text-5xl">
              <span>
                Conversion increase in the first quarter after launching the
                editorial storefront.
              </span>
            </h2>
            <p className="reveal-line mt-8 max-w-md font-sans text-base font-light leading-relaxed text-ivory/60">
              <span>
                A storefront designed around editorial discovery and a faster
                path from inspiration to checkout. Measured across the first 90
                days of the Collection 06 release.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
