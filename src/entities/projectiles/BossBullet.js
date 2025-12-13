import Sprite from "../../../lib/Sprite.js";
import Vector from "../../../lib/Vector.js";
import ImageName from "../../enums/ImageName.js";
import ProjectileOwner from "../../enums/ProjectileOwner.js";
import { images } from "../../globals.js";
import Projectile from "./Projectile.js";

export default class BossBullet extends Projectile {
    constructor(x, y, angle, pattern) {
        let sprite = new Sprite(
            images.get(ImageName.Laser),
            0,
            0,
            268,
            749
        );
        super(x, y, 5, 10, angle, 200, 10, ProjectileOwner.Boss, pattern, sprite);
        this.sprites = [
            sprite
        ]
        this.scale = new Vector(5/268, 10/749);
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