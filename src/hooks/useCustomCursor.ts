import { useEffect, useRef, useState } from 'react';

interface CursorState {
  label: string | null;
  variant: 'default' | 'view' | 'drag';
}

/**
 * Custom cursor that renders a small circle follower and,
 * when hovering `[data-cursor="view"]` or `[data-cursor="drag"]`,
 * expands into a labelled disc ("VIEW", "DRAG").
 */
export function useCustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>({
    label: null,
    variant: 'default',
  });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.documentElement.classList.add('cursor-none');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      }

      const target = (e.target as HTMLElement)?.closest(
        '[data-cursor]'
      ) as HTMLElement | null;
      if (target) {
        const variant = target.dataset.cursor as CursorState['variant'];
        const label = target.dataset.cursorLabel ?? null;
        setState((prev) =>
          prev.variant === variant && prev.label === label
            ? prev
            : { variant, label }
        );
      } else {
        setState((prev) =>
          prev.variant === 'default'
            ? prev
            : { label: null, variant: 'default' }
        );
      }
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('cursor-none');
    };
  }, []);

  return { dotRef, ringRef, state };
}
