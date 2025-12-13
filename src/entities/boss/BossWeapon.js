import Sprite from "../../../lib/Sprite.js";
import { getRandomNumber } from "../../../lib/utilities.js";
import Vector from "../../../lib/Vector.js";
import BulletPattern from "../../enums/BulletPattern.js";
import ImageName from "../../enums/ImageName.js";
import { images, projectileFactory } from "../../globals.js";
import Weapon from "./Weapon.js";

export default class BossWeapon extends Weapon {
  constructor(x, y, width, height, angle) {
    let weaponsprite = new Sprite(
      images.get(ImageName.BossMissileWeapon),
      0,
      0,
      64,
      64
    );
    super(x, y, width, height, angle, weaponsprite);
    this.scale = new Vector(width / 64, height / 64);
  }

  fire(pattern = BulletPattern.Random, missile = false) {
    if (this.attackQueue.length > 0) {
        return;
    }
    
    if (missile) {
      projectileFactory.fireBossMissile(
        this.position.x,
        this.position.y,
        this.angle,
        this.target
      );
    } else {
      switch (pattern) {
        case BulletPattern.Random:
          this.attackQueue.push({
            action: () =>
              projectileFactory.fireBossBullet(
                this.position.x,
                this.position.y,
                this.angle + getRandomNumber(-15, 15),
                null
              ),
            delay: 0.02,
          });
          break;
        case BulletPattern.Wave:
          for (let index = -15; index < 30; index += 5) {
            this.attackQueue.push({
              action: () =>
                projectileFactory.fireBossBullet(
                  this.position.x,
                  this.position.y,
                  this.angle + index,
                  null
                ),
              delay: 0.05,
            });
          }
          for (let index = -15; index < 30; index += 5) {
            this.attackQueue.push({
              action: () =>
                projectileFactory.fireBossBullet(
                  this.position.x,
                  this.position.y,
                  this.angle - index,
                  null
                ),
              delay: 0.05,
            });
          }
          break;
        case BulletPattern.Spread:
          for (let index = -15; index < 30; index += 3) {
            this.attackQueue.push({
              action: () =>
                projectileFactory.fireBossBullet(
                  this.position.x,
                  this.position.y,
                  this.angle + index,
                  null
                ),
              delay: 0.1,
            });
          }
          break;
        default:
          this.attackQueue.push({
            action: () =>
              projectileFactory.fireBossBullet(
                this.position.x,
                this.position.y,
                this.angle,
                null
              ),
            delay: 0.03,
          });
          break;
      }
    }
  }
}
