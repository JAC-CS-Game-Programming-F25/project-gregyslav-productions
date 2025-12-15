import Sprite from "../../../lib/Sprite.js";
import Vector from "../../../lib/Vector.js";
import CollisionLayer from "../../enums/CollisionLayer.js";
import ImageName from "../../enums/ImageName.js";
import ProjectileOwner from "../../enums/ProjectileOwner.js";
import { images } from "../../globals.js";
import Projectile from "./Projectile.js";

export default class PlayerBullet extends Projectile {
    constructor(x, y, angle, piercing, critical) {
        let sprite = new Sprite(
            images.get(ImageName.Laser),
            0,
            0,
            268,
            749
        );

        super(x, y, 5, 10, angle, 200, 2, ProjectileOwner.Player, "");
        this.sprites = [
            sprite
        ]
        this.scale = new Vector(5/268, 10/749);
        this.isPiercing = piercing;
        this.isCritical = critical;
        this.collisionLayer = CollisionLayer.PlayerProjectile

    }

    update(dt) {
        super.update(dt);
    }

    render(canvas) {
        super.render(canvas);
    }

    onCollision(other) {
        super.onCollision(other);
    }
}