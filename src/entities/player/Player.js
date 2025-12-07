import Entity from './Entity.js';
import StateMachine from '../../lib/StateMachine.js';
import PlayerStateName from '../enums/PlayerStateName.js';
import PlayerIdleState from '../states/player/PlayerIdleState.js';
import PlayerMovingState from '../states/player/PlayerMovingState.js';
import PlayerInvincibleState from '../states/player/PlayerInvincibleState.js';
import PlayerBuffedState from '../states/player/PlayerBuffedState.js';
import PlayerDeadState from '../states/player/PlayerDeadState.js';
import CollisionLayer from '../enums/CollisionLayer.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../globals.js';

export default class Player extends Entity {
	constructor(x, y) {
		super(x, y, 32, 32); // TODO: Adjust to sprite size

		// Movement
		this.speed = 200;

		// Combat
		this.maxHealth = 3;
		this.currentHealth = this.maxHealth;
		this.fireRate = 0.2; // seconds between shots
		this.fireTimer = 0;
		this.aimDirection = { x: 0, y: -1 }; // Default: shoot upward

		// Invincibility
		this.isInvincible = false;
		this.invincibleDuration = 1.5; // seconds
		this.invincibleTimer = 0;
		this.flashTimer = 0;

		// Visual
		this.isVisible = true;
		this.sprite = null; // TODO: Set player sprite
		this.color = 'cyan'; // Placeholder color

		// Power-ups
		this.activePowerUps = {};

		// Collision
		this.collisionLayer = CollisionLayer.Player;
		this.collisionMask = CollisionLayer.BossProjectile | CollisionLayer.Asteroid | CollisionLayer.PowerUp;

		// State machine
		this.stateMachine = new StateMachine();
		this.initializeStateMachine();
	}

	/**
	 * Initialize all player states.
	 */
	initializeStateMachine() {
		this.stateMachine.add(PlayerStateName.Idle, new PlayerIdleState(this));
		this.stateMachine.add(PlayerStateName.Moving, new PlayerMovingState(this));
		this.stateMachine.add(PlayerStateName.Invincible, new PlayerInvincibleState(this));
		this.stateMachine.add(PlayerStateName.Buffed, new PlayerBuffedState(this));
		this.stateMachine.add(PlayerStateName.Dead, new PlayerDeadState(this));

		this.stateMachine.change(PlayerStateName.Idle);
	}

	update(dt, gameState) {
		this.stateMachine.update(dt, gameState);
		
		// Update hitbox after state machine moves position
		this.hitbox.update(this.position.x, this.position.y);
	}

	render(context) {
		this.stateMachine.render(context);
	}

	/**
	 * Render the player sprite.
	 */
	renderSprite(context) {
		if (this.sprite) {
			// TODO: Render actual sprite
			this.sprite.render(context, this.position.x, this.position.y);
		} else {
			// Use Entity's placeholder rendering
			super.render(context);
		}
	}

	shoot(gameState) {
		// TODO: Implement when Projectile class is added
	}

	/**
	 * Called when player takes damage.
	 */
	takeDamage(amount) {
		if (this.isInvincible) {
			return;
		}

		this.currentHealth -= amount;

		// TODO: Play damage sound effect
		// TODO: Screen shake effect or something

		if (this.currentHealth <= 0) {
			this.currentHealth = 0;
			this.stateMachine.change(PlayerStateName.Dead);
		} else {
			this.isInvincible = true;
			this.stateMachine.change(PlayerStateName.Invincible);
		}
	}

	/**
	 * Check if player is dead.
	 */
	isDead() {
		return this.currentHealth <= 0;
	}

	/**
	 * Apply a power-up to the player.
	 */
	applyPowerUp(type, duration) {
		this.activePowerUps[type] = {
			duration: duration,
			maxDuration: duration
		};

		// TODO: Apply stat modifications based on type

		if (this.stateMachine.currentStateName !== PlayerStateName.Invincible &&
			this.stateMachine.currentStateName !== PlayerStateName.Dead) {
			this.stateMachine.change(PlayerStateName.Buffed);
		}
	}

	/**
	 * Remove a power-up from the player.
	 */
	removePowerUp(type) {
		// TODO: Revert stat modifications based on type
		delete this.activePowerUps[type];
	}

	/**
	 * Handle collision with another entity.
	 */
	onCollision(other) {
		if (other.collisionLayer & CollisionLayer.PowerUp) {
			other.collect();
			this.applyPowerUp(other.type, other.getEffectDuration());
		} else if (other.collisionLayer & (CollisionLayer.BossProjectile | CollisionLayer.Asteroid)) {
			this.takeDamage(other.damage || 1);
		}
	}

	/**
	 * Reset player to initial state (for new game).
	 */
	reset() {
		this.currentHealth = this.maxHealth;
		this.isInvincible = false;
		this.activePowerUps = {};
		this.position.x = CANVAS_WIDTH / 2 - this.dimensions.x / 2;
		this.position.y = CANVAS_HEIGHT - 100;
		this.velocity.x = 0;
		this.velocity.y = 0;
		this.stateMachine.change(PlayerStateName.Idle);
	}
}