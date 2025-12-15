import Asteroid from '../entities/asteroid/Asteroid.js';
import MechBoss from '../entities/boss/MechBoss.js';
import Player from '../entities/player/Player.js';
import PowerUp from '../entities/powerup/PowerUp.js';
import AsteroidSize from '../enums/AsteroidSize.js';
import PowerUpType from '../enums/PowerUpType.js';
/**
 * Factory pattern for creating game entities
 */
export default class GameEntityFactory {
	createPlayer(x, y) {
		return new Player(x, y);
	}

	createPowerUp(x, y, type = null) {
		return new PowerUp(x, y, type);
	}

	createMechBoss(x, y) {
		return new MechBoss(x, y, 200)
	}

	createPowerUp(x, y, type = null) {
		const powerUpType = type || this.getRandomPowerUpType();
		return new PowerUp(x, y, powerUpType);
	}

	getRandomPowerUpType() {
		const types = Object.values(PowerUpType);
		return types[Math.floor(Math.random() * types.length)];
	}

	createAsteroid(x, y, size = null) {
		const asteroidSize = size || this.getRandomAsteroidSize();
		return new Asteroid(x, y, asteroidSize);
	}

	getRandomAsteroidSize() {
		const rand = Math.random();
		if (rand < 0.5) return AsteroidSize.Small;
		if (rand < 0.85) return AsteroidSize.Medium;
		return AsteroidSize.Large;
	}
}