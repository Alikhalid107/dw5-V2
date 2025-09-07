export class EventBus {
    static events = new Map();
    
    static on(event, callback) {
        if (!this.events.has(event)) this.events.set(event, []);
        this.events.get(event).push(callback);
    }
    
    static emit(event, data) {
        this.events.get(event)?.forEach(callback => callback(data));
    }
}
