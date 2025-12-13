import { projectileFactory } from "../../globals.js";
import Entity from "../Entity.js";

export default class Weapon extends Entity {
    constructor(x, y, width, height, angle, sprite) {
        super(x, y, width, height, angle);
        this.sprites = [
            sprite
        ]

        this.target = null;
        this.attackQueue = [];
        this.cooldown = null;
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

        if (this.attackQueue === undefined || this.attackQueue === null) {
            return;
        }
        
        while (this.attackQueue.at(-1) !== null || this.attackQueue.at(-1) !== undefined) {
            if (this.attackQueue.at(-1) === undefined) {
                break;
            }
            if (this.attackQueue.at(-1).delay <= 0) {
                this.attackQueue.at(-1).action();
                this.attackQueue.pop();
            } else {
                if (this.cooldown === null) {
                    this.cooldown = this.attackQueue.at(-1).delay;
                    break;
                } else {
                    if (this.cooldown <= 0) {
                        this.attackQueue.at(-1).action();
                        this.attackQueue.pop();
                        this.cooldown = null;
                    } else {
                        break;
                    }
                }
            }
        }

        if (this.cooldown !== null) {
            this.cooldown -= dt;
        }
    }

    newTarget(target) {
        this.target = target;
    }

    fire() {
        if (this.attackQueue.length > 0) {
            return;
        }
     }
}