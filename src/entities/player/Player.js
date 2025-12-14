import Entity from '../Entity.js';
import StateMachine from '../../../lib/StateMachine.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import PlayerIdleState from '../../states/player/PlayerIdleState.js';
import PlayerMovingState from '../../states/player/PlayerMovingState.js';
import PlayerInvincibleState from '../../states/player/PlayerInvincibleState.js';
import PlayerBuffedState from '../../states/player/PlayerBuffedState.js';
import PlayerDeadState from '../../states/player/PlayerDeadState.js';
import CollisionLayer from '../../enums/CollisionLayer.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, timer } from '../../globals.js';
import { images } from '../../globals.js';
import ImageName from '../../enums/ImageName.js';
import Vector from '../../../lib/Vector.js';
import Weapon from '../boss/Weapon.js';
import PlayerWeapon from './PlayerWeapon.js';
import Sprite from '../../../lib/Sprite.js';
import Shield from '../Shield.js';

const SCALE = 0.3;
const WEAPON_OFFSET = {
	x: 0,
	y: 11 * SCALE
}

export default class Player extends Entity {
	constructor(x, y) {
		super(x, y, 82 * SCALE, 66 * SCALE, 0);

		this.sprites = [
			new Sprite(
			images.get(ImageName.PlayerShip),
			0,
			0,
			82,
			66
			)
		]
		this.scale = new Vector(SCALE, SCALE);
		this.weapon = new PlayerWeapon(this.position.x, this.position.y + WEAPON_OFFSET.y, 26 * SCALE, 26 * SCALE, 0)

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
		this.color = 'cyan'; // Placeholder color
		this.animationComplete = false;

		// Power-ups
		this.activePowerUps = {};

		// Collision
		this.collisionLayer = CollisionLayer.Player;
		this.collisionMask = CollisionLayer.BossProjectile | CollisionLayer.Asteroid | CollisionLayer.PowerUp;

		this.shield = new Shield(this.position.x, this.position.y, this.dimensions.x, this.dimensions.y, this.angle);
		this.shield.isVisible = false;

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
		super.update(dt);
		this.stateMachine.update(dt, gameState);
		this.weapon.updatePosAndRotation(this.position.x, this.position.y + WEAPON_OFFSET.y, 26 * SCALE, 26 * SCALE, 0)
		this.weapon.update(dt);
		this.shield.updateLocation(this.position.x, this.position.y, this.angle);
		this.shield.update(dt);
		
		// Update hitbox after state machine moves position
		//this.hitbox.update(this.position.x, this.position.y);
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
		this.weapon.render(context);
		this.shield.render(context);
	}

	shoot(gameState) {
		// TODO: Implement when Projectile class is added
		this.weapon.fire(true, true);
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
		} else if (other.collisionLayer & (CollisionLayer.BossProjectile | CollisionLayer.Asteroid | CollisionLayer.Boss)) {
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

	explode() {
        if (this.animationComplete) {
            return;
        }
        this.animationComplete = true;

        this.scale = new Vector(0.5, 0.5)
        this.dimensions.x = 98.2 * this.scale.x
        this.dimensions.y = 95.4 * this.scale.y
		this.weapon.isVisible = false;

        this.sprites = [
            new Sprite(images.get(ImageName.Explosion), 0, 0, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 98.2, 0, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 196.4, 0, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 294.6, 0, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 392.8, 0, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 0, 95.4, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 98.2, 95.4, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 196.4, 95.4, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 294.6, 95.4, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 392.8, 95.4, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 0, 190.8, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 98.2, 190.8, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 196.4, 190.8, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 294.6, 190.8, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 392.8, 190.8, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 0, 286.2, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 98.2, 286.2, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 196.4, 286.2, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 294.6, 286.2, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 392.8, 286.2, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 0, 381.6, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 98.2, 381.6, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 196.4, 381.6, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 294.6, 381.6, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 392.8, 381.6, 98.2, 95.4),
        ];

        timer.addTask(() => { 
            if (this.currentFrame < this.sprites.length - 1) {
                this.currentFrame += 1
            }
        }, 0.5/25, 1, () => {this.isActive = false;})
    }
}