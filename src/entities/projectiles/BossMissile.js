import Particle from "../../../lib/Particle.js";
import Sprite from "../../../lib/Sprite.js";
import Vector from "../../../lib/Vector.js";
import Vector2 from "../../../lib/Vector2.js";
import BulletPattern from "../../enums/BulletPattern.js";
import CollisionLayer from "../../enums/CollisionLayer.js";
import Colors from "../../enums/Colors.js";
import ImageName from "../../enums/ImageName.js";
import ProjectileOwner from "../../enums/ProjectileOwner.js";
import { images, timer } from "../../globals.js";
import Projectile from "./Projectile.js";

export default class BossMissile extends Projectile {
    constructor(x, y, angle, target) {
        let sprite = new Sprite(
            images.get(ImageName.BossMissile),
            0,
            0,
            12,
            26
        );
        super(x, y, 6, 13, angle, 200, 20, ProjectileOwner.Boss, BulletPattern.Straight);
        this.sprites = [
            sprite
        ]
        this.scale = new Vector(0.5, 0.5);
        this.rotationSpeed = 90;
        this.amplitude = 0;
        this.target = target;
        this.particles = [];
        this.collisionLayer = CollisionLayer.BossProjectile
        
        timer.addTask(() => {},
            5,
            5,
            () => { this.explode() }
        );
    }

    update(dt) {
        super.update(dt);
        let deltaX = this.target.position.x - this.position.x;
        let deltaY = this.target.position.y - this.position.y;

        let targetAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;

        if (targetAngle - this.angle < -180) {
            targetAngle += 360;
        }

        if (this.angle < targetAngle) {
            if (Math.abs(this.angle - targetAngle) <= this.rotationSpeed * dt) {
                this.angle = targetAngle;
            } else {
                this.angle += this.rotationSpeed * dt;
            }
        } else if (this.angle > targetAngle) {
            if (Math.abs(this.angle - targetAngle) <= this.rotationSpeed * dt) {
                this.angle = targetAngle;
            } else {
                this.angle -= this.rotationSpeed * dt;
            }
        }


        this.velocity.x = Math.cos((this.angle - 90) * (Math.PI / 180)) * this.velocity.magnitude();
        this.velocity.y = Math.sin((this.angle - 90) * (Math.PI / 180)) * this.velocity.magnitude();

        this.particles.push(new Particle(this.position.x, this.position.y, 1, Colors.FIRE_COLORS[Math.floor(Math.random() * Colors.FIRE_COLORS.length)]));

		this.particles = this.particles.filter(particle => particle.isAlive);

		this.particles.forEach(particle => {
			particle.applyForce(new Vector2(this.velocity.x * -10, this.velocity.y * -10), dt);
			particle.update(dt);
		});
    }

    render(canvas) {
        this.particles.forEach(particle => particle.render(canvas));
        super.render(canvas);
    }

    onCollision(other) {
        super.onCollision(other)
    }

    explode() {
        this.isActive = false;
    }
}