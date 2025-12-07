import PowerUpState from './PowerUpState.js';
import PowerUpStateName from '../../enums/PowerUpStateName.js';

export default class PowerUpBlinkingState extends PowerUpState {
	constructor(powerUp) {
		super(powerUp);
	}

	enter() {
		this.powerUp.blinkTimer = 0;
		this.powerUp.isVisible = true;
		// TODO: Play warning sound
	}

	update(dt) {
		super.update(dt); // Updates position

		// Decrease life timer
		this.powerUp.lifeTimer -= dt;

		// Flash effect - unique to this state
		this.powerUp.blinkTimer += dt;
		if (this.powerUp.blinkTimer >= 0.1) {
			this.powerUp.isVisible = !this.powerUp.isVisible;
			this.powerUp.blinkTimer = 0;
		}

		// Check if expired
		if (this.powerUp.lifeTimer <= 0) {
			this.powerUp.stateMachine.change(PowerUpStateName.Expired);
			return;
		}

		// Check if off screen
		if (this.powerUp.position.y > 650) {
			this.powerUp.stateMachine.change(PowerUpStateName.Expired);
			return;
		}
	}

	render(context) {
		if (this.powerUp.isVisible) {
			super.render(context);
		}
	}
}