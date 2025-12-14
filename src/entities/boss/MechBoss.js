import Boss from "./Boss.js";
import Sprite from "../../../lib/Sprite.js";
import Hitbox from "../../../lib/Hitbox.js";
import ImageName from "../../enums/ImageName.js";
import { images, projectileFactory } from "../../globals.js";
import Weapon from "./Weapon.js";
import Vector from "../../../lib/Vector.js";
import BossWeapon from "./BossWeapon.js";
import BulletPattern from "../../enums/BulletPattern.js";
import { getRandomNumber, getRandomPositiveNumber } from "../../../lib/utilities.js";

const MECH_BOSS_WEAPON_OFFSET_FROM_CENTER = { x: 88, y: -27 };
const SCALE = 0.3;
const BASE_ATTACK_COOLDOWN = 2;

export default class MechBoss extends Boss {
    constructor(x, y, health, attackPatterns) {
        let sprite = new Sprite(
            images.get(ImageName.BossShip),
            0,
            0,
            288,
            384
        );
        super(x, y, 288 * SCALE, 384 * SCALE, 180, "Mech Boss", health, 200);
        this.scale = new Vector(SCALE, SCALE);
        this.sprites = [
            sprite
        ]
        this.attackPatterns = attackPatterns;

        this.attackCooldown = BASE_ATTACK_COOLDOWN;
        
        this.leftWeapon = new BossWeapon(this.position.x - (MECH_BOSS_WEAPON_OFFSET_FROM_CENTER.x * SCALE), this.position.y - (MECH_BOSS_WEAPON_OFFSET_FROM_CENTER.y * SCALE), 64 * SCALE, 64 * SCALE, 0);
        this.rightWeapon = new BossWeapon(this.position.x + (MECH_BOSS_WEAPON_OFFSET_FROM_CENTER.x * SCALE), this.position.y - (MECH_BOSS_WEAPON_OFFSET_FROM_CENTER.y * SCALE), 64 * SCALE, 64 * SCALE, 0);
        this.target = null;
    }

    executeAttack() {
        if (this.target === null || this.target === undefined || this.attackCooldown > 0) {
            return;
        }
        this.actionDone = false;
        if (getRandomNumber(0, 10) > 4) {
            this.laserBarrage()
        } else {
            this.missileSwarm()
        }
        this.attackCooldown = BASE_ATTACK_COOLDOWN
    }

    checkWeaponDone() {
        if (this.leftWeapon.isDoneFiring() && this.rightWeapon.isDoneFiring()) {
            this.actionDone = true;
        }
    }

    onPhaseChange(newPhase) {

    }

    onDefeat() {

    }

    laserBarrage() {
        this.leftWeapon.fire(15, BulletPattern.Random, false);
        this.rightWeapon.fire(15, BulletPattern.Random, false);
    }

    missileSwarm() {
        this.leftWeapon.fire(2, BulletPattern.Straight, true);
        this.rightWeapon.fire(2, BulletPattern.Straight, true);
    }

    shieldBash() {

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
            this.position.x + ((-1 * xoffset) * cos - yoffset * sin),
            this.position.y + ((-1 * xoffset) * sin + yoffset * cos),
            this.angle
        );
        this.rightWeapon.update(dt);

        if (this.attackCooldown > 0) {
            this.attackCooldown -= dt;
        }
    }

    render(context) {
        super.render(context);
        projectileFactory.render(context);
        this.leftWeapon.render(context);
        this.rightWeapon.render(context);
    }
}