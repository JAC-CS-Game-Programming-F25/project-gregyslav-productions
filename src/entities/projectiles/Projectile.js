import Hitbox from "../../../lib/Hitbox.js";
import Vector2 from "../../../lib/Vector2.js";
import { CANVAS_WIDTH } from "../../globals.js";
import Entity from "../Entity.js";
export default class Projectile extends Entity {
    constructor(x = 0, y = 0, width = 0, height = 0, angle, speed = 0, damage = 0, owner, pattern, sprite) {
        super(x, y, width, height, angle, sprite);

        let dx = Math.cos((this.angle - 90) * (Math.PI / 180)) * speed;
        let dy = Math.sin((this.angle - 90) * (Math.PI / 180)) * speed;

        this.velocity = new Vector2(dx, dy);
        this.damage = damage;
        this.owner = owner;
        this.pattern = pattern;
    }

    update(dt) {
        super.update(dt);

        if (this.position.x < CANVAS_WIDTH * -1 || this.position.x > CANVAS_WIDTH * 2 ||
            this.position.y < CANVAS_WIDTH * -1 || this.position.y > CANVAS_WIDTH * 2) {
            this.isActive = false;
        }
    }

    render(canvas) {
        super.render(canvas);
    }

    onCollision(other) {

    }

    onHit(target) {

    }
}