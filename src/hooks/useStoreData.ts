import { useState, useEffect } from 'react';
import type { ProductRow, OfferRow } from '@/lib/types';
import { fetchActiveProducts, fetchActiveOffers } from '@/lib/data';

interface StoreData {
  products: ProductRow[];
  offers: OfferRow[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useStoreData(): StoreData {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [offers, setOffers] = useState<OfferRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadFlag, setReloadFlag] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [prods, offs] = await Promise.all([
          fetchActiveProducts(),
          fetchActiveOffers(),
        ]);
        if (cancelled) return;
        setProducts(prods);
        setOffers(offs);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load store data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [reloadFlag]);

  const reload = () => setReloadFlag((f) => f + 1);

  return { products, offers, loading, error, reload };
}
