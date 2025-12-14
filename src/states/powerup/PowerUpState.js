import StateMachine from '../../../lib/StateMachine.js';
import Vector from '../../../lib/Vector.js';
import Hitbox from '../../../lib/Hitbox.js';
import PowerUpStateName from '../../enums/PowerUpStateName.js';
import PowerUpSpawningState from '../../states/powerup/PowerUpSpawningState.js';
import PowerUpActiveState from '../../states/powerup/PowerUpActiveState.js';
import PowerUpBlinkingState from '../../states/powerup/PowerUpBlinkingState.js';
import PowerUpCollectedState from '../../states/powerup/PowerUpCollectedState.js';
import PowerUpExpiredState from '../../states/powerup/PowerUpExpiredState.js';
import CollisionLayer from '../../enums/CollisionLayer.js';

export default class PowerUpState {
	constructor(x, y, type) {
		// Position and movement
		this.position = new Vector(x, y);
		this.velocity = new Vector(0, 50); // Slowly floats down
		this.dimensions = new Vector(24, 24); // TODO: Adjust to sprite size

		// Type
		this.type = type;

		// Timers
		this.lifeDuration = 10; // seconds before expiring
		this.lifeTimer = this.lifeDuration;
		this.spawnTimer = 0;
		this.blinkTimer = 0;

		// State
		this.isActive = true;
		this.isVisible = true;

		// Visual
		this.sprite = null; // TODO: Set sprite based on type

		// Collision
		this.hitbox = new Hitbox(
			this.position.x,
			this.position.y,
			this.dimensions.x,
			this.dimensions.y
		);
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
	}

	render(context) {
		this.stateMachine.render(context);
	}

	updatePosition(dt) {
		this.position.x += this.velocity.x * dt;
		this.position.y += this.velocity.y * dt;

		// Update hitbox
		this.hitbox.update(this.position.x, this.position.y);
	}

	renderSprite(context) {
		if (!this.isVisible) return;

		if (this.sprite) {
			// TODO: Render actual sprite based on type
			this.sprite.render(context, this.position.x, this.position.y);
		} else {
			// Placeholder - different colors for different types
			context.fillStyle = this.getColorForType();
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
		// TODO: Replace with actual sprites
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
		// TODO: Different durations per type
		const durations = {
			'rapid-fire': 8,
			'triple-shot': 10,
			'shield': 15,
			'speed-boost': 6,
			'screen-clear': 0 
		};
		return durations[this.type] || 10;
	}
}