export function detectBrowserZoom() {
    // Multiple methods to detect zoom for better accuracy
    const zoom1 = window.outerWidth / window.innerWidth;
    const zoom2 = window.devicePixelRatio;
    const zoom3 = screen.width / window.innerWidth;
    
    // Use the most reliable method
    if (Math.abs(zoom1 - 1) > 0.1) return zoom1;
    if (Math.abs(zoom2 - 1) > 0.1) return zoom2;
    return 1;
}