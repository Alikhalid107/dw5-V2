export class RenderProperties {
    constructor() {
        this.opacity = 1.0;
        this.blendMode = 'source-over';
        this.visible = true;
    }

    setOpacity(opacity) { 
        this.opacity = Math.max(0, Math.min(1, opacity)); 
    }

    setBlendMode(mode) { 
        this.blendMode = mode; 
    }
}