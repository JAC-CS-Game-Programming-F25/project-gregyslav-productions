import { getRandomPositiveNumber } from "../../../lib/utilities.js";
import BossStateName from "../../enums/BossStateName.js";
import { CANVAS_WIDTH } from "../../globals.js";
import BossState from "./BossState.js";

export default class BossHitState extends BossState {
    constructor(boss) {
        super(boss);
    }

    enter(params) {
        this.randomX = getRandomPositiveNumber(50, CANVAS_WIDTH - 50);

        this.boss.moveToLocation(this.randomX, this.boss.position.y);
    }

    update(dt) {
        super.update(dt);

        if (this.boss.actionDone) {
            this.boss.stateMachine.change(BossStateName.Idle, {boss: this.boss, player: this.player});
        }
    }

    exit() {
        this.boss.hit = false;
    }
}