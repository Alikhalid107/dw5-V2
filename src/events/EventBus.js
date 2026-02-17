/**
 * EventBus — System-level event dispatcher.
 *
 * Use for internal engine/system events such as camera movement, canvas
 * resize, zoom changes, and any cross-module coordination that does NOT
 * involve user-facing UI messages.
 *
 * For user-facing UI messages (e.g. "Capped at 15 hours"), use MessageBus
 * in src/utils/MessageBus.js instead.
 */
export class EventBus {
    static events = new Map();

    static on(event, callback) {
        if (!this.events.has(event)) this.events.set(event, []);
        this.events.get(event).push(callback);
    }

    static off(event, callback) {
        const listeners = this.events.get(event);
        if (!listeners) return;
        const idx = listeners.indexOf(callback);
        if (idx !== -1) listeners.splice(idx, 1);
    }

    static emit(event, data) {
        this.events.get(event)?.forEach(callback => callback(data));
    }
}
