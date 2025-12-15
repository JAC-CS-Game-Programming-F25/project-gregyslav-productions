import PlayerState from './PlayerState.js';

export default class PlayerDeadState extends PlayerState {
	constructor(player) {
		super(player);
		this.deathAnimationTimer = 0;
		this.deathAnimationDuration = 1.5; // seconds
		this.animationComplete = false;
	}

	enter() {
		this.player.velocity.set(0, 0);
		this.player.isVisible = true;
		this.deathAnimationTimer = 0;
		this.player.explode();
		this.animationComplete = false;
		// TODO: Play death sound effect
		// TODO: Start death animation sprite sequence
	}

	update(dt, gameState) {
		// TODO: Update death animation frames
		this.deathAnimationTimer += dt;

		if (this.deathAnimationTimer >= this.deathAnimationDuration) {
			this.animationComplete = true;
			// Game over is handled by PlayState checking player.isDead()
		}

		// No movement or shooting - terminal state
	}

	render(context) {
		// TODO: Render death animation sprite. For now, just render the player sprite
		if (this.player.isVisible) {
			super.render(context);
		}
	}

	isAnimationComplete() {
		return this.animationComplete;
	}
}