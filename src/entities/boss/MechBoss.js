import Boss from "./Boss.js";
import Sprite from "../../../lib/Sprite.js";
import Hitbox from "../../../lib/Hitbox.js";
import ImageName from "../../enums/ImageName.js";
import { images, projectileFactory } from "../../globals.js";
import Weapon from "./Weapon.js";
import Vector from "../../../lib/Vector.js";

const MECH_BOSS_WEAPON_OFFSET_FROM_CENTER = { x: 88, y: -27 };
const SCALE = 0.3;

export default class MechBoss extends Boss {
    constructor(x, y, health, attackPatterns) {
        let sprite = new Sprite(
            images.get(ImageName.BossShip),
            0,
            0,
            288,
            384
        );
        super(x, y, 288 * SCALE, 384 * SCALE, 180, sprite, "Mech Boss", health, 50);
        this.attackPatterns = attackPatterns;
        let weaponsprite = new Sprite(
            images.get(ImageName.BossMissileWeapon),
            0,
            0,
            64,
            64
        );
        this.leftWeapon = new Weapon(this.position.x - (MECH_BOSS_WEAPON_OFFSET_FROM_CENTER.x * SCALE), this.position.y - (MECH_BOSS_WEAPON_OFFSET_FROM_CENTER.y * SCALE), 64 * SCALE, 64 * SCALE, 0, weaponsprite);
        this.rightWeapon = new Weapon(this.position.x + (MECH_BOSS_WEAPON_OFFSET_FROM_CENTER.x * SCALE), this.position.y - (MECH_BOSS_WEAPON_OFFSET_FROM_CENTER.y * SCALE), 64 * SCALE, 64 * SCALE, 0, weaponsprite);
        this.weapons = [
            new Weapon(this.position.x + (MECH_BOSS_WEAPON_OFFSET_FROM_CENTER.x * SCALE), this.position.y - (MECH_BOSS_WEAPON_OFFSET_FROM_CENTER.y * SCALE), 64 * SCALE, 64 * SCALE, 180, weaponsprite),
            new Weapon(this.position.x - (MECH_BOSS_WEAPON_OFFSET_FROM_CENTER.x * SCALE), this.position.y - (MECH_BOSS_WEAPON_OFFSET_FROM_CENTER.y * SCALE), 64 * SCALE, 64 * SCALE, 180, weaponsprite)
        ];

        this.target = null;
    }

    executeAttack() {
        if (this.target === null || this.target === undefined) {
            return;
        }
        this.leftWeapon.fire();
        this.rightWeapon.fire();
    }

    onPhaseChange(newPhase) {

    }

    onDefeat() {

    }

    laserBarrage() {

    }

    missileSwarm() {

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
    }

    render(context) {
        super.render(context);
        projectileFactory.render(context);
        this.leftWeapon.render(context);
        this.rightWeapon.render(context);
    }
}