import PlayerState from './PlayerState.js';
import PlayerStateName from '../../enums/PlayerStateName.js';

export default class PlayerBuffedState extends PlayerState {
	constructor(player) {
		super(player);
	}

	enter() {
		// TODO: Play power-up activation sound
	}

	exit() {
		// Nothing to clean up - icons handled per-frame
	}

	update(dt, gameState) {
		// Handle movement
		const isMoving = this.handleMovement();

		// Handle shooting (power-ups may modify fire rate/pattern)
		this.handleShooting(dt, gameState);

		// Update position
		super.update(dt);

		// Update power-up timers and check expiration
		this.updatePowerUpTimers(dt);

		// State transitions (priority order)
		if (this.player.isDead()) {
			this.player.stateMachine.change(PlayerStateName.Dead);
			return;
		}

		if (this.player.isInvincible) {
			this.player.stateMachine.change(PlayerStateName.Invincible);
			return;
		}

		// If no more active power-ups, return to normal state
		if (Object.keys(this.player.activePowerUps).length === 0) {
			if (isMoving) {
				this.player.stateMachine.change(PlayerStateName.Moving);
			} else {
				this.player.stateMachine.change(PlayerStateName.Idle);
			}
		}
	}

	updatePowerUpTimers(dt) {
		const expiredPowerUps = [];

		for (const [type, data] of Object.entries(this.player.activePowerUps)) {
			data.duration -= dt;
			if (data.duration <= 0) {
				expiredPowerUps.push(type);
			}
		}

		// Remove expired power-ups
		for (const type of expiredPowerUps) {
			this.player.removePowerUp(type);
			// TODO: Play power-up expired sound
		}
	}

	render(context) {
		super.render(context);
	}
}