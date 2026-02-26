type Handler = (payload?: any) => void;

export function createEventBus() {
  const handlers = new Map<string, Set<Handler>>();

  function on(eventName: string, handler: Handler) {
    if (!handlers.has(eventName)) handlers.set(eventName, new Set());
    handlers.get(eventName)!.add(handler);
    return () => handlers.get(eventName)!.delete(handler);
  }

  function emit(eventName: string, payload?: any) {
    // Keep it transparent for debugging
    console.log(`[event] ${eventName}`, payload ?? "");
    const set = handlers.get(eventName);
    if (!set) return;
    for (const h of set) h(payload);
  }

  return { on, emit };
}
