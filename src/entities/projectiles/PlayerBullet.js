import Sprite from "../../../lib/Sprite.js";
import Vector from "../../../lib/Vector.js";
import ImageName from "../../enums/ImageName.js";
import ProjectileOwner from "../../enums/ProjectileOwner.js";
import { images } from "../../globals.js";
import Projectile from "./Projectile.js";

export default class PlayerBullet extends Projectile {
    constructor(x, y, pattern, piercing, critical) {
        let sprite = new Sprite(
            images.get(ImageName.Laser),
            0,
            0,
            268,
            749
        );

        super(x, y, 5, 10, 200, 10, ProjectileOwner.Player, pattern);
        this.sprites = [
            sprite
        ]
        this.scale = new Vector(5/268, 10/749);
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