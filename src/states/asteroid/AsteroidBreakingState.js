import AsteroidState from './AsteroidState.js';
import AsteroidStateName from '../../enums/AsteroidStateName.js';
import { context } from '../../globals.js';

export default class AsteroidBreakingState extends AsteroidState {
	constructor(asteroid) {
		super(asteroid);
	}

	enter(params) {
		super.enter(params);
		this.gameState = params.gameState || null;
		this.asteroid.breakTimer = this.asteroid.breakDuration;

		// Stop moving
		this.asteroid.velocity.x = 0;
		this.asteroid.velocity.y = 0;

		// TODO: Play breaking sound effect
	}

	update(dt, gameState) {
		// Use passed gameState or stored one
		const currentGameState = gameState || this.gameState;

		this.asteroid.breakTimer -= dt;

		if (this.asteroid.breakTimer <= 0) {
			// Spawn child asteroids
			this.asteroid.spawnChildAsteroids(currentGameState);

			// Drop power-up if applicable (only small asteroids)
			if (this.asteroid.willDropPowerUp && currentGameState) {
				this.asteroid.dropPowerUp(currentGameState);
			}

			// TODO: Spawn break particles/debris

			this.asteroid.stateMachine.change(AsteroidStateName.Destroyed);
		}
	}

	render() {
		if (!this.asteroid.isVisible) return;

		const centerX = this.asteroid.position.x + this.asteroid.dimensions.x / 2;
		const centerY = this.asteroid.position.y + this.asteroid.dimensions.y / 2;

		context.save();
		context.translate(centerX, centerY);
		context.rotate(this.asteroid.rotation);

		this.asteroid.sprites[this.asteroid.currentFrame].render(
			-this.asteroid.dimensions.x / 2,
			-this.asteroid.dimensions.y / 2
		);

		context.globalCompositeOperation = 'source-atop';
		context.fillStyle = 'white';
		context.fillRect(
			-this.asteroid.dimensions.x / 2,
			-this.asteroid.dimensions.y / 2,
			this.asteroid.dimensions.x,
			this.asteroid.dimensions.y
		);

		context.restore();
	}
}