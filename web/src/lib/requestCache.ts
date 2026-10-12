export function createRequestCache<T>() {
  let value: T | null = null;
  let pending: Promise<T> | null = null;

  return {
    get() {
      return value;
    },
    load(loader: () => Promise<T>) {
      if (value !== null) return Promise.resolve(value);
      if (pending) return pending;

      pending = loader()
        .then((result) => {
          value = result;
          return result;
        })
        .finally(() => {
          pending = null;
        });

      return pending;
    },
  };
}
