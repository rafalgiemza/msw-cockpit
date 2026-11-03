import type { HandlerInfo, MswWorker } from "./types.js";

interface HandlerEntry {
  info: HandlerInfo;
  handler: any;
}

/**
 * Snapshot of the worker's original handlers with the ability to
 * re-apply them minus the ones switched off in the cockpit.
 */
export class HandlerRegistry {
  private entries: HandlerEntry[] = [];

  constructor(private worker: MswWorker) {
    const seen = new Map<string, number>();
    const handlers =
      typeof worker.listHandlers === "function" ? worker.listHandlers() : [];

    handlers.forEach((handler, index) => {
      const info = handler?.info ?? {};
      const header = String(info.header ?? `handler-${index + 1}`);
      const count = (seen.get(header) ?? 0) + 1;
      seen.set(header, count);

      this.entries.push({
        handler,
        info: {
          id: count > 1 ? `${header}#${count}` : header,
          method: String(info.method ?? info.operationType ?? ""),
          path: String(info.path ?? info.operationName ?? header),
        },
      });
    });
  }

  list(): HandlerInfo[] {
    return this.entries.map((entry) => entry.info);
  }

  /**
   * Replace the worker's active handlers with those not in `disabledIds`.
   * Switched-off handlers are dropped, so their requests are unhandled
   * and go to the real network.
   */
  apply(disabledIds: string[]): void {
    const disabled = new Set(disabledIds);
    const enabled = this.entries
      .filter((entry) => !disabled.has(entry.info.id))
      .map((entry) => entry.handler);

    if (enabled.length > 0) {
      this.worker.resetHandlers(...enabled);
    } else if (this.entries.length > 0) {
      // resetHandlers() with no arguments restores the originals,
      // so pass one inert handler to keep everything switched off.
      this.worker.resetHandlers(inertHandler(this.entries[0].handler));
    }
  }
}

/**
 * A copy of a handler that never matches (covers MSW v1 `test` and v2 `run`)
 */
function inertHandler(handler: any): any {
  return Object.create(handler, {
    test: { value: () => false },
    run: { value: async () => null },
  });
}
