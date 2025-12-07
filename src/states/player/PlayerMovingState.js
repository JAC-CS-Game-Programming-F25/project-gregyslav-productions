import PlayerState from './PlayerState.js';
import PlayerStateName from '../../enums/PlayerStateName.js';

export default class PlayerMovingState extends PlayerState {
	constructor(player) {
		super(player);
	}

	enter() {
		// TODO: Set moving animation sprite
	}

	update(dt, gameState) {
		// Handle movement input
		const isMoving = this.handleMovement();

		// Handle shooting (always available)
		this.handleShooting(dt, gameState);

		// Update position
		super.update(dt);

		// State transitions (priority order)
		if (this.player.isDead()) {
			this.player.stateMachine.change(PlayerStateName.Dead);
			return;
		}

		if (this.player.isInvincible) {
			this.player.stateMachine.change(PlayerStateName.Invincible);
			return;
		}

		if (Object.keys(this.player.activePowerUps).length > 0) {
			this.player.stateMachine.change(PlayerStateName.Buffed);
			return;
		}

		if (!isMoving) {
			this.player.stateMachine.change(PlayerStateName.Idle);
		}
	}
}