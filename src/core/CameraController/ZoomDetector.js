export class ZoomDetector {
    static detectZoomLevel(baseWidth) {
        // Detect zoom by comparing actual viewport to expected viewport
        const actualWidth = window.innerWidth;
        const dpr = window.devicePixelRatio;
        
        // Calculate effective zoom (accounts for both browser zoom and DPR)
        return (actualWidth * dpr) / baseWidth;
    }
}