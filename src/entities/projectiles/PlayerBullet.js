import ProjectileOwner from "../../enums/ProjectileOwner";
import Projectile from "./Projectile";

export default class PlayerBullet extends Projectile {
    constructor(x, y, width, height, speed, damage, pattern, piercing, critical) {
        super(x, y, width, height, speed, damage, ProjectileOwner.Player, pattern);

        this.isPiercing = piercing;
        this.isCritical = critical;
    }

    update(dt) {
        super.update(dt);
    }

    render(canvas) {
        super.render(canvas);
    }

    onCollision(other) {
        
    }
}