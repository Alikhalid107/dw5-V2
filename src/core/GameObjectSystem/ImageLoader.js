export class ImageLoader {
  constructor(imageSrc = "") {
    this.image = new Image();
    this.image.src = imageSrc || "";
    this.loaded = false;
    this.image.onload = () => (this.loaded = true);
  }

  loadImage(src) {
    this.loaded = false;
    this.image = new Image();
    this.image.onload = () => (this.loaded = true);
    this.image.src = src;
  }
}