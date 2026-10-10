import { useEffect, useRef } from 'react';

/**
 * Calls `onExpire` after `duration` ms of running time. Pausing keeps the time left, so a
 * flag the user is hovering or touching doesn't disappear under them. `remaining.current`
 * is up to date inside effects that run after this hook's.
 */
export function useDismissTimer(
  duration: number,
  enabled: boolean,
  paused: boolean,
  onExpire: () => void,
) {
  const remaining = useRef(duration);
  const expire = useRef(onExpire);
  expire.current = onExpire;
  const running = enabled && !paused;

  useEffect(() => {
    if (!running) return;
    const startedAt = Date.now();
    const timer = setTimeout(() => expire.current(), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt));
    };
  }, [running]);

  return { remaining, running };
}
