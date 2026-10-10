import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { FlagApi, FlagOptions, FlagProviderProps } from './Flag.types';

export interface FlagEntry extends FlagOptions {
  id: string;
  /** Native only: the flag is animating out and is removed when that finishes. */
  leaving?: boolean;
}

export const FlagContext = createContext<FlagApi | null>(null);

/** Shows and dismisses flags. Must be used inside a `FlagProvider`. */
export function useFlags(): FlagApi {
  const api = useContext(FlagContext);
  if (!api) throw new Error('useFlags must be used inside a <FlagProvider>.');
  return api;
}

let nextId = 0;

/**
 * The flag list shared by both platforms. Newest flag last. With `animatedExit`, dismissing
 * marks a flag `leaving` and the renderer calls `remove` once its exit animation ends;
 * otherwise flags are removed at once (web animates them out with AnimatePresence).
 */
export function useFlagStore(props: FlagProviderProps, animatedExit: boolean) {
  const [flags, setFlags] = useState<FlagEntry[]>([]);
  const maxFlags = props.maxFlags ?? 5;
  const flagsRef = useRef(flags);
  flagsRef.current = flags;

  const remove = useCallback((id: string) => {
    const flag = flagsRef.current.find((f) => f.id === id);
    if (!flag) return;
    flagsRef.current = flagsRef.current.filter((f) => f.id !== id);
    setFlags(flagsRef.current);
    flag.onDismissed?.(id);
  }, []);

  const dismissFlag = useCallback(
    (id: string) => {
      if (!animatedExit) return remove(id);
      flagsRef.current = flagsRef.current.map((f) => (f.id === id ? { ...f, leaving: true } : f));
      setFlags(flagsRef.current);
    },
    [animatedExit, remove],
  );

  const showFlag = useCallback(
    (options: FlagOptions) => {
      const id = options.id ?? `flag-${++nextId}`;
      const entry: FlagEntry = { ...options, id };
      const current = flagsRef.current;
      const exists = current.some((f) => f.id === id);
      let next = exists ? current.map((f) => (f.id === id ? entry : f)) : [...current, entry];
      const overflow = next.filter((f) => !f.leaving).slice(0, -maxFlags);
      next = next.map((f) => (overflow.includes(f) ? { ...f, leaving: true } : f));
      flagsRef.current = next;
      setFlags(next);
      if (!animatedExit) overflow.forEach((f) => remove(f.id));
      return id;
    },
    [maxFlags, animatedExit, remove],
  );

  const dismissAllFlags = useCallback(
    () => flagsRef.current.forEach((f) => dismissFlag(f.id)),
    [dismissFlag],
  );

  const api = useMemo<FlagApi>(
    () => ({ showFlag, dismissFlag, dismissAllFlags }),
    [showFlag, dismissFlag, dismissAllFlags],
  );
  return { flags, api, remove, dismissFlag };
}
