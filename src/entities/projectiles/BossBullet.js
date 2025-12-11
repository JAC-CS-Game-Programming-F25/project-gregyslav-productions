import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import ProjectileOwner from "../../enums/ProjectileOwner.js";
import { images } from "../../globals.js";
import Projectile from "./Projectile.js";

export default class BossBullet extends Projectile {
    constructor(x, y, speed, damage, pattern, rotationSpeed, amplitude) {
        let sprite = new Sprite(
            images.get(ImageName.BossMissile),
            0,
            0,
            12,
            26
        );
        super(x, y, 12, 26, 45, speed, damage, ProjectileOwner.Boss, pattern, sprite);

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