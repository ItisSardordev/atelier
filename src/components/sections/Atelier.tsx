import { useReveal } from '@/hooks/useReveal';

export function Atelier() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section ref={ref} id="atelier" className="bg-ink py-24 text-ivory md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        {/* Full-bleed image */}
        <div className="relative aspect-[16/10] overflow-hidden md:aspect-[16/7]">
          <img
            src="https://images.pexels.com/photos/36731337/pexels-photo-36731337.jpeg?auto=compress&cs=tinysrgb&w=2000"
            alt="The Atelier studio"
            className="blur-reveal h-full w-full object-cover"
          />
        </div>

        {/* Editorial magazine layout */}
        <div className="mt-16 grid grid-cols-1 gap-10 md:mt-24 md:grid-cols-12 md:gap-12">
          {/* Left column — big title */}
          <div className="md:col-span-5">
            <p className="reveal-line font-mono text-[11px] uppercase tracking-widest2 text-ivory/50">
              <span>THE STUDIO</span>
            </p>
            <h2 className="reveal-line mt-6 font-display text-6xl font-light leading-none tracking-tightest md:text-8xl">
              <span>The</span>
            </h2>
            <h2 className="reveal-line font-display text-6xl font-light italic leading-none tracking-tightest md:text-8xl">
              <span>Atelier</span>
            </h2>
          </div>

          {/* Right — story */}
          <div className="md:col-span-6 md:col-start-7">
            <p className="reveal-line font-sans text-lg font-light leading-relaxed text-ivory/80 md:text-xl">
              <span>
                A small independent fashion house built around material,
                craftsmanship, and deliberate production. We make slowly, in
                limited runs, with a team of seven — two designers, four
                artisans, and a pattern maker who has been with us since the
                first collection.
              </span>
            </p>

            {/* Details grid */}
            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-ivory/15 pt-8 md:grid-cols-3">
              <Detail
                label="Location"
                lines={['Rue de Turenne', 'Paris, 3e']}
              />
              <Detail
                label="Founded"
                lines={['2017', 'Independent']}
              />
              <Detail
                label="Production"
                lines={['Limited runs', '30–60 pieces']}
              />
              <Detail
                label="Team"
                lines={['2 designers', '4 artisans']}
              />
              <Detail
                label="Designers"
                lines={['Léa Marchand', 'Tomás Ribeiro']}
              />
              <Detail
                label="Process"
                lines={['Hand-cut', 'Hand-finished']}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Detail({ label, lines }: { label: string; lines: string[] }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-wider2 text-ivory/40">
        {label}
      </p>
      {lines.map((l) => (
        <p key={l} className="mt-2 font-display text-lg font-light text-ivory/90">
          {l}
        </p>
      ))}
    </div>
  );
}
