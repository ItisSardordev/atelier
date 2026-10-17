import { useState, useEffect, useCallback } from 'react';
import { CartProvider } from '@/context/CartContext';
import { StoreProvider } from '@/context/StoreContext';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import { CustomCursor } from '@/components/CustomCursor';
import { Navigation } from '@/components/Navigation';
import { ShoppingBag } from '@/components/ShoppingBag';
import { Hero } from '@/components/sections/Hero';
import { Collection } from '@/components/sections/Collection';
import { Featured } from '@/components/sections/Featured';
import { Craft } from '@/components/sections/Craft';
import { Atelier } from '@/components/sections/Atelier';
import { Lookbook } from '@/components/sections/Lookbook';
import { BrandStory } from '@/components/sections/BrandStory';
import { Performance } from '@/components/sections/Performance';
import { Footer } from '@/components/sections/Footer';
import { OffersBanner } from '@/components/sections/OffersBanner';
import { ProductPage } from '@/components/ProductPage';
import { Checkout } from '@/components/Checkout';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminLayout, type AdminPage } from '@/components/admin/AdminLayout';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { AdminProducts } from '@/components/admin/AdminProducts';
import { AdminOrders } from '@/components/admin/AdminOrders';
import { AdminOffers } from '@/components/admin/AdminOffers';
import { AdminPayment } from '@/components/admin/AdminPayment';

type Route =
  | { name: 'home' }
  | { name: 'collection' }
  | { name: 'lookbook' }
  | { name: 'atelier' }
  | { name: 'journal' }
  | { name: 'product'; id: string }
  | { name: 'checkout' }
  | { name: 'admin' };

function App() {
  const [route, setRoute] = useState<Route>({ name: 'home' });
  const [transitioning, setTransitioning] = useState(false);
  const [adminPage, setAdminPage] = useState<AdminPage>('overview');

  // Secret admin access via URL hash — no visible link in the storefront.
  useEffect(() => {
    const checkAdminHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || hash === '#/admin') {
        setRoute({ name: 'admin' });
      }
    };
    checkAdminHash();
    window.addEventListener('hashchange', checkAdminHash);
    return () => window.removeEventListener('hashchange', checkAdminHash);
  }, []);

  const navigate = useCallback((raw: string) => {
    if (raw.startsWith('product:')) {
      const id = raw.split(':')[1];
      setRoute({ name: 'product', id });
      return;
    }
    const valid: string[] = ['home', 'collection', 'lookbook', 'atelier', 'journal'];
    if (valid.includes(raw)) {
      setRoute({ name: raw } as Route);
    }
  }, []);

  useEffect(() => {
    setTransitioning(true);
    window.scrollTo({ top: 0, behavior: 'auto' });
    const t = setTimeout(() => setTransitioning(false), 50);
    return () => clearTimeout(t);
  }, [route]);

  const currentSimple =
    route.name === 'product'
      ? 'collection'
      : route.name === 'checkout'
        ? 'home'
        : route.name === 'admin'
          ? 'home'
          : route.name;

  const goProduct = (id: string) => setRoute({ name: 'product', id });
  const goCheckout = () => setRoute({ name: 'checkout' });

  const exitAdmin = useCallback(() => {
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setRoute({ name: 'home' });
  }, []);

  // ===== Admin route =====
  if (route.name === 'admin') {
    return (
      <AdminAuthProvider>
        <AdminRoute
          adminPage={adminPage}
          onNavigateAdmin={setAdminPage}
          onExit={exitAdmin}
        />
      </AdminAuthProvider>
    );
  }

  // ===== Storefront =====
  return (
    <StoreProvider>
      <CartProvider>
        <CustomCursor />
        <Navigation onNavigate={navigate} current={currentSimple} />
        <OffersBanner />
        <ShoppingBag onCheckout={goCheckout} />

        <main
          className={`transition-opacity duration-700 ease-luxurious ${
            transitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {route.name === 'home' && (
            <>
              <Hero
                onExplore={() => navigate('collection')}
                onAtelier={() => navigate('atelier')}
              />
              <Collection onProduct={goProduct} />
              <Featured onView={goProduct} />
              <Craft />
              <Atelier />
              <Lookbook />
              <BrandStory />
              <Performance />
            </>
          )}

          {route.name === 'collection' && (
            <div className="min-h-screen bg-ivory pt-24">
              <Collection onProduct={goProduct} />
              <Featured onView={goProduct} />
            </div>
          )}

          {route.name === 'lookbook' && (
            <div className="min-h-screen bg-ink pt-0">
              <Lookbook />
            </div>
          )}

          {route.name === 'atelier' && (
            <div className="min-h-screen bg-ink pt-24">
              <Atelier />
              <Craft />
              <BrandStory />
            </div>
          )}

          {route.name === 'journal' && (
            <div className="min-h-screen bg-ivory pt-32">
              <div className="mx-auto max-w-3xl px-6 py-20 text-center md:px-10">
                <p className="font-mono text-[11px] uppercase tracking-widest2 text-stone">
                  JOURNAL
                </p>
                <h1 className="mt-6 font-display text-6xl font-light italic leading-none tracking-tightest text-ink md:text-8xl">
                  Coming soon.
                </h1>
                <p className="mx-auto mt-8 max-w-md font-sans text-base font-light leading-relaxed text-stone">
                  We write occasionally — about material, about making, about the
                  slow seasons of an independent house. The first essays arrive
                  with Collection 07.
                </p>
              </div>
              <BrandStory />
            </div>
          )}

          {route.name === 'product' && (
            <ProductPage
              productId={route.id}
              onBack={() => navigate('collection')}
              onCheckout={goCheckout}
            />
          )}

          {route.name === 'checkout' && (
            <Checkout
              onComplete={() => navigate('home')}
              onBack={() => navigate('collection')}
            />
          )}
        </main>

        <Footer onNavigate={navigate} />
      </CartProvider>
    </StoreProvider>
  );
}

// ===== Admin route wrapper (handles auth gate) =====

function AdminRoute({
  adminPage,
  onNavigateAdmin,
  onExit,
}: {
  adminPage: AdminPage;
  onNavigateAdmin: (page: AdminPage) => void;
  onExit: () => void;
}) {
  const { session, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <p className="font-mono text-[10px] uppercase tracking-wider2 text-ivory/40">
          Loading…
        </p>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin onSuccess={() => {}} onBack={onExit} />;
  }

  return (
    <AdminLayout currentPage={adminPage} onNavigate={onNavigateAdmin} onExit={onExit}>
      {adminPage === 'overview' && <AdminOverview />}
      {adminPage === 'products' && <AdminProducts />}
      {adminPage === 'orders' && <AdminOrders />}
      {adminPage === 'offers' && <AdminOffers />}
      {adminPage === 'payment' && <AdminPayment />}
    </AdminLayout>
  );
}

export default App;
