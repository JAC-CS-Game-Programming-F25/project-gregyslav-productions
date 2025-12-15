import Hitbox from "../../../lib/Hitbox.js";
import State from "../../../lib/State.js";
import { getRandomPositiveNumber } from "../../../lib/utilities.js";
import Vector from "../../../lib/Vector.js";
import MechBoss from "../../entities/boss/MechBoss.js";
import Player from "../../entities/player/Player.js";
import BossBullet from "../../entities/projectiles/BossBullet.js";
import PlayerBullet from "../../entities/projectiles/PlayerBullet.js";
import Shield from "../../entities/Shield.js";
import GameStateName from "../../enums/GameStateName.js";
import FontName from "../../enums/FontName.js";
import ImageName from "../../enums/ImageName.js";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  context,
  gameData,
  images,
  input,
  projectileFactory,
  stateMachine,
} from "../../globals.js";
import GameEntityFactory from "../../services/GameFactory.js";
import HealthDisplay from "../../services/HealthDisplay.js";
import ProjectileFactory from "../../services/ProjectileFactory.js";
import Input from "../../../lib/Input.js";
import SaveManager from "../../services/SaveManager.js";

export default class PlayState extends State {
  constructor() {
    super();
    this.scene = null;
    this.player = null;
    this.bosses = [];
    this.factory = new GameEntityFactory();
    this.powerUps = [];
    this.asteroids = [];
    this.healthDisplay = new HealthDisplay(200);
    this.asteroidSpawnTimer = 0;
    this.asteroidSpawnInterval = 2;
  }

  enter(parameters) {
    this.scene = parameters.scene;
    projectileFactory.clear();

    if (parameters.loadSave) {

      let data = SaveManager.load()

      this.player = SaveManager.deserializePlayer(data.player, this.factory);
      this.asteroids = SaveManager.deserializeAsteroids(data.asteroids, this.factory);
      this.powerUps = SaveManager.deserializePowerUps(data.powerUps, this.factory);
      this.bosses = SaveManager.deserializeBosses(data.bosses, this.factory);
      gameData.score = data.score;

    }

    if (this.player === null || this.player === undefined) {
      this.player = this.factory.createPlayer(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT - 100
      );
    }

    for (let index = this.bosses.length; index < gameData.bossCount; index++) {
      this.bosses.push(
        this.factory.createMechBoss(getRandomPositiveNumber(50, CANVAS_WIDTH - 50), 70)
      );
    }
    
    this.healthDisplay.bossMaxHealth = 0;
    this.bosses.forEach((boss) => {
      boss.lockOnTarget(this.player);
      this.healthDisplay.bossMaxHealth += boss.health;
    });
  }

  exit() {}

  update(dt) {
    this.scene.update(dt);
    projectileFactory.update(dt, this, this.player, this.bosses, this.asteroids);
    this.player.update(dt, GameStateName.Play);

    let totalBossHealth = 0;
    this.bosses.forEach((boss) => {
      boss.stateMachine.update(dt);
      totalBossHealth += boss.health
      if (this.player.hitbox.didCollide(boss.hitbox)) {
        this.player.onCollision(boss);
      }
    });
    this.bosses = this.bosses.filter((boss) => boss.isActive);
    if (this.bosses.length === 0) {
      stateMachine.change(GameStateName.Victory, { scene: this.scene });
    } else if (!this.player.isActive) {
      this.bosses = [];
      this.player = this.factory.createPlayer(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT - 100
      );
      stateMachine.change(GameStateName.GameOver, { scene: this.scene });
    }
    
    this.asteroids.forEach(asteroid => {
      asteroid.update(dt, this);
      if (asteroid.hitbox.didCollide(this.player.hitbox)) {
          this.player.onCollision(asteroid);
          asteroid.onCollision(this.player);
      }
    });
    this.powerUps.forEach(powerup => {
      powerup.update(dt);
      if (powerup.hitbox.didCollide(this.player.hitbox)) {
          if (powerup.type === 'screen-clear') {
              this.asteroids.forEach(asteroid => {
                  asteroid.isActive = false;
              });
          }
          this.player.onCollision(powerup);
          powerup.onCollision(this.player);
      }
    });
    this.asteroids = this.asteroids.filter((asteroid) => asteroid.isActive);
    this.powerUps = this.powerUps.filter((powerUp) => powerUp.isActive);

    this.healthDisplay.updateHealthDisplay(this.player.currentHealth, totalBossHealth);
    this.asteroidSpawnTimer += dt;
    if (this.asteroidSpawnTimer >= this.asteroidSpawnInterval) {
      this.asteroidSpawnTimer = 0;
      this.asteroids.push(
        this.factory.createAsteroid(getRandomPositiveNumber(50, CANVAS_WIDTH - 50), -50)
      );
    }

    if(input.isKeyPressed(Input.KEYS.H)) {
      SaveManager.save(this);
    }
  }

