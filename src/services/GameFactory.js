import Player from '../entities/player/Player.js';
import PowerUp from '../entities/powerup/Powerup.js';
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
		return 
	}
}