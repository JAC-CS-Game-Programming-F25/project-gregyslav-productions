import Hitbox from "../../../lib/Hitbox.js";
import Vector2 from "../../../lib/Vector2.js";
import CollisionLayer from "../../enums/CollisionLayer.js";
import ProjectileOwner from "../../enums/ProjectileOwner.js";
import { CANVAS_WIDTH } from "../../globals.js";
import Boss from "../boss/Boss.js";
import Entity from "../Entity.js";
import Player from "../player/Player.js";
export default class Projectile extends Entity {
    constructor(x = 0, y = 0, width = 0, height = 0, angle, speed = 0, damage = 0, owner, pattern) {
        super(x, y, width, height, angle);

        let dx = Math.cos((this.angle - 90) * (Math.PI / 180)) * speed;
        let dy = Math.sin((this.angle - 90) * (Math.PI / 180)) * speed;

        this.velocity = new Vector2(dx, dy);

        this.damage = damage;
        this.owner = owner;
        this.pattern = pattern;
    }

    update(dt) {
        super.update(dt);

        if (this.position.x < CANVAS_WIDTH * -1 || this.position.x > CANVAS_WIDTH * 2 ||
            this.position.y < CANVAS_WIDTH * -1 || this.position.y > CANVAS_WIDTH * 2) {
            this.isActive = false;
        }
    }

    render(canvas) {
        super.render(canvas);
    }

    onCollision(other) {
        switch(this.owner) {
            case ProjectileOwner.Boss:
                if (other.collisionLayer === CollisionLayer.Player) {
                    this.isActive = false;
                }
                break;
            case ProjectileOwner.Player:
                if (other.collisionLayer === CollisionLayer.Boss) {
                    this.isActive = false;
                }
        }

        if (other.collisionLayer === CollisionLayer.Asteroid) {
            this.isActive = false;
        } 
    }

    onHit(target) {

    }
}