import Boss from "./Boss.js";
import Sprite from "../../../lib/Sprite.js";
import Hitbox from "../../../lib/Hitbox.js";
import ImageName from "../../enums/ImageName.js";
import { images, projectileFactory, sounds, timer } from "../../globals.js";
import Weapon from "./Weapon.js";
import Vector from "../../../lib/Vector.js";
import BossWeapon from "./BossWeapon.js";
import BulletPattern from "../../enums/BulletPattern.js";
import {
  getRandomNumber,
  getRandomPositiveNumber,
} from "../../../lib/utilities.js";
import Shield from "../Shield.js";
import Easing from "../../../lib/Easing.js";
import SoundName from "../../enums/SoundName.js";

const MECH_BOSS_WEAPON_OFFSET_FROM_CENTER = { x: 88, y: -27 };
const SCALE = 0.3;
const BASE_ATTACK_COOLDOWN = 2;

export default class MechBoss extends Boss {
  constructor(x, y, health) {
    let sprite = new Sprite(images.get(ImageName.BossShip), 0, 0, 288, 384);
    super(x, y, 288 * SCALE, 384 * SCALE, 180, "Mech Boss", health, 200);
    this.scale = new Vector(SCALE, SCALE);
    this.sprites = [sprite];
    this.attackCooldown = BASE_ATTACK_COOLDOWN;

    this.leftWeapon = new BossWeapon(
      this.position.x - MECH_BOSS_WEAPON_OFFSET_FROM_CENTER.x * SCALE,
      this.position.y - MECH_BOSS_WEAPON_OFFSET_FROM_CENTER.y * SCALE,
      64 * SCALE,
      64 * SCALE,
      0
    );
    this.rightWeapon = new BossWeapon(
      this.position.x + MECH_BOSS_WEAPON_OFFSET_FROM_CENTER.x * SCALE,
      this.position.y - MECH_BOSS_WEAPON_OFFSET_FROM_CENTER.y * SCALE,
      64 * SCALE,
      64 * SCALE,
      0
    );
    this.target = null;

    this.shield = new Shield(
      this.position.x,
      this.position.y,
      this.dimensions.x,
      this.dimensions.y,
      this.angle
    );
    this.shield.isVisible = false;

    this.shieldMode = false;
  }

  executeAttack() {
    if (
      this.target === null ||
      this.target === undefined ||
      this.attackCooldown > 0
    ) {
      return;
    }
    //sounds.play(SoundName.BossAbilityAlarm)
    this.actionDone = false;
    let num = getRandomNumber(0, 10);
    if (num < 5) {
      this.laserBarrage();
    } else if (num < 8) {
      this.shieldBash();
    } else {
      this.missileSwarm();
    }
    this.attackCooldown = BASE_ATTACK_COOLDOWN;
  }

  checkWeaponDone() {
    if (
      this.leftWeapon.isDoneFiring() &&
      this.rightWeapon.isDoneFiring() &&
      !this.shieldMode
    ) {
      this.actionDone = true;
    }
  }

  onPhaseChange(newPhase) {}

  onDefeat() {}

  laserBarrage() {
    this.leftWeapon.fire(15, BulletPattern.Random, false);
    this.rightWeapon.fire(15, BulletPattern.Random, false);
  }

  missileSwarm() {
    this.leftWeapon.fire(2, BulletPattern.Straight, true);
    this.rightWeapon.fire(2, BulletPattern.Straight, true);
  }

  shieldBash() {
    if (this.shieldMode) {
      return;
    }
    this.shield.isVisible = true;
    this.shieldMode = true;
    this.invincible = true;
    let currPosX = this.position.x;
    let currPosY = this.position.y;
    let deltax = Math.abs(this.target.position.x - this.position.x);
    let deltay = Math.abs(this.target.position.y - this.position.y);
    let distance = Math.sqrt(deltax * deltax + deltay * deltay);
    let duration = distance / this.speed;

    timer.tween(
      this.position,
      {
        x: this.target.position.x,
        y: this.target.position.y,
      },
      duration,
      Easing.linear,
      () => {
        this.invincible = false;
        this.shield.isVisible = false;
        timer.tween(
          this.position,
          {
            x: currPosX,
            y: currPosY,
          },
          duration,
          Easing.linear,
          () => {
            this.actionDone = true;
            this.shieldMode = false;
          }
        );
      }
    );
  }

  lockOnTarget(target) {
    this.target = target;
    this.leftWeapon.newTarget(this.target);
    this.rightWeapon.newTarget(this.target);
  }

  update(dt) {
    super.update(dt);
    let sin = Math.sin(this.angle * (Math.PI / 180));
    let cos = Math.cos(this.angle * (Math.PI / 180));

    let xoffset = MECH_BOSS_WEAPON_OFFSET_FROM_CENTER.x * SCALE;
    let yoffset = MECH_BOSS_WEAPON_OFFSET_FROM_CENTER.y * SCALE;

    this.leftWeapon.updatePosAndRotation(
      this.position.x + (xoffset * cos - yoffset * sin),
      this.position.y + (xoffset * sin + yoffset * cos),
      this.angle
    );
    this.leftWeapon.update(dt);
    this.rightWeapon.updatePosAndRotation(
      this.position.x + (-1 * xoffset * cos - yoffset * sin),
      this.position.y + (-1 * xoffset * sin + yoffset * cos),
      this.angle
    );
    this.rightWeapon.update(dt);

    if (this.attackCooldown > 0) {
      this.attackCooldown -= dt;
    }

    this.shield.updateLocation(this.position.x, this.position.y, this.angle);
    this.shield.update(dt);
  }

  render(context) {
    super.render(context);
    projectileFactory.render(context);
    if (this.exploding) {
      return;
    }
    this.leftWeapon.render(context);
    this.rightWeapon.render(context);
    this.shield.render(context);
  }

  explode() {
    this.shield.isVisible = false;
    sounds.play(SoundName.BossDeath)
    this.scale = new Vector(2, 2);
    this.dimensions.x = 98.2 * this.scale.x;
    this.dimensions.y = 95.4 * this.scale.y;
    super.explode();
  }

  onCollision(other) {
    if (this.invincible) {
      return;
    }
    super.onCollision(other);
  }
}
