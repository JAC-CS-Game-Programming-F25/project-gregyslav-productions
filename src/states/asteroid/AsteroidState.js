import State from '../../../lib/State.js';

export default class AsteroidState extends State {
	constructor(asteroid) {
		super();
		this.asteroid = asteroid;
	}

	enter(params) {
		this.params = params || {};
	}

	update(dt, gameState) {}

	render(context) {
		if (this.asteroid.isVisible) {
			this.asteroid.renderSprite(context);
		}
	}
}