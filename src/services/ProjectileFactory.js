import BossMissile from "../entities/projectiles/BossMissile.js";

export default class ProjectileFactory {
    constructor() {
        this.projectiles = [];
    }

    fireBossMissile(x, y, angle, speed, damage, pattern, rotationSpeed, amplitude, target) {
        this.projectiles.push(new BossMissile(x, y, angle, speed, damage, pattern, rotationSpeed, amplitude, target));
    }

    update(dt) {
        this.projectiles.forEach(projectile => projectile.update(dt));
        this.projectiles = this.projectiles.filter(projectile => projectile.isActive);
    }

    render(canvas) {
        this.projectiles.forEach(projectile => projectile.render(canvas));
    }
}