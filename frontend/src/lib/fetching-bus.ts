type Listener = (active: boolean) => void;

let count = 0;
const listeners = new Set<Listener>();

function emit() {
  const active = count > 0;
  listeners.forEach((fn) => fn(active));
}

export function subscribeFetching(listener: Listener) {
  listeners.add(listener);
  listener(count > 0);
  return () => {
    listeners.delete(listener);
  };
}

export function startFetching() {
  count += 1;
  emit();
}

export function stopFetching() {
  count = Math.max(0, count - 1);
  emit();
}

export async function withFetching<T>(fn: () => Promise<T>): Promise<T> {
  startFetching();
  try {
    return await fn();
  } finally {
    stopFetching();
  }
}
