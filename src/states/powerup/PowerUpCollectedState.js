import PowerUpState from './PowerUpState.js';

export default class PowerUpCollectedState extends PowerUpState {
	constructor(powerUp) {
		super(powerUp);
	}

	enter() {
		this.powerUp.isActive = false;
		this.powerUp.isVisible = false;
		// TODO: Play pickup sound effect
		// TODO: Spawn collection particle effect
	}

	update(dt) {
		// Terminal state - no updates
	}

	render(context) {
		// Don't render - collected
	}
}