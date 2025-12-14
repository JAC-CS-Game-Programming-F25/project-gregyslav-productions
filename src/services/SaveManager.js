import AsteroidSize from '../enums/AsteroidSize.js';

export default class SaveManager {
	static SAVE_KEY = 'space_raider_save';
	static HIGH_SCORE_KEY = 'space_raider_high_score';

	static save(gameState) {
		const saveData = {
			timestamp: Date.now(),
			player: SaveManager.serializePlayer(gameState.player),
			asteroids: SaveManager.serializeAsteroids(gameState.asteroids),
			powerUps: SaveManager.serializePowerUps(gameState.powerUps),
			bosses: SaveManager.serializeBosses(gameState.bosses), // TODO: implement when Boss class exists
			playerBullets: SaveManager.serializeProjectiles(gameState.playerBullets), // TODO: implement when Projectile class exists
			bossBullets: SaveManager.serializeProjectiles(gameState.bossBullets), // TODO: implement when Projectile class exists
			score: gameState.score,
			isPaused: gameState.isPaused
		};

		try {
			localStorage.setItem(SaveManager.SAVE_KEY, JSON.stringify(saveData));
			return true;
		} catch (e) {
			console.error('Failed to save game:', e);
			return false;
		}
	}

	static load() {
		try {
			const data = localStorage.getItem(SaveManager.SAVE_KEY);
			if (!data) return null;
			return JSON.parse(data);
		} catch (e) {
			console.error('Failed to load game:', e);
			return null;
		}
	}

	static hasSave() {
		return localStorage.getItem(SaveManager.SAVE_KEY) !== null;
	}

	static deleteSave() {
		localStorage.removeItem(SaveManager.SAVE_KEY);
	}

	static saveHighScore(score) {
		const currentHigh = SaveManager.getHighScore();
		if (score > currentHigh) {
			localStorage.setItem(SaveManager.HIGH_SCORE_KEY, score.toString());
			return true;
		}
		return false;
	}

	static getHighScore() {
		const score = localStorage.getItem(SaveManager.HIGH_SCORE_KEY);
		return score ? parseInt(score, 10) : 0;
	}

	static serializePlayer(player) {
		if (!player) return null;
		return {
			x: player.position.x,
			y: player.position.y,
			velocityX: player.velocity.x,
			velocityY: player.velocity.y,
			currentHealth: player.currentHealth,
			maxHealth: player.maxHealth,
			isInvincible: player.isInvincible,
			invincibleTimer: player.invincibleTimer,
			flashTimer: player.flashTimer,
			fireTimer: player.fireTimer,
			activePowerUps: { ...player.activePowerUps },
			stateName: player.stateMachine?.currentStateName || 'idle'
		};
	}

	static serializeAsteroids(asteroids) {
		if (!asteroids) return [];
		return asteroids.filter(a => a && a.isActive).map(asteroid => ({
			x: asteroid.position.x,
			y: asteroid.position.y,
			velocityX: asteroid.velocity.x,
			velocityY: asteroid.velocity.y,
			asteroidSize: asteroid.asteroidSize,
			currentHealth: asteroid.currentHealth,
			maxHealth: asteroid.maxHealth,
			rotation: asteroid.rotation,
			rotationSpeed: asteroid.rotationSpeed,
			willDropPowerUp: asteroid.willDropPowerUp,
			stateName: asteroid.stateMachine?.currentStateName || 'floating'
		}));
	}

	static serializePowerUps(powerUps) {
		if (!powerUps) return [];
		return powerUps.filter(p => p && p.isActive).map(powerUp => ({
			x: powerUp.position.x,
			y: powerUp.position.y,
			velocityX: powerUp.velocity.x,
			velocityY: powerUp.velocity.y,
			type: powerUp.type,
			lifeTimer: powerUp.lifeTimer,
			lifeDuration: powerUp.lifeDuration,
			stateName: powerUp.stateMachine?.currentStateName || 'active'
		}));
	}

	static serializeBosses(bosses) {
		// TODO: implement when Boss class exists
	}

	static serializeProjectiles(projectiles) {
		// TODO: implement when Projectile class exists
	}

	static deserializeToGameState(saveData, factory) {
		if (!saveData) return null;

		return {
			player: SaveManager.deserializePlayer(saveData.player, factory),
			asteroids: SaveManager.deserializeAsteroids(saveData.asteroids, factory),
			powerUps: SaveManager.deserializePowerUps(saveData.powerUps, factory),
			bosses: SaveManager.deserializeBosses(saveData.bosses, factory), // TODO: implement when Boss class exists
			playerBullets: SaveManager.deserializeProjectiles(saveData.playerBullets, factory, 'player'), // TODO: implement when Projectile class exists
			bossBullets: SaveManager.deserializeProjectiles(saveData.bossBullets, factory, 'boss'), // TODO: implement when Projectile class exists
			score: saveData.score || 0,
			isPaused: saveData.isPaused || false
		};
	}

	static deserializePlayer(data, factory) {
		if (!data) return null;
		const player = factory.createPlayer(data.x, data.y);
		player.velocity.x = data.velocityX || 0;
		player.velocity.y = data.velocityY || 0;
		player.currentHealth = data.currentHealth;
		player.maxHealth = data.maxHealth;
		player.isInvincible = data.isInvincible;
		player.invincibleTimer = data.invincibleTimer || 0;
		player.flashTimer = data.flashTimer || 0;
		player.fireTimer = data.fireTimer || 0;
		player.activePowerUps = { ...data.activePowerUps };
		if (data.stateName && player.stateMachine) {
			player.stateMachine.change(data.stateName);
		}
		return player;
	}

	static deserializeAsteroids(dataArray, factory) {
		if (!dataArray) return [];
		return dataArray.map(data => {
			const asteroid = factory.createAsteroid(data.x, data.y, data.asteroidSize);
			asteroid.velocity.x = data.velocityX;
			asteroid.velocity.y = data.velocityY;
			asteroid.currentHealth = data.currentHealth;
			asteroid.maxHealth = data.maxHealth;
			asteroid.rotation = data.rotation;
			asteroid.rotationSpeed = data.rotationSpeed;
			asteroid.willDropPowerUp = data.willDropPowerUp;
			if (data.stateName && asteroid.stateMachine) {
				asteroid.stateMachine.change(data.stateName);
			}
			return asteroid;
		});
	}

	static deserializePowerUps(dataArray, factory) {
		if (!dataArray) return [];
		return dataArray.map(data => {
			const powerUp = factory.createPowerUp(data.x, data.y, data.type);
			powerUp.velocity.x = data.velocityX || 0;
			powerUp.velocity.y = data.velocityY || 50;
			powerUp.lifeTimer = data.lifeTimer;
			powerUp.lifeDuration = data.lifeDuration || 10;
			if (data.stateName && powerUp.stateMachine) {
				powerUp.stateMachine.change(data.stateName);
			}
			return powerUp;
		});
	}

	static deserializeBosses(dataArray, factory) {
		// TODO: implement when Boss class exists
	}

	static deserializeProjectiles(dataArray, factory, owner) {
		// TODO: implement when Projectile class exists
	}
}