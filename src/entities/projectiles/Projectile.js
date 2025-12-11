import Hitbox from "../../../lib/Hitbox.js";
import Vector from "../../../lib/Vector.js";
import Entity from "../Entity.js";
export default class Projectile extends Entity {
    constructor(x = 0, y = 0, width = 0, height = 0, angle, speed = 0, damage = 0, owner, pattern, sprite) {
        super(x, y, width, height, angle, sprite);

        let dx = Math.cos((this.angle - 90) * (Math.PI / 180)) * speed;
        let dy = Math.sin((this.angle - 90) * (Math.PI / 180)) * speed;

        this.velocity = new Vector(dx, dy);
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