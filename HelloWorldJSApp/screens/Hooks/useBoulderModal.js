import { useState, useCallback } from 'react';

export default function useBoulderModal() {
  const [visible, setVisible] = useState(false);
  const [boulder, setBoulder] = useState(null);

  const open = useCallback((b) => {
    setBoulder(b);
    setVisible(true);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setBoulder(null);
  }, []);

  return {
    visible,
    boulder,
    open,
    close,
  };
}
