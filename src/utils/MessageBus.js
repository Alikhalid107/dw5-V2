// src/utils/MessageBus.js
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
