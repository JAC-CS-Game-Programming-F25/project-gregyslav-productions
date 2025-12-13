import AsteroidState from './AsteroidState.js';
import AsteroidStateName from '../../enums/AsteroidStateName.js';

export default class AsteroidFloatingState extends AsteroidState {
	constructor(asteroid) {
		super(asteroid);
	}

	enter() {}

	update(dt, gameState) {
		// Move
		this.asteroid.position.x += this.asteroid.velocity.x * dt;
		this.asteroid.position.y += this.asteroid.velocity.y * dt;

		// Rotate
		this.asteroid.rotation += this.asteroid.rotationSpeed * dt;

		// Update hitbox
		this.asteroid.hitbox.update(this.asteroid.position.x, this.asteroid.position.y);

		// Check if off screen (bottom)
		if (this.asteroid.position.y > 650) {
			this.asteroid.stateMachine.change(AsteroidStateName.Destroyed);
		}
	}

	render(context) {
		this.asteroid.renderSprite(context);
	}
}