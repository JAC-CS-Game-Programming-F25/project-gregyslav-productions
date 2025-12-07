import PowerUpState from './PowerUpState.js';
import PowerUpStateName from '../../enums/PowerUpStateName.js';

export default class PowerUpActiveState extends PowerUpState {
	constructor(powerUp) {
		super(powerUp);
	}

	enter() {
		this.powerUp.isVisible = true;
		this.powerUp.lifeTimer = this.powerUp.lifeDuration;
		// TODO: Set active sprite/animation
	}

	update(dt) {
		super.update(dt); // Updates position (floating down)

		// Decrease life timer
		this.powerUp.lifeTimer -= dt;

		// Start blinking when about to expire 
		if (this.powerUp.lifeTimer <= 3) {
			this.powerUp.stateMachine.change(PowerUpStateName.Blinking);
			return;
		}

		// Check if off screen
		if (this.powerUp.position.y > 650) {
			this.powerUp.stateMachine.change(PowerUpStateName.Expired);
			return;
		}

		// Collision with player is handled externally by PlayState
	}
}