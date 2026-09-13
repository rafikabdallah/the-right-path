/**
 * A tiny change channel.
 *
 * Repositories call `notifyChange()` after a write; hooks subscribe and
 * re-query. That is what makes a completed prayer show up in the charts
 * without any screen having to know which other screens exist.
 */
type Listener = () => void;

const listeners = new Set<Listener>();
let revision = 0;

export function subscribeToChanges(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyChange(): void {
  revision += 1;
  listeners.forEach((listener) => listener());
}

export function getRevision(): number {
  return revision;
}
