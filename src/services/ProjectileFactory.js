import BossBullet from "../entities/projectiles/BossBullet.js";
import BossMissile from "../entities/projectiles/BossMissile.js";
import PlayerBullet from "../entities/projectiles/PlayerBullet.js";

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

    firePlayerBullet(x, y, angle, piercing, critical) {
        this.projectiles.push(new PlayerBullet(x, y, angle, piercing, critical))
    }

    update(dt, player, boss) {
        this.projectiles.forEach(projectile => {
                projectile.update(dt);
                if (projectile.hitbox.didCollide(player.hitbox)) {
                    player.onCollision(projectile);
                    projectile.onCollision(player);
                }
                if (projectile.hitbox.didCollide(boss.hitbox)) {
                    boss.onCollision(projectile);
                    projectile.onCollision(boss);
                }
            }
        );

        this.projectiles = this.projectiles.filter(projectile => projectile.isActive);
    }

    render(canvas) {
        this.projectiles.forEach(projectile => projectile.render(canvas));
    }
}