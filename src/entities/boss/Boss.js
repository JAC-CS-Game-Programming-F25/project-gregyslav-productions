import Easing from "../../../lib/Easing.js";
import { timer } from "../../globals.js";
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
    }

    update(dt) {
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

    onCollision(other) {
        if (other === typeof(PlayerBullet)) {
            this.health -= other.damage;
            this.hit = true;
        }
    }

    moveToLocation(x, y) {
        if (this.actionDone) {
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
}