import { useStore } from '@/context/StoreContext';

export function OffersBanner() {
  const { offers } = useStore();
  const active = offers.filter((o) => o.is_active);

  if (active.length === 0) return null;

  return (
    <div className="bg-charcoal py-3 text-center text-ivory">
      <div className="mx-auto flex max-w-[1600px] items-center justify-center gap-4 px-6">
        {active.slice(0, 1).map((offer) => (
          <p
            key={offer.id}
            className="font-mono text-[10px] uppercase tracking-wider2 text-ivory/90 md:text-[11px]"
          >
            <span className="text-seasonal-light">—</span>{' '}
            {offer.title}
            {offer.code && (
              <span className="ml-2 border border-ivory/30 px-2 py-0.5 text-ivory/70">
                {offer.code}
              </span>
            )}
          </p>
        ))}
      </div>
    </div>
  );
}
