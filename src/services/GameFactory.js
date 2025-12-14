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

	createAsteroid(x, y) {
		return new Asteroid(x, y, AsteroidSize[Math.floor(Math.random() * Object.keys(AsteroidSize).length)])
	}

	createPowerUp(x, y) {
		return new PowerUp(x, y, PowerUpType.SpeedBoost)
	}
}