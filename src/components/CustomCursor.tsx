import { useCustomCursor } from '@/hooks/useCustomCursor';

export function CustomCursor() {
  const { dotRef, ringRef, state } = useCustomCursor();

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  const expanded = state.variant !== 'default';

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1 w-1 rounded-full bg-ink"
        style={{ transition: 'opacity 0.3s' }}
      />
      <div
        ref={ringRef}
        className={`pointer-events-none fixed left-0 top-0 z-[9998] flex items-center justify-center rounded-full border border-ink/60 transition-[width,height,background-color,border-color] duration-500 ease-luxurious ${
          expanded
            ? 'h-24 w-24 bg-ink text-ivory border-ink'
            : 'h-7 w-7 bg-transparent'
        }`}
      >
        {state.label && (
          <span className="font-mono text-[10px] uppercase tracking-widest2">
            {state.label}
          </span>
        )}
      </div>
    </>
  );
}
