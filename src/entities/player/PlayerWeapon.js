import Sprite from "../../../lib/Sprite.js";
import Vector from "../../../lib/Vector.js";
import ImageName from "../../enums/ImageName.js";
import { images, projectileFactory } from "../../globals.js";
import Weapon from "../boss/Weapon.js";

export default class PlayerWeapon extends Weapon {
  constructor(x, y, width, height, angle) {
    let weaponsprite = new Sprite(
      images.get(ImageName.PlayerWeapon),
      0,
      0,
      26,
      26
    );
    super(x, y, width, height, angle, weaponsprite);
    this.scale = new Vector(width / 26, height / 26);
  }

  update(dt) {
    this.target = { position: new Vector(this.position.x, this.position.y - 10) }
    
    super.update(dt);
  }

  fire(triple = true, rapid = true) {
    if (this.attackQueue.length > 0) {
        return;
    }


    let delay = rapid ? 0.05 : 0.1;

    if (triple) {
      for (let index = -20; index < 21; index += 20) {
        this.attackQueue.push({
          action: () => 
            projectileFactory.firePlayerBullet(
              this.position.x,
              this.position.y,
              this.angle + index,
              false,
              false
            ),
          delay: index === 20 ? delay : 0,
        });
      }
    } else {
      this.attackQueue.push({
        action: () => 
          projectileFactory.firePlayerBullet(
            this.position.x,
            this.position.y,
            this.angle,
            false,
            false
          ),
        delay: delay,
      });
    }
  }
}
