import Entity from './../Entity.js';
import StateMachine from '../../../lib/StateMachine.js';
import PowerUpStateName from '../../enums/PowerUpStateName.js';
import PowerUpSpawningState from '../../states/powerup/PowerUpSpawningState.js';
import PowerUpActiveState from '../../states/powerup/PowerUpActiveState.js';
import PowerUpBlinkingState from '../../states/powerup/PowerUpBlinkingState.js';
import PowerUpCollectedState from '../../states/powerup/PowerUpCollectedState.js';
import PowerUpExpiredState from '../../states/powerup/PowerUpExpiredState.js';
import CollisionLayer from '../../enums/CollisionLayer.js';

export default class PowerUp extends Entity {
	constructor(x, y, type) {
		super(x, y, 24, 24); // TODO: Adjust to sprite size

		// Type
		this.type = type;

		// Movement - slowly floats down
		this.velocity.x = 0;
		this.velocity.y = 50;

		// Timers
		this.lifeDuration = 10; // seconds before expiring
		this.lifeTimer = this.lifeDuration;
		this.spawnTimer = 0;
		this.blinkTimer = 0;

		// Visual
		this.isVisible = true;
		this.sprite = null; // TODO: Set sprite based on type
		this.color = this.getColorForType();

		// Collision
		this.collisionLayer = CollisionLayer.PowerUp;
		this.collisionMask = CollisionLayer.Player;

		// State machine
		this.stateMachine = new StateMachine();
		this.initializeStateMachine();
	}

	/**
	 * Initialize all power-up states.
	 */
	initializeStateMachine() {
		this.stateMachine.add(PowerUpStateName.Spawning, new PowerUpSpawningState(this));
		this.stateMachine.add(PowerUpStateName.Active, new PowerUpActiveState(this));
		this.stateMachine.add(PowerUpStateName.Blinking, new PowerUpBlinkingState(this));
		this.stateMachine.add(PowerUpStateName.Collected, new PowerUpCollectedState(this));
		this.stateMachine.add(PowerUpStateName.Expired, new PowerUpExpiredState(this));

		this.stateMachine.change(PowerUpStateName.Spawning);
	}

	update(dt) {
		this.stateMachine.update(dt);

		// Update hitbox after state machine moves position
		this.hitbox.update(this.position.x, this.position.y);
	}

	render(context) {
		this.stateMachine.render(context);
	}

	updatePosition(dt) {
		this.position.x += this.velocity.x * dt;
		this.position.y += this.velocity.y * dt;
	}

	renderSprite(context) {
		if (!this.isVisible) return;

		if (this.sprite) {
			// TODO: Render actual sprite based on type
			this.sprite.render(context, this.position.x, this.position.y);
		} else {
			// Placeholder - colored rectangle with type initial
			context.fillStyle = this.color;
			context.fillRect(
				this.position.x,
				this.position.y,
				this.dimensions.x,
				this.dimensions.y
			);

			// Draw type initial
			context.fillStyle = 'white';
			context.font = '12px Arial';
			context.textAlign = 'center';
			context.fillText(
				this.type.charAt(0).toUpperCase(),
				this.position.x + this.dimensions.x / 2,
				this.position.y + this.dimensions.y / 2 + 4
			);
		}
	}

	getColorForType() {
		const colors = {
			'rapid-fire': 'orange',
			'triple-shot': 'yellow',
			'shield': 'blue',
			'speed-boost': 'green',
			'screen-clear': 'red'
		};
		return colors[this.type] || 'purple';
	}

	collect() {
		this.stateMachine.change(PowerUpStateName.Collected);
	}

	getEffectDuration() {
		const durations = {
			'rapid-fire': 8,
			'triple-shot': 10,
			'shield': 15,
			'speed-boost': 6,
			'screen-clear': 0 // Instant effect
		};
		return durations[this.type] || 10;
	}

	onCollision(other) {
		if (other.collisionLayer & CollisionLayer.Player) {
			this.collect();
		}
	}
}