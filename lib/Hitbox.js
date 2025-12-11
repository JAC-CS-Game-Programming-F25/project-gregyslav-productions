import { getCollisionDirection, isAABBCollision } from "./Collision.js";
import Vector from "./Vector.js";

export default class Hitbox {
	/**
	 * A rectangle that represents the area around a game
	 * entity or object that can collide with other hitboxes.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @param {string} colour
	 */
	constructor(x = 0, y = 0, width = 0, height = 0, angle = 0, colour = 'red') {
		this.colour = colour;
		this.set(x, y, width, height);
		this.setDirection(angle);
	}

	set(x, y, width, height) {
		this.position = new Vector(x, y);
		this.dimensions = new Vector(width, height);

		this.updateCorners();
	}

	setDirection(angle) {
		this.angle = angle;
		this.updateCorners();
	}

	didCollide(target) {
		target.corners.forEach(element => {
			if (this.checkCollisionOnPoint(element))
				return true;
		});

		return false;
	}

	checkCollisionOnPoint(point) {
		let sin = Math.sin(-1 * this.angle * (Math.PI / 180));
		let cos = Math.cos(-1 * this.angle * (Math.PI / 180));

		let temp = new Vector(
			point.x - this.position.x,
			point.y - this.position.y
		)

		let rotatedPointPos = new Vector(
			this.position.x + (temp.x * cos - temp.y * sin),
			this.position.y + (temp.x * sin + temp.y * cos)
		);

		return isAABBCollision(
			this.position.x - this.dimensions.x / 2,
			this.position.y - this.dimensions.y / 2,
			this.dimensions.x,
			this.dimensions.y,
			rotatedPointPos.x,
			rotatedPointPos.y,
			1,
			1
		);

	}

	getCollisionDirection(target) {
		let distance = Math.sqrt(Math.pow(Math.abs(this.position.x - target.position.x), 2) + Math.pow(Math.abs(this.position.y - target.position.y), 2));
		return Math.asin((target.position.y - this.position.y) / distance) * (180 / Math.PI);
	}

	updateCorners() {
		let radius =  Math.sqrt((Math.pow(this.dimensions.x / 2, 2) + Math.pow(this.dimensions.y / 2, 2)));
		let angleOffset = Math.asin((this.dimensions.y / 2) / radius);

		let radangle = this.angle * (Math.PI / 180);

		let rad180 = Math.PI;

		let tl = new Vector(
			Math.cos((rad180 + angleOffset) + radangle) * radius,
			Math.sin((rad180 + angleOffset) + radangle) * radius
		);
		let tr = new Vector(
			Math.cos((0 - angleOffset) + radangle) * radius,
			Math.sin((0 - angleOffset) + radangle) * radius
		);
		let br = new Vector(
			Math.cos((angleOffset) + radangle) * radius,
			Math.sin((angleOffset) + radangle) * radius
		);
		let bl = new Vector(
			Math.cos((rad180 - angleOffset) + radangle) * radius,
			Math.sin((rad180 - angleOffset) + radangle) * radius
		);

		this.corners = { tl: tl, tr: tr, br: br, bl: bl };
	}

	render(context) {
		context.save();
		context.strokeStyle = this.colour;
		context.translate(this.position.x, this.position.y);
        context.rotate(this.angle * Math.PI / 180);
		context.beginPath();
		context.rect(this.dimensions.x /- 2, this.dimensions.y / -2, this.dimensions.x, this.dimensions.y);
		context.stroke();
		context.closePath();
        context.rotate(-1 * this.angle * Math.PI / 180);
		for (let corner in this.corners) {
			context.beginPath();
			context.arc(this.corners[corner].x, this.corners[corner].y, 2, 0, Math.PI * 2);
			context.fillStyle = this.colour;
			context.fill();
			context.closePath();
		}
		context.restore();
	}
}
