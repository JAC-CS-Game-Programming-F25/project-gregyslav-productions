import AsteroidState from './AsteroidState.js';

export default class AsteroidDestroyedState extends AsteroidState {
	constructor(asteroid) {
		super(asteroid);
	}

	enter() {
		this.asteroid.isActive = false;
		this.asteroid.isVisible = false;
	}

	update(dt, gameState) {}

	render(context) {}
}