import Projectile from "./Projectile";

export default class BossBullet extends Projectile {
    constructor(x, y, width, height, speed, damage, pattern, rotationSpeed, amplitude) {
        super(x, y, width, height, speed, damage, ProjectileOwner.Player, pattern);

        this.rotationSpeed = rotationSpeed;
        this.amplitude = amplitude;
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