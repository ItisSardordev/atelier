import { useReveal } from '@/hooks/useReveal';

export function BrandStory() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section ref={ref} className="bg-ivory py-28 md:py-44">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <p className="reveal-line font-mono text-[11px] uppercase tracking-widest2 text-stone">
          <span>BRAND STORY</span>
        </p>
        <h2 className="reveal-line mt-8 max-w-5xl font-display text-5xl font-light leading-[1.05] tracking-tightest text-ink md:text-8xl">
          <span>Clothing should have</span>
        </h2>
        <h2 className="reveal-line font-display text-5xl font-light italic leading-[1.05] tracking-tightest text-ink md:text-8xl">
          <span>a memory.</span>
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <p className="reveal-line font-sans text-base font-light leading-relaxed text-stone">
              <span>
                We started Atelier with a simple objection: most clothing is
                made too fast, worn too briefly, and forgotten too easily. We
                wanted to make the opposite — garments that carry the memory of
                their making and grow into the life of the person who wears
                them.
              </span>
            </p>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <div className="space-y-8">
              <Paragraph
                title="Material"
                body="Every garment begins with the cloth. We work with three mills — wool from Biella, linen from Porto, leather from Florence — chosen for their restraint and their honesty. Nothing is over-finished. The hand should feel the fibre."
              />
              <Paragraph
                title="Slow production"
                body="We release two collections a year, in runs of thirty to sixty pieces. When a run is gone, it is gone. We do not restock, because restocking is not how craft works."
              />
              <Paragraph
                title="Longevity"
                body="A garment is finished when it is ready, not when a calendar says so. We repair what we sell, for as long as it is worn. The coat you buy this winter should still be here in ten winters."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Paragraph({ title, body }: { title: string; body: string }) {
  return (
    <div className="reveal-line border-t border-ink/10 pt-6">
      <h3 className="font-mono text-[11px] uppercase tracking-wider2 text-ink">
        {title}
      </h3>
      <p className="mt-3 font-sans text-base font-light leading-relaxed text-stone">
        {body}
      </p>
    </div>
  );
}
