import Entity from '../Entity.js';
import StateMachine from '../../../lib/StateMachine.js';
import Sprite from '../../../lib/Sprite.js';
import AsteroidSize from '../../enums/AsteroidSize.js';
import AsteroidStateName from '../../enums/AsteroidStateName.js';
import AsteroidFloatingState from '../../states/asteroid/AsteroidFloatingState.js';
import AsteroidBreakingState from '../../states/asteroid/AsteroidBreakingState.js';
import AsteroidDestroyedState from '../../states/asteroid/AsteroidDestroyedState.js';
import CollisionLayer from '../../enums/CollisionLayer.js';
import ImageName from '../../enums/ImageName.js';
import SoundName from '../../enums/SoundName.js';
import { DEBUG, images, sounds } from '../../globals.js';

export default class Asteroid extends Entity {
	constructor(x, y, size = AsteroidSize.Medium) {
		const dimensions = Asteroid.getDimensionsForSize(size);
		super(x, y, dimensions.width, dimensions.height);

		// Size and health
		this.asteroidSize = size;
		this.maxHealth = Asteroid.getHealthForSize(size);
		this.currentHealth = this.maxHealth;

		// Movement
		this.velocity.x = (Math.random() - 0.5) * 40;
		this.velocity.y = 50 + Math.random() * 30;

		// Rotation (to also change with vlad hitbox)
		this.rotation = 0;
		this.rotationSpeed = (Math.random() - 0.5) * 2;

		// Combat
		this.damage = 1;

		// Breaking timer
		this.breakDuration = 0.2;
		this.breakTimer = 0;

		// Power-up drop (only small asteroids drop power-ups)
		this.willDropPowerUp = size === AsteroidSize.Small && Math.random() < 0.25;

		// Visual
		this.isVisible = true;

		this.sprites = this.initializeSprites();
		this.currentFrame = 0;

		// Collision
		this.collisionLayer = CollisionLayer.Asteroid;
		this.collisionMask = CollisionLayer.Player | CollisionLayer.PlayerProjectile;

		this.stateMachine = new StateMachine();
		this.initializeStateMachine();
	}

	initializeSprites() {
		const imageName = Asteroid.getImageNameForSize(this.asteroidSize);
		const graphic = images.get(imageName);

		return [
			new Sprite(graphic, 0, 0, graphic.width, graphic.height)
		];
	}

	initializeStateMachine() {
		this.stateMachine.add(AsteroidStateName.Floating, new AsteroidFloatingState(this));
		this.stateMachine.add(AsteroidStateName.Breaking, new AsteroidBreakingState(this));
		this.stateMachine.add(AsteroidStateName.Destroyed, new AsteroidDestroyedState(this));

		this.stateMachine.change(AsteroidStateName.Floating);
	}

	static getDimensionsForSize(size) {
		const sizes = {
			[AsteroidSize.Small]: { width: 24, height: 24 },
			[AsteroidSize.Medium]: { width: 40, height: 40 },
			[AsteroidSize.Large]: { width: 64, height: 64 }
		};
		return sizes[size] || sizes[AsteroidSize.Medium];
	}

	static getHealthForSize(size) {
		const health = {
			[AsteroidSize.Small]: 1,
			[AsteroidSize.Medium]: 2,
			[AsteroidSize.Large]: 3
		};
		return health[size] || 2;
	}

	static getImageNameForSize(size) {
		const imageNames = {
			[AsteroidSize.Small]: ImageName.AsteroidSmall,
			[AsteroidSize.Medium]: ImageName.AsteroidMedium,
			[AsteroidSize.Large]: ImageName.AsteroidLarge
		};
		return imageNames[size] || ImageName.AsteroidMedium;
	}

	static getSmallerSize(size) {
		const smallerSizes = {
			[AsteroidSize.Large]: AsteroidSize.Medium,
			[AsteroidSize.Medium]: AsteroidSize.Small,
			[AsteroidSize.Small]: null
		};
		return smallerSizes[size];
	}

	static getChildCount(size) {
		const counts = {
			[AsteroidSize.Large]: 2,
			[AsteroidSize.Medium]: Math.floor(Math.random() * 2) + 3, // 3-4
			[AsteroidSize.Small]: 0
		};
		return counts[size] || 0;
	}

	update(dt, gameState) {
		this.stateMachine.update(dt, gameState);
	}

	render(context) {
		this.stateMachine.render(context);
	}

	renderSprite(context) {
		if (!this.isVisible) return;

		context.save();
		context.translate(this.position.x, this.position.y);
		context.rotate(this.rotation);

		// Render sprite centered
		this.sprites[this.currentFrame].render(
			-this.dimensions.x / 2,
			-this.dimensions.y / 2
		);

		context.restore();

		if (DEBUG) {
			this.hitbox.render(context)
		}
	}

	hit(damage, gameState) {
		this.currentHealth -= damage;

		// TODO: Play hit sound effect
		// TODO: Spawn hit particles

		if (this.currentHealth <= 0) {
			this.stateMachine.change(AsteroidStateName.Breaking, { gameState });
			sounds.play(SoundName.Collision)
		}
	}

	spawnChildAsteroids(gameState) {
		const smallerSize = Asteroid.getSmallerSize(this.asteroidSize);

		// Small asteroids don't spawn children
		if (!smallerSize || !gameState) return;

		const childCount = Asteroid.getChildCount(this.asteroidSize);
		const centerX = this.position.x + this.dimensions.x / 2;
		const centerY = this.position.y + this.dimensions.y / 2;

		for (let i = 0; i < childCount; i++) {
			// Calculate spread angle for children
			const angle = (Math.PI * 2 / childCount) * i + Math.random() * 0.5;
			const speed = 30 + Math.random() * 40;

			// Offset spawn position slightly from center
			const offsetX = Math.cos(angle) * 10;
			const offsetY = Math.sin(angle) * 10;

			// Create child asteroid
			const childAsteroid = new Asteroid(
				centerX + offsetX,
				centerY + offsetY,
				smallerSize
			);

			// Set velocity to spread outward
			childAsteroid.velocity.x = Math.cos(angle) * speed;
			childAsteroid.velocity.y = Math.sin(angle) * speed + 40; // Bias downward

			// Add to game
			if (gameState.asteroids) {
				gameState.asteroids.push(childAsteroid);
			}
		}
	}

	dropPowerUp(gameState) {
		if (gameState && gameState.factory) {
			const powerUp = gameState.factory.createPowerUp(
				this.position.x + this.dimensions.x / 2 - 12,
				this.position.y + this.dimensions.y / 2 - 12
			);
			if (powerUp) {
				gameState.powerUps.push(powerUp);
			}
		}
	}

	onCollision(other, gameState) {
		if (other.collisionLayer & CollisionLayer.PlayerProjectile) {
			this.hit(other.damage || 1, gameState);
		}
	}
}