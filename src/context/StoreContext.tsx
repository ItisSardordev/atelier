import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { ProductRow, OfferRow } from '@/lib/types';
import { fetchActiveProducts, fetchActiveOffers } from '@/lib/data';

interface StoreContextValue {
  products: ProductRow[];
  offers: OfferRow[];
  loading: boolean;
  error: string | null;
  reload: () => void;
  getProduct: (id: string) => ProductRow | undefined;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
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
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [reloadFlag]);

  const reload = useCallback(() => setReloadFlag((f) => f + 1), []);

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  const value: StoreContextValue = {
    products,
    offers,
    loading,
    error,
    reload,
    getProduct,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
