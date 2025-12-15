import Sprite from "../../../lib/Sprite.js";
import { getRandomNumber } from "../../../lib/utilities.js";
import Vector from "../../../lib/Vector.js";
import BulletPattern from "../../enums/BulletPattern.js";
import ImageName from "../../enums/ImageName.js";
import SoundName from "../../enums/SoundName.js";
import { images, projectileFactory, sounds } from "../../globals.js";
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

  fire(burstSize = 1, pattern = BulletPattern.Random, missile = false) {
    if (this.attackStack.length > 0) {
      return;
    }

    for (let index = 0; index < burstSize; index++) {
      if (missile) {
        this.attackStack.push({
          action: () => {
            projectileFactory.fireBossMissile(
              this.position.x,
              this.position.y,
              this.angle + getRandomNumber(-10, 10),
              this.target
            )
            sounds.play(SoundName.BossMissileFire)
          },
          delay: 0.1,
        });
      } else {
        switch (pattern) {
          case BulletPattern.Random:
            this.attackStack.push({
              action: () => {
                projectileFactory.fireBossBullet(
                  this.position.x,
                  this.position.y,
                  this.angle + getRandomNumber(-15, 15),
                  null
                )
                sounds.play(SoundName.BossFire)
              },
              delay: 0.02,
            });
            break;
          case BulletPattern.Wave:
            for (let index = -15; index < 30; index += 5) {
              this.attackStack.push({
                action: () => {
                  projectileFactory.fireBossBullet(
                    this.position.x,
                    this.position.y,
                    this.angle + index,
                    null
                  )
                sounds.play(SoundName.BossFire)
                },
                delay: 0.05,
              });
            }
            for (let index = -15; index < 30; index += 5) {
              this.attackStack.push({
                action: () => {
                  projectileFactory.fireBossBullet(
                    this.position.x,
                    this.position.y,
                    this.angle - index,
                    null
                  )
                sounds.play(SoundName.BossFire)
                },
                delay: 0.05,
              });
            }
            break;
          case BulletPattern.Spread:
            for (let index = -15; index < 30; index += 3) {
              this.attackStack.push({
                action: () => {
                  projectileFactory.fireBossBullet(
                    this.position.x,
                    this.position.y,
                    this.angle + index,
                    null
                  )
                sounds.play(SoundName.BossFire)
                },
                delay: 0.1,
              });
            }
            break;
          default:
            this.attackStack.push({
              action: () => {
                projectileFactory.fireBossBullet(
                  this.position.x,
                  this.position.y,
                  this.angle,
                  null
                )
                sounds.play(SoundName.BossFire)
              },
              delay: 0.03,
            });
            break;
        }
      }
    }
  }
}
