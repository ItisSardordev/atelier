import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onAtelier: () => void;
}

export function Hero({ onExplore, onAtelier }: HeroProps) {
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-screen min-h-[680px] w-full overflow-hidden bg-ink"
    >
      {/* Image with slow reveal */}
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 overflow-hidden ${
            mounted ? '' : ''
          }`}
        >
          <img
            src="https://images.pexels.com/photos/33739060/pexels-photo-33739060.jpeg?auto=compress&cs=tinysrgb&w=2000"
            alt="Atelier Collection 06 editorial"
            className={`h-full w-full object-cover object-center transition-all duration-[2200ms] ease-luxurious ${
              mounted ? 'scale-100 opacity-100 blur-0' : 'scale-110 opacity-0 blur-2xl'
            }`}
          />
        </div>
        {/* gradient for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between px-6 pb-12 pt-32 md:px-10 md:pb-16 md:pt-36">
        {/* Top label */}
        <div
          className={`font-mono text-[11px] uppercase tracking-widest2 text-ivory/70 transition-all duration-1000 delay-500 ease-luxurious ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          ATELIER&nbsp;/&nbsp;COLLECTION 06
        </div>

        {/* Center / headline */}
        <div className="max-w-5xl">
          <h1 className="font-display text-[14vw] font-light leading-[0.92] tracking-tightest text-ivory md:text-[11vw] lg:text-[9rem]">
            <span className="block overflow-hidden">
              <span
                className={`block transition-all duration-[1200ms] delay-700 ease-luxurious ${
                  mounted ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                }`}
              >
                Made with
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                className={`block italic transition-all duration-[1200ms] delay-[900ms] ease-luxurious ${
                  mounted ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                }`}
              >
                intention.
              </span>
            </span>
          </h1>

          <p
            className={`mt-8 max-w-md font-sans text-sm font-light leading-relaxed text-ivory/75 transition-all duration-1000 delay-[1300ms] ease-luxurious ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            An independent fashion house exploring form, material, and everyday
            ritual.
          </p>
        </div>

        {/* CTAs */}
        <div
          className={`flex flex-col items-start gap-6 transition-all duration-1000 delay-[1500ms] ease-luxurious sm:flex-row sm:items-center ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <button
            onClick={onExplore}
            data-cursor="view"
            data-cursor-label="EXPLORE"
            className="group flex items-center gap-3 bg-ivory px-8 py-4 text-ink transition-colors duration-500 hover:bg-transparent hover:text-ivory hover:outline hover:outline-1 hover:outline-ivory/60"
          >
            <span className="font-mono text-[11px] uppercase tracking-wider2">
              Explore collection
            </span>
            <ArrowRight
              size={15}
              strokeWidth={1.5}
              className="transition-transform duration-500 group-hover:translate-x-1"
            />
          </button>
          <button
            onClick={onAtelier}
            className="font-mono text-[11px] uppercase tracking-wider2 text-ivory/70 transition-colors duration-500 hover:text-ivory"
          >
            Discover the atelier
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-1000 delay-[2000ms] md:flex ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="font-mono text-[9px] uppercase tracking-widest2 text-ivory/50">
          Scroll
        </span>
        <span className="h-12 w-px bg-ivory/30">
          <span className="block h-1/2 w-full origin-top animate-pulse bg-ivory" />
        </span>
      </div>
    </section>
  );
}
