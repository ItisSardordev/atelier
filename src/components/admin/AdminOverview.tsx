import { useEffect, useState } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Tag,
  Euro,
  Clock,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/data/products';
import type { OrderRow, ProductRow, OfferRow } from '@/lib/types';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  activeOffers: number;
  pendingOrders: number;
  recentOrders: OrderRow[];
}

export function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [ordersRes, productsRes, offersRes] = await Promise.all([
          supabase.from('orders').select('*').order('created_at', { ascending: false }),
          supabase.from('products').select('*'),
          supabase.from('offers').select('*').eq('is_active', true),
        ]);

        const orders = (ordersRes.data ?? []) as OrderRow[];
        const products = (productsRes.data ?? []) as ProductRow[];
        const offers = (offersRes.data ?? []) as OfferRow[];

        const totalRevenue = orders
          .filter((o) => o.payment_status === 'paid')
          .reduce((sum, o) => sum + o.total, 0);
        const pendingOrders = orders.filter(
          (o) => o.status === 'pending' || o.status === 'paid'
        ).length;

        setStats({
          totalRevenue,
          totalOrders: orders.length,
          totalProducts: products.length,
          activeOffers: offers.length,
          pendingOrders,
          recentOrders: orders.slice(0, 5),
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="font-mono text-[11px] uppercase tracking-wider2 text-stone">
          Loading dashboard…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          icon={Euro}
          accent="bg-charcoal text-ivory"
        />
        <StatCard
          label="Total Orders"
          value={String(stats.totalOrders)}
          icon={ShoppingBag}
          accent="bg-beige text-ink"
        />
        <StatCard
          label="Pending Fulfilment"
          value={String(stats.pendingOrders)}
          icon={Clock}
          accent="bg-sand text-ink"
        />
        <StatCard
          label="Products"
          value={String(stats.totalProducts)}
          icon={Package}
          accent="bg-ivory text-ink border border-ink/10"
        />
        <StatCard
          label="Active Offers"
          value={String(stats.activeOffers)}
          icon={Tag}
          accent="bg-seasonal/10 text-seasonal-dark border border-seasonal/20"
        />
        <StatCard
          label="Avg. Order Value"
          value={formatPrice(stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders) : 0)}
          icon={TrendingUp}
          accent="bg-ink text-ivory"
        />
      </div>

      {/* Recent orders */}
      <div className="border border-ink/10 bg-white/50">
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <h2 className="font-display text-lg font-light text-ink">Recent Orders</h2>
          <span className="font-mono text-[10px] uppercase tracking-wider2 text-stone">
            Last {stats.recentOrders.length}
          </span>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="px-6 py-12 text-center font-sans text-sm text-stone">
            No orders yet. When customers check out, they'll appear here.
          </p>
        ) : (
          <div className="divide-y divide-ink/5">
            {stats.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-mono text-sm text-ink">
                      {order.order_number}
                    </p>
                    <p className="mt-0.5 font-sans text-xs text-stone">
                      {order.customer_email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={order.status} />
                  <p className="font-mono text-sm tabular-nums text-ink">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: typeof Euro;
  accent: string;
}) {
  return (
    <div className={`flex items-center justify-between p-6 ${accent}`}>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wider2 opacity-60">
          {label}
        </p>
        <p className="mt-2 font-display text-3xl font-light">{value}</p>
      </div>
      <Icon size={28} strokeWidth={1} className="opacity-40" />
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-sand/40 text-stone',
    paid: 'bg-seasonal/15 text-seasonal-dark',
    shipped: 'bg-beige text-ink',
    delivered: 'bg-charcoal text-ivory',
    cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span
      className={`px-3 py-1 font-mono text-[9px] uppercase tracking-wider2 ${
        colors[status] ?? colors.pending
      }`}
    >
      {status}
    </span>
  );
}
