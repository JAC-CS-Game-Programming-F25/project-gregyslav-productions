import PowerUpState from './PowerUpState.js';

export default class PowerUpExpiredState extends PowerUpState {
	constructor(powerUp) {
		super(powerUp);
	}

	enter() {
		this.powerUp.isActive = false;
		this.powerUp.isVisible = false;
		// TODO: fade-out effect or particle? if not we can probably remove this class
	}

	update(dt) {
		// Terminal state - no updates
	}

	render(context) {
		// Don't render - expired
	}
}