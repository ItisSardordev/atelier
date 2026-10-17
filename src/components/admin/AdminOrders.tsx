import { useEffect, useState } from 'react';
import { ChevronDown, X, Loader2 } from 'lucide-react';
import {
  adminFetchOrders,
  adminFetchOrderItems,
  adminUpdateOrderStatus,
} from '@/lib/data';
import { formatPrice } from '@/data/products';
import { StatusBadge } from '@/components/admin/AdminOverview';
import type { OrderRow, OrderItemRow } from '@/lib/types';

const orderStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
const paymentStatuses = ['pending', 'paid', 'failed', 'refunded'];

export function AdminOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<OrderRow | null>(null);
  const [items, setItems] = useState<OrderItemRow[]>([]);
  const [filter, setFilter] = useState<string>('all');

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminFetchOrders();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openOrder = async (order: OrderRow) => {
    setSelected(order);
    const orderItems = await adminFetchOrderItems(order.id);
    setItems(orderItems);
  };

  const handleStatusChange = async (
    order: OrderRow,
    status: string,
    paymentStatus?: string
  ) => {
    await adminUpdateOrderStatus(order.id, status, paymentStatus);
    await load();
    if (selected?.id === order.id) {
      setSelected({ ...order, status: status as OrderRow['status'], payment_status: (paymentStatus ?? order.payment_status) as OrderRow['payment_status'] });
    }
  };

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-stone" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1 border-b border-ink/10">
        {['all', ...orderStatuses].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 font-mono text-[10px] uppercase tracking-wider2 transition-colors ${
              filter === f
                ? 'border-b-2 border-ink text-ink'
                : 'text-stone hover:text-ink'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center font-sans text-sm text-stone">
          No orders{filter !== 'all' ? ` with status "${filter}"` : ''} yet.
        </p>
      ) : (
        <div className="overflow-x-auto border border-ink/10">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink/10 bg-beige/30">
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider2 text-stone">Order</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider2 text-stone">Customer</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider2 text-stone">Date</th>
                <th className="px-4 py-3 text-center font-mono text-[10px] uppercase tracking-wider2 text-stone">Status</th>
                <th className="px-4 py-3 text-center font-mono text-[10px] uppercase tracking-wider2 text-stone">Payment</th>
                <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-wider2 text-stone">Total</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-beige/20">
                  <td className="px-4 py-3 font-mono text-sm text-ink">{order.order_number}</td>
                  <td className="px-4 py-3">
                    <p className="font-sans text-sm text-ink">{order.customer_name}</p>
                    <p className="font-mono text-[10px] text-stone">{order.customer_email}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-stone">
                    {new Date(order.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-mono text-[9px] uppercase tracking-wider2 ${
                      order.payment_status === 'paid' ? 'text-seasonal-dark' : 'text-stone'
                    }`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm tabular-nums text-ink">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openOrder(order)}
                      className="font-mono text-[10px] uppercase tracking-wider2 text-ink underline underline-offset-4"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-sm">
          <div className="h-full w-full max-w-lg overflow-y-auto bg-ivory p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-light text-ink">
                  {selected.order_number}
                </h2>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider2 text-stone">
                  {new Date(selected.created_at).toLocaleString('en-GB')}
                </p>
              </div>
              <button onClick={() => setSelected(null)}>
                <X size={20} className="text-stone" />
              </button>
            </div>

            {/* Customer info */}
            <div className="mb-6 border border-ink/10 p-5">
              <h3 className="font-mono text-[10px] uppercase tracking-wider2 text-stone">Customer</h3>
              <p className="mt-2 font-sans text-sm text-ink">{selected.customer_name}</p>
              <p className="font-mono text-[11px] text-stone">{selected.customer_email}</p>
              {Object.keys(selected.shipping_address).length > 0 && (
                <div className="mt-3 border-t border-ink/10 pt-3">
                  <p className="font-mono text-[10px] uppercase tracking-wider2 text-stone">Shipping address</p>
                  {Object.values(selected.shipping_address).map((v, i) => (
                    <p key={i} className="font-sans text-xs text-ink">{v}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Items */}
            <div className="mb-6">
              <h3 className="mb-3 font-mono text-[10px] uppercase tracking-wider2 text-stone">Items</h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-ink/5 pb-3">
                    <div>
                      <p className="font-sans text-sm text-ink">{item.product_name}</p>
                      <p className="font-mono text-[10px] text-stone">
                        {item.size} / {item.color} — qty {item.quantity}
                      </p>
                    </div>
                    <p className="font-mono text-sm tabular-nums text-ink">{formatPrice(item.line_total)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="mb-6 space-y-2 border-t border-ink/10 pt-4">
              <div className="flex justify-between font-mono text-[11px] text-stone">
                <span>Subtotal</span>
                <span>{formatPrice(selected.subtotal)}</span>
              </div>
              <div className="flex justify-between font-mono text-[11px] text-stone">
                <span>Shipping</span>
                <span>{formatPrice(selected.shipping_cost)}</span>
              </div>
              <div className="flex justify-between border-t border-ink/10 pt-2 font-display text-lg text-ink">
                <span>Total</span>
                <span>{formatPrice(selected.total)}</span>
              </div>
            </div>

            {/* Status controls */}
            <div className="space-y-4 border-t border-ink/10 pt-6">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider2 text-stone">Order status</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {orderStatuses.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selected, s)}
                      className={`px-3 py-2 font-mono text-[10px] uppercase tracking-wider2 transition-colors ${
                        selected.status === s
                          ? 'bg-ink text-ivory'
                          : 'border border-ink/15 text-stone hover:border-ink hover:text-ink'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider2 text-stone">Payment status</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {paymentStatuses.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selected, selected.status, s)}
                      className={`px-3 py-2 font-mono text-[10px] uppercase tracking-wider2 transition-colors ${
                        selected.payment_status === s
                          ? 'bg-seasonal-dark text-ivory'
                          : 'border border-ink/15 text-stone hover:border-seasonal hover:text-seasonal-dark'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
