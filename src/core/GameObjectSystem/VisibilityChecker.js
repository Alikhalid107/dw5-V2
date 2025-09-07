export class VisibilityChecker {
    static isVisible(x, y, width, height, offsetX, offsetY, viewW, viewH, visible) {
        if (!visible) return false;
        
        const left = x - offsetX;
        const top = y - offsetY;
        const right = left + width;
        const bottom = top + height;
        
        return right > 0 && bottom > 0 && left < viewW && top < viewH;
    }
}