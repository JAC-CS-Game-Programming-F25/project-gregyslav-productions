import Easing from "../../../lib/Easing.js";
import StateMachine from "../../../lib/StateMachine.js";
import BossStateName from "../../enums/BossStateName.js";
import CollisionLayer from "../../enums/CollisionLayer.js";
import { timer } from "../../globals.js";
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
        this.collisionLayer = CollisionLayer.Boss

        this.stateMachine = new StateMachine();
        this.initializeStateMachine();
    }

    update(dt) {
        super.update(dt);
        console.log(this.stateMachine.currentState)
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

    onCollision(other) {
        if (other.collisionLayer === CollisionLayer.PlayerProjectile) {
            this.health -= other.damage;
            this.hit = true;
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
}