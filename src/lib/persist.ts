"use client";
// A tiny store kept in localStorage that React reads with useSyncExternalStore (no setState-in-effect, no hydration mismatch).
export function createPersistentStore<T>(key: string, initial: T) {
  let state = initial;
  let loaded = false;
  const listeners = new Set<() => void>();

  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) state = JSON.parse(raw) as T;
    } catch {}
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
      if (e.key !== key) return;
      try {
        state = e.newValue ? (JSON.parse(e.newValue) as T) : initial;
      } catch {}
      listeners.forEach((l) => l());
    });
  }

  return {
    subscribe(l: () => void) {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    getSnapshot(): T {
      load();
      return state;
    },
    getServerSnapshot(): T {
      return initial;
    },
    set(next: T) {
      load();
      state = next;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {}
      listeners.forEach((l) => l());
    },
  };
}
