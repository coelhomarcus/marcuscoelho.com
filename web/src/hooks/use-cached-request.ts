import { useEffect, useState } from "react";

export function useCachedRequest<T>(
  load: () => Promise<T>,
  peek?: () => T | null,
) {
  const [data, setData] = useState<T | null>(() => peek?.() ?? null);
  const [isLoading, setIsLoading] = useState(data === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    load()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Falha ao carregar dados");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [load]);

  return { data, isLoading, error };
}
