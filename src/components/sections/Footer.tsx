interface FooterProps {
  onNavigate: (route: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-ivory">
      {/* Top — giant wordmark */}
      <div className="border-b border-ivory/10 px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1600px]">
          <p className="font-mono text-[11px] uppercase tracking-widest2 text-ivory/40">
            ATELIER — INDEPENDENT FASHION HOUSE
          </p>
          <h2 className="mt-6 font-display text-[22vw] font-light leading-none tracking-tightest md:text-[16rem]">
            Atelier
          </h2>
        </div>
      </div>

      {/* Columns */}
      <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-16">
          <FooterCol
            title="Shop"
            links={[
              ['Collection', 'collection'],
              ['Lookbook', 'lookbook'],
              ['Outerwear', 'collection'],
              ['Knitwear', 'collection'],
            ]}
            onNavigate={onNavigate}
          />
          <FooterCol
            title="House"
            links={[
              ['The Atelier', 'atelier'],
              ['Craft', 'home'],
              ['Journal', 'journal'],
              ['Story', 'home'],
            ]}
            onNavigate={onNavigate}
          />
          <FooterCol
            title="Service"
            links={[
              ['Shipping', 'home'],
              ['Returns', 'home'],
              ['Care', 'home'],
              ['Repairs', 'home'],
            ]}
            onNavigate={onNavigate}
          />
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-wider2 text-ivory/40">
              Newsletter
            </h4>
            <p className="mt-4 font-sans text-sm font-light leading-relaxed text-ivory/60">
              Quiet updates. Two collections a year. Nothing more.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-5 flex border-b border-ivory/20 pb-2"
            >
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 bg-transparent font-sans text-sm font-light text-ivory placeholder:text-ivory/30 focus:outline-none"
              />
              <button className="font-mono text-[10px] uppercase tracking-wider2 text-ivory/70 transition-colors hover:text-ivory">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-4 border-t border-ivory/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-wider2 text-ivory/40">
            © {year} Atelier — Paris / Porto / Florence
          </p>
          <div className="flex gap-6">
            {['Instagram', 'Terms', 'Privacy'].map((l) => (
              <button
                key={l}
                className="font-mono text-[10px] uppercase tracking-wider2 text-ivory/40 transition-colors hover:text-ivory"
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
  onNavigate,
}: {
  title: string;
  links: [string, string][];
  onNavigate: (route: string) => void;
}) {
  return (
    <div>
      <h4 className="font-mono text-[10px] uppercase tracking-wider2 text-ivory/40">
        {title}
      </h4>
      <ul className="mt-4 space-y-3">
        {links.map(([label, route]) => (
          <li key={label}>
            <button
              onClick={() => onNavigate(route)}
              className="font-sans text-sm font-light text-ivory/70 transition-colors duration-500 hover:text-ivory"
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
