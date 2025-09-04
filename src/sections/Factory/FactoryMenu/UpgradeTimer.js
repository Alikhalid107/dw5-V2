// export class UpgradeTimer {
//   constructor(factory) {
//     this.factory = factory;
//   }

//   draw(ctx, offsetX, offsetY) {
//     const factory = this.factory;
//     if (!factory.upgrading) return;

//     const x = factory.x - offsetX;
//     const y = factory.y - offsetY - 50;
    
//     const progress = factory.getUpgradeProgress();
//     const timeLeft = factory.getRemainingUpgradeTime();

//     // Timer background
//     ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
//     ctx.fillRect(x, y, factory.factoryWidth, 15);

//     // Progress bar
//     ctx.fillStyle = "#4CAF50";
//     ctx.fillRect(x, y, factory.factoryWidth * progress, 15);

//     // Timer text
//     ctx.fillStyle = "white";
//     ctx.font = "10px Arial";
//     ctx.textAlign = "center";
//     ctx.fillText(
//       `${timeLeft}s`,
//       x + factory.factoryWidth / 2,
//       y + 11
//     );
//   }
// }