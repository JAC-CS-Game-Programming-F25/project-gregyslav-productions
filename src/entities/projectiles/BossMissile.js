import Easing from "../../../lib/Easing.js";
import Particle from "../../../lib/Particle.js";
import Sprite from "../../../lib/Sprite.js";
import Vector from "../../../lib/Vector.js";
import Vector2 from "../../../lib/Vector2.js";
import BulletPattern from "../../enums/BulletPattern.js";
import CollisionLayer from "../../enums/CollisionLayer.js";
import Colors from "../../enums/Colors.js";
import ImageName from "../../enums/ImageName.js";
import ProjectileOwner from "../../enums/ProjectileOwner.js";
import SoundName from "../../enums/SoundName.js";
import { images, sounds, timer } from "../../globals.js";
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

        super(x, y, 6, 13, angle, 200, 1, ProjectileOwner.Boss, BulletPattern.Straight);
        this.explosionSprites = [
            new Sprite(images.get(ImageName.Explosion), 0, 0, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 98.2, 0, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 196.4, 0, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 294.6, 0, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 392.8, 0, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 0, 95.4, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 98.2, 95.4, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 196.4, 95.4, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 294.6, 95.4, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 392.8, 95.4, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 0, 190.8, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 98.2, 190.8, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 196.4, 190.8, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 294.6, 190.8, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 392.8, 190.8, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 0, 286.2, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 98.2, 286.2, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 196.4, 286.2, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 294.6, 286.2, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 392.8, 286.2, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 0, 381.6, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 98.2, 381.6, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 196.4, 381.6, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 294.6, 381.6, 98.2, 95.4),
            new Sprite(images.get(ImageName.Explosion), 392.8, 381.6, 98.2, 95.4),
        ]
        
        this.sprites = [
            sprite
        ]
        this.scale = new Vector(0.5, 0.5);
        this.rotationSpeed = 90;
        this.amplitude = 0;
        this.target = target;
        this.particles = [];
        this.collisionLayer = CollisionLayer.BossProjectile;
        this.exploding = false;
        
        timer.addTask(() => {},
            5,
            5,
            () => { this.explode() }
        );
    }

    update(dt) {
        if (this.exploding) {
            return;
        }
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
        switch(this.owner) {
            case ProjectileOwner.Boss:
                if (other.collisionLayer === CollisionLayer.Player) {
                    this.explode();
                }
                break;
        }
    }

    explode() {
        if (this.exploding) {
            return;
        }
        sounds.play(SoundName.MissileExplosion)
        this.exploding = true;
        this.particles = []
        this.sprites = this.explosionSprites;
        this.hitbox.dimensions.x = 15;
        this.hitbox.dimensions.y = 15;
        this.dimensions.x = 98.2 * this.scale.x
        this.dimensions.y = 95.4 * this.scale.y
        timer.addTask(() => { 
            if (this.currentFrame < this.sprites.length - 1) {
                this.currentFrame += 1
            }
            this.hitbox.dimensions.x *= 1.05
            this.hitbox.dimensions.y *= 1.05
            this.hitbox.updateCorners()
        }, 0.1/35, 0.3, () => {this.isActive = false;})
    }
}