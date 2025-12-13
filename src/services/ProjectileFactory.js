import BossBullet from "../entities/projectiles/BossBullet.js";
import BossMissile from "../entities/projectiles/BossMissile.js";

export default class ProjectileFactory {
    constructor() {
        this.projectiles = [];
    }

    fireBossMissile(x, y, angle, target) {
        this.projectiles.push(new BossMissile(x, y, angle, target));
    }

    fireBossBullet(x, y, angle, pattern) {
        this.projectiles.push(new BossBullet(x, y, angle, pattern))
    }

    update(dt) {
        this.projectiles.forEach(projectile => projectile.update(dt));
        this.projectiles = this.projectiles.filter(projectile => projectile.isActive);
    }

    render(canvas) {
        this.projectiles.forEach(projectile => projectile.render(canvas));
    }
}