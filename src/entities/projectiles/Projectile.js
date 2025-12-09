import ProjectileOwner from "../../enums/ProjectileOwner";
import MovableObject from "../MovableObject";

export default class Projectile extends MovableObject {
    constructor(x = 0, y = 0, width = 0, height = 0, speed = 0, damage = 0, owner, pattern) {
        super(x, y, width, height, speed);
        this.damage = damage;
        this.owner = owner;
        this.pattern = pattern;
    }

    update(dt) {
        super.update(dt);
    }

    render(canvas) {
        super.render(canvas);
    }

    onCollision(other) {

    }

    onHit(target) {

    }
}