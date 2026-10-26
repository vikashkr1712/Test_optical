import { useRef } from 'react';

// Keep vertical page scrolling native; capture only a deliberate horizontal gesture.
export default function useSwipe({ enabled = true, onSwipe }) {
  const gesture = useRef(null);
  const suppressClick = useRef(false);
  return {
    onPointerDown(event) {
      suppressClick.current = false;
      if (!enabled || event.pointerType === 'mouse' || !event.isPrimary || event.target.closest('[data-no-swipe]')) return;
      gesture.current = { x: event.clientX, y: event.clientY, id: event.pointerId, horizontal: false };
    },
    onPointerMove(event) {
      const start = gesture.current;
      if (!start || start.id !== event.pointerId) return;
      const dx = Math.abs(event.clientX - start.x), dy = Math.abs(event.clientY - start.y);
      if (!start.horizontal && dy > 10 && dy > dx) { gesture.current = null; return; }
      if (dx > 10 && dx > dy) {
        start.horizontal = true;
        suppressClick.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    },
    onPointerUp(event) {
      const start = gesture.current;
      gesture.current = null;
      if (!start || start.id !== event.pointerId) return;
      const dx = event.clientX - start.x, dy = event.clientY - start.y;
      if (Math.abs(dx) >= 32 && Math.abs(dx) > Math.abs(dy)) {
        suppressClick.current = true;
        onSwipe(dx < 0 ? 1 : -1);
      }
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    },
    onPointerCancel() { gesture.current = null; },
    onClickCapture(event) {
      if (suppressClick.current && event.detail > 0) {
        event.preventDefault(); event.stopPropagation(); suppressClick.current = false;
      }
    },
  };
}
