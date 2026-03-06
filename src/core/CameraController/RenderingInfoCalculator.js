export class RenderingInfoCalculator {
    static calculate(viewW, viewH, baseWidth, baseHeight, currentZoom, minZoomForFullScreen = 0.8) {
        if (currentZoom >= minZoomForFullScreen) {
            // Full screen rendering
            return {
                renderWidth: viewW,
                renderHeight: viewH,
                offsetX: 0,
                offsetY: 0,
                useBlackBars: false,
                qualityMultiplier: Math.max(1, currentZoom) // Higher quality for zoomed in
            };
        } else {
            // Black bars mode - maintain aspect ratio
            const targetAspectRatio = baseWidth / baseHeight;
            const currentAspectRatio = viewW / viewH;
            
            let renderWidth, renderHeight, offsetX = 0, offsetY = 0;
            
            if (currentAspectRatio > targetAspectRatio) {
                // Window is wider - add black bars on sides
                renderHeight = viewH;
                renderWidth = renderHeight * targetAspectRatio;
                offsetX = (viewW - renderWidth) / 2;
            } else {
                // Window is taller - add black bars on top/bottom
                renderWidth = viewW;
                renderHeight = renderWidth / targetAspectRatio;
                offsetY = (viewH - renderHeight) / 2;
            }
            
            return {
                renderWidth,
                renderHeight,
                offsetX,
                offsetY,
                useBlackBars: true,
                qualityMultiplier: 1.0 // Maintain quality even when zoomed out
            };
        }
    }
}