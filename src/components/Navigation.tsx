import { useEffect, useState } from 'react';
import { Search, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface NavProps {
  onNavigate: (route: string) => void;
  current: string;
}

const links = [
  { label: 'Collection', route: 'collection' },
  { label: 'Lookbook', route: 'lookbook' },
  { label: 'Atelier', route: 'atelier' },
  { label: 'Journal', route: 'journal' },
];

export function Navigation({ onNavigate, current }: NavProps) {
  const { count, open } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (route: string) => {
    setMenuOpen(false);
    onNavigate(route);
  };

  // Pages with a dark background throughout — nav must stay light
  const solidDark = current === 'lookbook' || current === 'atelier';
  // 'dark' = ivory background + dark text (for light pages and scrolled state)
  const dark = solidDark ? false : scrolled || current !== 'home';

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-luxurious ${
          dark
            ? 'bg-ivory/85 backdrop-blur-md py-4 text-ink'
            : 'bg-transparent py-6 text-ivory'
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-10">
          {/* Left — wordmark */}
          <button
            onClick={() => go('home')}
            className="font-display text-2xl font-medium tracking-tightest md:text-3xl"
          >
            ATELIER
          </button>

          {/* Center — links (desktop) */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 lg:flex">
            {links.map((l) => (
              <button
                key={l.route}
                onClick={() => go(l.route)}
                className={`group relative font-mono text-[11px] uppercase tracking-wider2 transition-colors duration-500 ${
                  current === l.route
                    ? dark
                      ? 'text-ink'
                      : 'text-ivory'
                    : dark
                      ? 'text-stone hover:text-ink'
                      : 'text-ivory/60 hover:text-ivory'
                }`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-current transition-all duration-700 ease-luxurious ${
                    current === l.route ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>
            ))}
          </nav>

          {/* Right — utilities */}
          <div className="flex items-center gap-5 md:gap-7">
            <button
              aria-label="Search"
              className={`transition-colors duration-500 ${
                dark ? 'text-ink hover:text-stone' : 'text-ivory hover:text-ivory/60'
              }`}
            >
              <Search size={17} strokeWidth={1.25} />
            </button>
            <button
              onClick={open}
              aria-label="Shopping bag"
              className={`group relative flex items-center gap-2 transition-colors duration-500 ${
                dark ? 'text-ink hover:text-stone' : 'text-ivory hover:text-ivory/60'
              }`}
            >
              <ShoppingBag size={17} strokeWidth={1.25} />
              <span className="font-mono text-[11px] tabular-nums">
                {String(count).padStart(2, '0')}
              </span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              className={`flex flex-col gap-1.5 lg:hidden ${
                dark ? 'text-ink' : 'text-ivory'
              }`}
            >
              <span
                className={`h-px w-6 bg-current transition-all duration-500 ${
                  menuOpen ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-px w-6 bg-current transition-all duration-300 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`h-px w-6 bg-current transition-all duration-500 ${
                  menuOpen ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 bg-ink text-ivory transition-all duration-700 ease-luxurious lg:hidden ${
          menuOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex h-full flex-col justify-center px-8">
          {links.map((l, i) => (
            <button
              key={l.route}
              onClick={() => go(l.route)}
              className="group flex items-baseline justify-between border-b border-ivory/15 py-6 text-left"
            >
              <span className="font-display text-5xl font-light transition-transform duration-700 ease-luxurious group-hover:translate-x-3">
                {l.label}
              </span>
              <span className="font-mono text-xs text-ivory/40">
                0{i + 1}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
