export class ZoomDetector {
    static detectZoomLevel(baseWidth) {
        const actualWidth = window.innerWidth;
        const dpr = window.devicePixelRatio;
        return (actualWidth * dpr) / baseWidth;
    }

    static detectBrowserZoom() {
        const zoom1 = window.outerWidth / window.innerWidth;
        const zoom2 = window.devicePixelRatio;

        if (Math.abs(zoom1 - 1) > 0.1) return zoom1;
        if (Math.abs(zoom2 - 1) > 0.1) return zoom2;
        return 1;
    }
}