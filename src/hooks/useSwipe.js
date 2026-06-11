import { useRef, useCallback } from "react";

const DEFAULT_THRESHOLD = 48;
const DEFAULT_VELOCITY = 0.3;

/**
 * Touch swipe gesture hook for native-feel mobile interactions.
 */
export const useSwipe = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = DEFAULT_THRESHOLD,
  velocityThreshold = DEFAULT_VELOCITY,
} = {}) => {
  const start = useRef(null);

  const onTouchStart = useCallback((e) => {
    const t = e.touches[0];
    start.current = { x: t.clientX, y: t.clientY, time: Date.now() };
  }, []);

  const onTouchEnd = useCallback(
    (e) => {
      if (!start.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.current.x;
      const dy = t.clientY - start.current.y;
      const elapsed = Date.now() - start.current.time;
      const velocity = Math.sqrt(dx * dx + dy * dy) / Math.max(elapsed, 1);

      start.current = null;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      const fast = velocity > velocityThreshold;

      if ((absX > threshold || fast) && absX > absY) {
        if (dx < 0) onSwipeLeft?.();
        else onSwipeRight?.();
        return;
      }

      if ((absY > threshold || fast) && absY > absX) {
        if (dy < 0) onSwipeUp?.();
        else onSwipeDown?.();
      }
    },
    [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, velocityThreshold]
  );

  return { onTouchStart, onTouchEnd };
};

export default useSwipe;
