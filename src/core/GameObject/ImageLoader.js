export class ImageLoader {
    constructor(imageSrc = "") {
        this.image = new Image();
        this.image.src = imageSrc || "";
        this.loaded = false;
        this.image.onload = () => (this.loaded = true);
    }
}