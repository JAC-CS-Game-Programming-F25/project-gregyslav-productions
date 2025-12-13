import Vector from '../../lib/Vector.js';
import Vector2 from '../../lib/Vector2.js';
import Hitbox from '../../lib/Hitbox.js';
import CollisionLayer from '../enums/CollisionLayer.js';
import { DEBUG } from '../globals.js';

export default class Entity {
	constructor(x, y, width, height, angle = 0) {
		this.position = new Vector(x, y);
		this.dimensions = new Vector(width, height);
		this.angle = angle;
		this.velocity = new Vector2(0, 0);
		this.hitbox = new Hitbox(x, y, width, height, angle);
		this.isActive = true;
		
		this.isVisible = true;

		// Sprites
		this.sprites = [];
		this.currentFrame = 0;

		this.scale = new Vector(1, 1);

		// Used to flash the entity when taking damage
		this.alpha = 1;

		// Collision
		this.collisionLayer = CollisionLayer.None;
		this.collisionMask = CollisionLayer.None;
	}

	update(dt) {
		// Update position based on velocity
		this.position.x += this.velocity.x * dt;
		this.position.y += this.velocity.y * dt;

		// Update hitbox
		this.hitbox.set(this.position.x, this.position.y, this.dimensions.x, this.dimensions.y);
		this.hitbox.setDirection(this.angle);
	}

	render(context) {
		if (!this.isVisible) return;

		context.save();
		context.globalAlpha = this.alpha;

		if (DEBUG) {
        	this.hitbox.render(context);
		}
        context.translate(this.position.x, this.position.y);
        context.rotate(this.angle * Math.PI / 180);
		if (this.sprite !== null && this.sprite !== undefined) {
        	this.sprite.render(this.dimensions.x / -2, this.dimensions.y / -2, { x: this.scale.x, y: this.scale.y });
		}

		context.restore();
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