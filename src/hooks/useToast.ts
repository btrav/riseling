import { useCallback, useEffect, useRef, useState } from 'react';

type ToastState = { id: number; message: string } | null;

export function useToast(defaultDurationMs = 2000) {
  const [toast, setToast] = useState<ToastState>(null);
  const timer = useRef<number | undefined>(undefined);

  const show = useCallback(
    (message: string, durationMs = defaultDurationMs) => {
      window.clearTimeout(timer.current);
      const id = Date.now();
      setToast({ id, message });
      timer.current = window.setTimeout(() => setToast(null), durationMs);
    },
    [defaultDurationMs],
  );

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return { toast, show };
}
