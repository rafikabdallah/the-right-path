import { useCallback, useEffect, useState } from 'react';

import { subscribeToChanges } from '@/database/changes';

export interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

/**
 * Runs an async database read, re-running it whenever `deps` change or any
 * repository reports a write.
 *
 * That subscription is what keeps the charts honest: completing a prayer on
 * one screen invalidates every derived view without those screens having to
 * know about each other.
 */
export function useDatabaseQuery<T>(
  query: () => Promise<T>,
  deps: readonly unknown[]
): QueryState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [nonce, setNonce] = useState(0);

  const refresh = useCallback(() => setNonce((value) => value + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    query()
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setError(null);
      })
      .catch((caught: unknown) => {
        if (cancelled) return;
        setError(caught instanceof Error ? caught : new Error(String(caught)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // `query` is deliberately excluded — callers define it inline, so the
    // explicit dependency list is what decides when a re-read is warranted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  useEffect(() => subscribeToChanges(refresh), [refresh]);

  return { data, loading, error, refresh };
}
