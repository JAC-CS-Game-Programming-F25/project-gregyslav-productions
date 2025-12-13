import { projectileFactory } from "../../globals.js";
import Entity from "../Entity.js";

export default class Weapon extends Entity {
    constructor(x, y, width, height, angle, sprite) {
        super(x, y, width, height, angle, sprite);
        this.cooldown = 0;
        this.target = null;
    }

    updatePosAndRotation(x, y, angle) {
        this.position.x = x;
        this.position.y = y;
        this.angle = angle;
    }

    update(dt) {
        if (this.target === null || this.target === undefined) {
            super.update(dt);
            return;
        }
        let deltaX = this.target.position.x - this.position.x;
        let deltaY = this.target.position.y - this.position.y;
        this.angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
        super.update(dt);
        this.cooldown -= dt;
        if (this.cooldown < 0) {
            this.cooldown = 0;
        }
    }

    newTarget(target) {
        this.target = target;
    }

    fire() {
        if (this.cooldown <= 0) {
        projectileFactory.fireBossMissile(
            this.position.x,
            this.position.y,
            this.angle,
            100,
            10,
            "straight",
            720,
            0,
            this.target
        );
        this.cooldown = 1;
    }
    }
}