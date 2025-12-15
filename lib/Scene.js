import ImageName from "../src/enums/ImageName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, images } from "../src/globals.js";

export default class Scene {
	constructor() {
		this.backgroundScrollSpeed = 100;
		this.backgroundCoords = [
			{ x: 0, y: 0 },

		]
	}

	update(dt) {
		let addCoords = false;
		let offset = 0;

		this.backgroundCoords.forEach(coords => {
			coords.y += this.backgroundScrollSpeed * dt;
			if (coords.y > 0) {
				addCoords = true;
				offset = coords.y - (CANVAS_WIDTH - 1);
			}
		});

		if (addCoords && this.backgroundCoords.length < 2) {
			this.backgroundCoords.push({ x: 0, y: offset });
		}

		this.backgroundCoords = this.backgroundCoords.filter(coords => coords.y < CANVAS_HEIGHT);
	}

	render() {

		this.backgroundCoords.forEach(coords => {
			images.render(ImageName.Background, coords.x, coords.y, CANVAS_WIDTH, CANVAS_WIDTH);
		});
	}
}
