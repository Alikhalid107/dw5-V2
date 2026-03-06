/**
 * MessageBus — UI-level message dispatcher.
 *
 * Use for user-facing status strings shown in the UI (e.g. production
 * warnings like "Capped at 15 hours", "Cannot start 15hr production").
 *
 * Subscribers are typically UI components that display toast/message text.
 *
 * For system-level engine events (camera, canvas, zoom), use EventBus
 * in src/events/EventBus.js instead.
 */
export const MessageBus = {
  _subs: new Set(),

  subscribe(fn) {
    if (typeof fn !== "function") return;
    this._subs.add(fn);
  },

  unsubscribe(fn) {
    this._subs.delete(fn);
  },

  publish(message) {
    // Keep message just a string for maximum compatibility with your existing callbacks
    try {
      this._subs.forEach((fn) => {
        try { fn(message); } catch (e) { console.error("MessageBus subscriber error:", e); }
      });
    } catch (e) {
      console.error("MessageBus.publish error:", e);
    }
  }
};
