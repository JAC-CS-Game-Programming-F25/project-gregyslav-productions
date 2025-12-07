import PlayerState from './PlayerState.js';
import PlayerStateName from '../../enums/PlayerStateName.js';

export default class PlayerInvincibleState extends PlayerState {
	constructor(player) {
		super(player);
	}

	enter() {
		this.player.invincibleTimer = this.player.invincibleDuration;
		this.player.flashTimer = 0;
		this.player.isVisible = true;
		this.player.isInvincible = true;
		// TODO: Play damage sound effect
		// TODO: Set invincible animation sprite (if different)
	}

	exit() {
		this.player.isVisible = true;
		this.player.isInvincible = false;
	}

	update(dt, gameState) {
		// Flash effect - unique to this state
		this.player.flashTimer += dt;
		if (this.player.flashTimer >= 0.1) {
			this.player.isVisible = !this.player.isVisible;
			this.player.flashTimer = 0;
		}

		// Handle movement (player can still move while invincible)
		this.handleMovement();

		// Handle shooting (player can still shoot while invincible)
		this.handleShooting(dt, gameState);

		// Update position
		super.update(dt);

		// Check if invincibility expired
		this.player.invincibleTimer -= dt;
		if (this.player.invincibleTimer <= 0) {
			this.player.isVisible = true;

			// Transition based on current movement
			if (Object.keys(this.player.activePowerUps).length > 0) {
				this.player.stateMachine.change(PlayerStateName.Buffed);
			} else if (this.player.velocity.x !== 0 || this.player.velocity.y !== 0) {
				this.player.stateMachine.change(PlayerStateName.Moving);
			} else {
				this.player.stateMachine.change(PlayerStateName.Idle);
			}
		}
	}

	render(context) {
		if (this.player.isVisible) {
			super.render(context);
		}
	}
}