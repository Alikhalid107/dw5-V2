// animationUtils.js
export const angleToFrameRanges = [
    { min: 45, max: 135, frames: [0, 17] },    // Up to Right (frame 0-17)
    { min: 135, max: 225, frames: [18, 35] },  // Right to Down (frame 18-35)
    { min: 225, max: 315, frames: [36, 53] },  // Down to Left (frame 36-53)
    { min: 315, max: 360, frames: [54, 71] },  // Left to Up (frame 54-71)
    
];

const TOTAL_FRAMES = 72;

export function angleToFrame(angle) {
  // Normalize angle to 0–360
  angle = (angle % 360 + 360) % 360;

  // Each frame covers 360 / TOTAL_FRAMES degrees
  const degreesPerFrame = 360 / TOTAL_FRAMES;

  // Map angle to frame index
  const frame = Math.floor(angle / degreesPerFrame);

  // Ensure within 0–71
  return Math.min(TOTAL_FRAMES - 1, Math.max(0, frame));
}

// Keep other utility functions
export function shortestAngleDiff(fromDeg, toDeg) {
    let diff = ((toDeg - fromDeg + 540) % 360) - 180;
    return diff;
}

export function moveAngleToward(current, target, maxDelta) {
    const diff = shortestAngleDiff(current, target);
    if (Math.abs(diff) <= maxDelta) return (target + 360) % 360;
    return (current + Math.sign(diff) * maxDelta + 360) % 360;
}

export function updateAnimation(deltaTime, frameTimer, frameSpeed, currentFrame, totalFrames) {
    let newFrameTimer = frameTimer + deltaTime;
    let newCurrentFrame = currentFrame;
    
    if (newFrameTimer >= frameSpeed) {
        newCurrentFrame = (currentFrame + 1) % totalFrames;
        newFrameTimer = 0;
    }
    
    return { newCurrentFrame, newFrameTimer };
}


