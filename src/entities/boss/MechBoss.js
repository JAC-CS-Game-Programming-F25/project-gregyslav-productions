import Boss from "./Boss.js";
import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import { images } from "../../globals.js";

const MECH_BOSS_LEFT_MISSILE_OFFSET = { x: 26, y: 137 };
const MECH_BOSS_RIGHT_MISSILE_OFFSET = { x: 200, y: 137 };
const SCALE = 0.3;

export default class MechBoss extends Boss {
    constructor(x, y, width, height, health, attackPatterns) {
        super(x, y, width, height, health);
        this.attackPatterns = attackPatterns;

        this.sprite = new Sprite(
            images.get(ImageName.BossShip),
            0,
            0,
            288,
            384
        )
        this.missileWeaponSprite = new Sprite(
            images.get(ImageName.BossMissileWeapon),
            0,
            0,
            64,
            64
        )
    }

    executeAttack() {

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

    update(dt) {
        super.update(dt);
    }

    render(context) {
        context.save();
        context.translate(350, 250);
        context.rotate(Math.PI);
        this.sprite.render(0, 0, {x: SCALE, y: SCALE});
        this.missileWeaponSprite.render(MECH_BOSS_LEFT_MISSILE_OFFSET.x * SCALE, MECH_BOSS_LEFT_MISSILE_OFFSET.y * SCALE, {x: SCALE, y: SCALE});
        this.missileWeaponSprite.render(MECH_BOSS_RIGHT_MISSILE_OFFSET.x * SCALE, MECH_BOSS_RIGHT_MISSILE_OFFSET.y * SCALE, {x: SCALE, y: SCALE});
        context.restore();
    }
}