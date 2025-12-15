import Easing from "../../../lib/Easing.js";
import Sprite from "../../../lib/Sprite.js";
import StateMachine from "../../../lib/StateMachine.js";
import BossStateName from "../../enums/BossStateName.js";
import CollisionLayer from "../../enums/CollisionLayer.js";
import ImageName from "../../enums/ImageName.js";
import SoundName from "../../enums/SoundName.js";
import { images, sounds, timer } from "../../globals.js";
import BossAttackingState from "../../states/boss/BossAttackingState.js";
import BossDyingState from "../../states/boss/BossDyingState.js";
import BossHitState from "../../states/boss/BossHitState.js";
import BossIdleState from "../../states/boss/BossIdleState.js";
import Entity from "../Entity.js";
import PlayerBullet from "../projectiles/PlayerBullet.js";

export default class Boss extends Entity {
    constructor(x, y, width, height, angle, name, health, speed) {
        super(x, y, width, height, angle);
        this.health = health;
        this.name = name;
        this.speed = speed;
        this.actionDone = true;
        this.hit = false;

        this.attackCooldown = 1.5;
        this.collisionLayer = CollisionLayer.Boss;

        this.exploding = false;
        this.invincible = false;

        this.stateMachine = new StateMachine();
        this.initializeStateMachine();
    }

    update(dt) {
        if (this.exploding) {
            return;
        }
        super.update(dt);
    }

    render(canvas) {
        super.render(canvas);
    }

    takeDamage(amount) {
        this.health -= amount;
    }

    checkPhaseTransition() {
        
    }

    selectAttack() {

    }

    executeAttack() {

    }

    onPhaseChange(newPhase) {

    }

    onDefeat() {

    }

    isDead() {
        return this.health <= 0;
    }

    onCollision(other) {
        if (other.collisionLayer === CollisionLayer.PlayerProjectile) {
            sounds.play(SoundName.Hit)
            this.health -= other.damage;
            this.hit = true;
            
            this.alpha = 0
            timer.addTask(() => {}, 1, 0.05, () => {this.alpha = 1})
        }
    }

    moveToLocation(x, y) {
        if (!this.actionDone) {
            return;
        }
        let deltax = Math.abs(x - this.position.x);
        let deltay = Math.abs(y - this.position.y);
        let distance = Math.sqrt(deltax * deltax + deltay * deltay);
        let duration = distance / this.speed;

        this.actionDone = false;

        timer.tween(
            this.position,
            {
                x: x,
                y: y
            },
            duration,
            Easing.linear,
            () => {
                this.actionDone = true;
            }
        )
    }

    isDoneWithAction() {
        return this.actionDone;
    }

    initializeStateMachine() {
        this.stateMachine.add(BossStateName.Attacking, new BossAttackingState(this))
        this.stateMachine.add(BossStateName.DeathAnimation, new BossDyingState(this))
        this.stateMachine.add(BossStateName.Hit, new BossHitState(this))
        this.stateMachine.add(BossStateName.Idle, new BossIdleState(this))
    }

    explode() {
        if (this.exploding) {
            return;
        }
        this.exploding = true;

        this.sprites = [
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
        ];

        timer.addTask(() => {
            if (this.currentFrame < this.sprites.length - 1) {
                this.currentFrame += 1
            }
        }, 1/35, 1, () => {this.isActive = false;})
    }
}