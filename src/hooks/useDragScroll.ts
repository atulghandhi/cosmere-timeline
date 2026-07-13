import { useCallback, useEffect, useRef, useState } from 'react';

const DRAG_THRESHOLD_PX = 6;

/**
 * Click-and-drag panning for a scrollable element (both axes).
 * Native touch scrolling is left untouched; a small movement threshold
 * distinguishes clicks from drags, and clicks that end a drag are suppressed
 * so panning never de-selects or activates elements underneath the pointer.
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [isDragging, setIsDragging] = useState(false);
  const drag = useRef({
    startX: 0,
    startY: 0,
    startScrollLeft: 0,
    startScrollTop: 0,
    moved: false,
    pointerDown: false,
  });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !ref.current) return;
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      startScrollLeft: ref.current.scrollLeft,
      startScrollTop: ref.current.scrollTop,
      moved: false,
      pointerDown: true,
    };
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !drag.current.pointerDown) return;
    const deltaX = e.clientX - drag.current.startX;
    const deltaY = e.clientY - drag.current.startY;
    if (!drag.current.moved) {
      if (Math.abs(deltaX) < DRAG_THRESHOLD_PX && Math.abs(deltaY) < DRAG_THRESHOLD_PX) return;
      drag.current.moved = true;
      setIsDragging(true);
      el.setPointerCapture(e.pointerId);
    }
    el.scrollLeft = drag.current.startScrollLeft - deltaX;
    el.scrollTop = drag.current.startScrollTop - deltaY;
  }, []);

  const endDrag = useCallback(() => {
    drag.current.pointerDown = false;
    setIsDragging(false);
  }, []);

  // Suppress the click that fires when a drag ends on top of a node or link.
  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (drag.current.moved) {
      drag.current.moved = false;
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  // Let a vertical mouse wheel pan horizontally-scrolling containers.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const horizontal = el.scrollWidth > el.clientWidth && el.scrollHeight <= el.clientHeight;
      if (horizontal && Math.abs(e.deltaY) > Math.abs(e.deltaX) && !e.shiftKey) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return {
    ref,
    isDragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onPointerLeave: endDrag,
      onClickCapture,
    },
  };
}
