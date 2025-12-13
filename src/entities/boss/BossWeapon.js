import Sprite from "../../../lib/Sprite.js";
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

  fire(pattern = BulletPattern.Spread, missile = false) {
    if (missile) {
      projectileFactory.fireBossBullet(
        this.position.x,
        this.position.y,
        this.angle,
        this.target
      );
    } else {
      switch (pattern) {
        case BulletPattern.Spread:
            for (let index = -15; index < 30; index += 3) {
                projectileFactory.fireBossBullet(
                this.position.x,
                this.position.y,
                this.angle + index,
                null
            );
                
            }
          break;
        default:
          projectileFactory.fireBossBullet(
            this.position.x,
            this.position.y,
            this.angle,
            null
          );
          break;
      }
    }
  }
}
