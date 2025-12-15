import State from '../../../lib/State.js';
import { input, CANVAS_WIDTH, CANVAS_HEIGHT } from '../../globals.js';
import Input from '../../../lib/Input.js';

export default class PlayerState extends State {
	constructor(player) {
		super();
		this.player = player;
	}

	enter(params) {
		this.params = params || {};
	}

	update(dt) {
		// Update position based on velocity
		this.player.position.x += this.player.velocity.x * dt;
		this.player.position.y += this.player.velocity.y * dt;

		// Keep player in bounds
		this.player.position.x = Math.max(0, Math.min(CANVAS_WIDTH - this.player.dimensions.x, this.player.position.x));
		this.player.position.y = Math.max(0, Math.min(CANVAS_HEIGHT - this.player.dimensions.y, this.player.position.y));

		// Update hitbox
		//this.player.hitbox.update(this.player.position.x, this.player.position.y);
	}

	render(context) {
		this.player.renderSprite(context);
	}

	handleMovement() {
		let dx = 0;
		let dy = 0;

		if (input.isKeyHeld(Input.KEYS.W) || input.isKeyHeld(Input.KEYS.ARROW_UP)) dy -= 1;
		if (input.isKeyHeld(Input.KEYS.S) || input.isKeyHeld(Input.KEYS.ARROW_DOWN)) dy += 1;
		if (input.isKeyHeld(Input.KEYS.A) || input.isKeyHeld(Input.KEYS.ARROW_LEFT)) dx -= 1;
		if (input.isKeyHeld(Input.KEYS.D) || input.isKeyHeld(Input.KEYS.ARROW_RIGHT)) dx += 1;

		// Store movement direction for diagonal shooting
		this.player.aimDirection = { x: dx, y: dy };

		// Normalize diagonal movement
		if (dx !== 0 && dy !== 0) {
			const length = Math.sqrt(dx * dx + dy * dy);
			dx /= length;
			dy /= length;
		}

		this.player.velocity.x = dx * this.player.speed;
		this.player.velocity.y = dy * this.player.speed;

		return dx !== 0 || dy !== 0;
	}

	handleShooting(dt, gameState) {
		// Decrease fire timer
		this.player.fireTimer -= dt;

		// Only shoot when SPACE is pressed and cooldown is ready
		if (input.isKeyHeld(Input.KEYS.SPACE) && this.player.fireTimer <= 0) {
			this.player.shoot(gameState);
			this.player.fireTimer = this.player.fireRate;
		}
	}
}