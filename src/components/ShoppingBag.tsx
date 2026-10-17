import { X, Plus, Minus } from 'lucide-react';
import { useCart, cartKey, type CartItem } from '@/context/CartContext';
import { formatPrice } from '@/data/products';

interface BagProps {
  onCheckout: () => void;
}

export function ShoppingBag({ onCheckout }: BagProps) {
  const { items, isOpen, close, remove, updateQuantity, subtotal, count } =
    useCart();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        className={`fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm transition-opacity duration-700 ease-luxurious ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col bg-ivory text-ink transition-transform duration-700 ease-luxurious ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <div>
            <h2 className="font-display text-2xl font-light tracking-tight">
              Shopping Bag
            </h2>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wider2 text-stone">
              {String(count).padStart(2, '0')} items
            </p>
          </div>
          <button
            onClick={close}
            aria-label="Close bag"
            className="text-ink transition-transform duration-500 hover:rotate-90"
          >
            <X size={20} strokeWidth={1.25} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="font-display text-3xl font-light italic text-stone">
                Your bag is empty
              </p>
              <p className="max-w-xs font-sans text-sm font-light text-stone">
                Considered pieces, made slowly. Explore the collection to begin.
              </p>
              <button
                onClick={close}
                className="mt-2 font-mono text-[11px] uppercase tracking-wider2 text-ink underline underline-offset-4"
              >
                Continue browsing
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-ink/10">
              {items.map((item: CartItem) => (
                <BagLine
                  key={cartKey(item)}
                  item={item}
                  onRemove={() => remove(cartKey(item))}
                  onQty={(q) => updateQuantity(cartKey(item), q)}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Footer — subtotal + checkout */}
        {items.length > 0 && (
          <div className="border-t border-ink/10 px-6 py-6">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider2 text-stone">
                Subtotal
              </span>
              <span className="font-display text-2xl font-light tabular-nums">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="mt-2 font-sans text-xs font-light text-stone">
              Shipping and taxes calculated at checkout.
            </p>
            <button
              onClick={onCheckout}
              className="mt-5 flex w-full items-center justify-center gap-3 bg-ink py-4 text-ivory transition-colors duration-500 hover:bg-charcoal"
            >
              <span className="font-mono text-[11px] uppercase tracking-wider2">
                Checkout
              </span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

function BagLine({
  item,
  onRemove,
  onQty,
}: {
  item: CartItem;
  onRemove: () => void;
  onQty: (q: number) => void;
}) {
  return (
    <li className="flex gap-4 py-5">
      <div className="h-28 w-20 shrink-0 overflow-hidden bg-beige">
        <img
          src={item.product.images.full}
          alt={item.product.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <h3 className="font-display text-lg font-light tracking-tight">
            {item.product.name}
          </h3>
          <p className="font-mono text-sm tabular-nums">
            {formatPrice(item.product.price * item.quantity)}
          </p>
        </div>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider2 text-stone">
          {item.size} / {item.color}
        </p>

        <div className="mt-auto flex items-center justify-between">
          {/* Quantity */}
          <div className="flex items-center border border-ink/15">
            <button
              onClick={() => onQty(item.quantity - 1)}
              aria-label="Decrease"
              className="flex h-8 w-8 items-center justify-center text-ink transition-colors hover:bg-ink/5"
            >
              <Minus size={12} strokeWidth={1.5} />
            </button>
            <span className="w-8 text-center font-mono text-xs tabular-nums">
              {item.quantity}
            </span>
            <button
              onClick={() => onQty(item.quantity + 1)}
              aria-label="Increase"
              className="flex h-8 w-8 items-center justify-center text-ink transition-colors hover:bg-ink/5"
            >
              <Plus size={12} strokeWidth={1.5} />
            </button>
          </div>
          <button
            onClick={onRemove}
            className="font-mono text-[10px] uppercase tracking-wider2 text-stone transition-colors hover:text-ink"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