  render() {
    this.scene.render();
    this.bosses.forEach((boss) => {
      boss.render(context);
    });
    this.player.render(context);
    this.asteroids.forEach(asteroid => {
      asteroid.render(context);
    });
    this.powerUps.forEach(powerUp => {
      powerUp.render(context);
    });
    this.healthDisplay.render(context);
    this.renderActivePowerUps();
  }

  renderActivePowerUps() {
    const iconSize = 24;
    const iconPadding = 6;
    const contourWidth = 3;
    const startX = 20;
    const startY = CANVAS_HEIGHT - 40;

    let offsetX = 0;

    for (const [type, data] of Object.entries(this.player.activePowerUps)) {
        const iconX = startX + offsetX;
        const iconY = startY;
        const percentage = data.duration / data.maxDuration;

        // Background (dark)
        context.fillStyle = '#333333';
        context.fillRect(iconX, iconY, iconSize, iconSize);

        // Colored fill from bottom, shrinks upward as timer expires
        const fillHeight = iconSize * percentage;
        const fillY = iconY + iconSize - fillHeight;
        context.fillStyle = this.getContourColor(data.duration, data.maxDuration);
        context.fillRect(iconX, fillY, iconSize, fillHeight);

        // Draw power-up sprite
        const graphic = this.getPowerUpGraphic(type);
        if (graphic && graphic.image) {
            context.globalAlpha = 0.9;
            context.drawImage(graphic.image, iconX + 2, iconY + 2, iconSize - 4, iconSize - 4);
            context.globalAlpha = 1;
        }

        // Border
        context.strokeStyle = '#ffffff';
        context.lineWidth = contourWidth;
        context.strokeRect(
            iconX - contourWidth / 2,
            iconY - contourWidth / 2,
            iconSize + contourWidth,
            iconSize + contourWidth
        );

        offsetX += iconSize + iconPadding + contourWidth * 2;
    }
}

  getPowerUpGraphic(type) {
      const imageNames = {
          'rapid-fire': ImageName.RapidFirePowerUp,
          'triple-shot': ImageName.TripleShotPowerUp,
          'shield': ImageName.ShieldPowerUp,
          'speed-boost': ImageName.SpeedPowerUp,
          'screen-clear': ImageName.ScreenClearPowerUp
      };
      const imageName = imageNames[type];
      if (imageName) {
          const graphic = images.get(imageName);
          if (graphic) {
              return graphic;
          }
      }
      return null;
  }

  getContourColor(remaining, max) {
    const percentage = remaining / max;

    if (percentage > 0.5) {
      const progress = (percentage - 0.5) / 0.5;
      const r = Math.floor(255 * (1 - progress));
      const g = 255;
      return `rgb(${r}, ${g}, 0)`;
    } else if (percentage > 0.25) {
      const progress = (percentage - 0.25) / 0.25;
      const g = Math.floor(255 * progress);
      return `rgb(255, ${g}, 0)`;
    } else {
      return 'rgb(255, 0, 0)';
    }
  }

  getIconBackgroundColor(type) {
    const colors = {
      'rapid-fire': '#cc6600',
      'triple-shot': '#cccc00',
      'shield': '#0066cc',
      'speed-boost': '#00cc00',
      'screen-clear': '#cc0000'
    };
    return colors[type] || '#666666';
  }
}