import Vector from '../../lib/Vector.js';
import Hitbox from '../../lib/Hitbox.js';
import CollisionLayer from '../enums/CollisionLayer.js';


export default class Entity {
	constructor(x, y, width, height) {
		this.position = new Vector(x, y);
		this.dimensions = new Vector(width, height);
		this.velocity = new Vector(0, 0);
		this.hitbox = new Hitbox(x, y, width, height);
		this.isActive = true;
		
		// TODO: Add actual sprite (for now sprite placeholder color)
		this.color = '#ffffff';
		
		// Collision
		this.collisionLayer = CollisionLayer.None;
		this.collisionMask = CollisionLayer.None;
	}

	update(dt) {
		// Update position based on velocity
		this.position.x += this.velocity.x * dt;
		this.position.y += this.velocity.y * dt;
		
		// Update hitbox
		this.hitbox.update(this.position.x, this.position.y);
	}

	render(context) {
		// Sprite placeholder - colored rectangle
		context.fillStyle = this.color;
		context.fillRect(
			Math.floor(this.position.x),
			Math.floor(this.position.y),
			this.dimensions.x,
			this.dimensions.y
		);
	}

	getHitbox() {
		return this.hitbox;
	}

	getCenter() {
		return new Vector(
			this.position.x + this.dimensions.x / 2,
			this.position.y + this.dimensions.y / 2
		);
	}

	onCollision(other) {}

	destroy() {
		this.isActive = false;
	}
}