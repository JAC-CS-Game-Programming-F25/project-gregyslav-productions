import { getRandomPositiveNumber } from "../../../lib/utilities.js";
import BossStateName from "../../enums/BossStateName.js";
import { CANVAS_WIDTH } from "../../globals";
import BossState from "./BossState.js";

export default class BossHitState extends BossState {
    constructor() {
        super();
    }

    enter(params) {
        super(params);

        this.randomX = getRandomPositiveNumber(50, CANVAS_WIDTH - 50);

        this.boss.moveToLocation(this.randomX, this.boss.position.y);
    }

    update(dt) {
        super.update(dt);

        if (!this.boss.moving) {
            this.boss.stateMachine.change(BossStateName.Idle, {boss: this.boss, player: this.player});
        }
    }
}