import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  CreditCard,
  LogOut,
  Menu,
  X,
  Store,
} from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

export type AdminPage =
  | 'overview'
  | 'products'
  | 'orders'
  | 'offers'
  | 'payment';

interface AdminLayoutProps {
  children: ReactNode;
  currentPage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  onExit: () => void;
}

const navItems: { page: AdminPage; label: string; icon: typeof LayoutDashboard }[] = [
  { page: 'overview', label: 'Overview', icon: LayoutDashboard },
  { page: 'products', label: 'Products', icon: Package },
  { page: 'orders', label: 'Orders', icon: ShoppingBag },
  { page: 'offers', label: 'Offers', icon: Tag },
  { page: 'payment', label: 'Payment API', icon: CreditCard },
];

export function AdminLayout({
  children,
  currentPage,
  onNavigate,
  onExit,
}: AdminLayoutProps) {
  const { user, signOut } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    onExit();
  };

  return (
    <div className="flex min-h-screen bg-ivory">
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-ink/10 bg-ink text-ivory lg:flex">
        <div className="flex h-16 items-center border-b border-ivory/10 px-6">
          <span className="font-display text-xl font-light tracking-tightest">
            ATELIER
          </span>
          <span className="ml-2 font-mono text-[8px] uppercase tracking-widest2 text-ivory/40">
            Admin
          </span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`flex w-full items-center gap-3 px-4 py-3 font-mono text-[11px] uppercase tracking-wider2 transition-colors ${
                  active
                    ? 'bg-ivory text-ink'
                    : 'text-ivory/60 hover:bg-ivory/10 hover:text-ivory'
                }`}
              >
                <Icon size={16} strokeWidth={1.25} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-ivory/10 p-4">
          <button
            onClick={() => onExit()}
            className="flex w-full items-center gap-3 px-4 py-3 font-mono text-[11px] uppercase tracking-wider2 text-ivory/60 transition-colors hover:bg-ivory/10 hover:text-ivory"
          >
            <Store size={16} strokeWidth={1.25} />
            View Store
          </button>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 px-4 py-3 font-mono text-[11px] uppercase tracking-wider2 text-ivory/60 transition-colors hover:bg-ivory/10 hover:text-ivory"
          >
            <LogOut size={16} strokeWidth={1.25} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-ink/50 lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-ink text-ivory transition-transform lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-ivory/10 px-6">
          <span className="font-display text-xl font-light tracking-tightest">ATELIER</span>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={20} className="text-ivory/60" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-4 py-3 font-mono text-[11px] uppercase tracking-wider2 ${
                  currentPage === item.page ? 'bg-ivory text-ink' : 'text-ivory/60'
                }`}
              >
                <Icon size={16} strokeWidth={1.25} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-ivory/10 p-4">
          <button onClick={handleSignOut} className="flex w-full items-center gap-3 px-4 py-3 font-mono text-[11px] uppercase tracking-wider2 text-ivory/60">
            <LogOut size={16} strokeWidth={1.25} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink/10 bg-ivory/90 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu size={20} className="text-ink" />
            </button>
            <h1 className="font-display text-xl font-light tracking-tight text-ink">
              {navItems.find((n) => n.page === currentPage)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-[10px] uppercase tracking-wider2 text-stone sm:block">
              {user?.email}
            </span>
            <div className="h-8 w-8 rounded-full bg-ink text-ivory flex items-center justify-center font-mono text-[10px]">
              {(user?.email ?? 'A')[0].toUpperCase()}
            </div>
          </div>
        </header>

        <main className="p-6 md:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
