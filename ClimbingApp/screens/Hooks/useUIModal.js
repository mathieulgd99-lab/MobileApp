import { useState, useCallback } from 'react';

/**
 * Centralised UI modal manager
 * - One single native <Modal />
 * - Internal history stack to avoid flicker
 * - iOS / Android safe
 */
export default function useUIModal() {
  const [stack, setStack] = useState([]);

  const current = stack[stack.length - 1] ?? { type: null, payload: null };

  /** Open a modal (reset stack) */
  const open = useCallback((type, payload = null) => {
    setStack([{ type, payload }]);
  }, []);

  /** Switch modal WITHOUT closing native Modal */
  const switchTo = useCallback((type, payload = null) => {
    setStack(prev => [...prev, { type, payload }]);
  }, []);

  /** Go back to previous modal */
  const back = useCallback(() => {
    setStack(prev => {
      if (prev.length <= 1) return [];
      return prev.slice(0, -1);
    });
  }, []);

  /** Close everything */
  const close = useCallback(() => {
    setStack([]);
  }, []);

  return {
    visible: stack.length > 0,
    type: current.type,
    payload: current.payload,
    open,
    switchTo,
    back,
    close,
  };
}
