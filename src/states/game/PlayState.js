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
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  context,
  gameData,
  input,
  projectileFactory,
  stateMachine,
} from "../../globals.js";
import GameEntityFactory from "../../services/GameFactory.js";
import ProjectileFactory from "../../services/ProjectileFactory.js";

export default class PlayState extends State {
  constructor() {
    super();
    this.scene = null;
    this.player = null;
    this.bosses = [];
    this.factory = new GameEntityFactory();
    this.powerUps = [];
    this.asteroids = [];
  }

  enter(parameters) {
    this.scene = parameters.scene;
    projectileFactory.clear();
    this.player = this.factory.createPlayer(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT - 100
    );
	this.bosses = [];
    for (let index = 0; index < gameData.bossCount; index++) {
      this.bosses.push(
        this.factory.createMechBoss(getRandomPositiveNumber(50, CANVAS_WIDTH - 50), 70)
      );
    }

    this.bosses.forEach((boss) => {
      boss.lockOnTarget(this.player);
    });

    

    this.asteroids.push(this.factory.createAsteroid(getRandomPositiveNumber(50, CANVAS_WIDTH - 50)), -50);
  }

  exit() {}

  update(dt) {
    this.scene.update(dt);
    projectileFactory.update(dt, this.player, this.bosses);
    this.player.update(dt, GameStateName.Play);
    this.bosses.forEach((boss) => {
      boss.stateMachine.update(dt);
      if (this.player.hitbox.didCollide(boss.hitbox)) {
        this.player.onCollision(boss);
      }
    });

    this.bosses = this.bosses.filter((boss) => boss.isActive);

    if (this.bosses.length === 0) {
      stateMachine.change(GameStateName.Victory, { scene: this.scene });
    } else if (!this.player.isActive) {
      stateMachine.change(GameStateName.GameOver, { scene: this.scene });
    }
    
    this.asteroids.forEach(asteroid => {
      asteroid.update(dt, GameStateName.Play);
    });
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
  }
}
