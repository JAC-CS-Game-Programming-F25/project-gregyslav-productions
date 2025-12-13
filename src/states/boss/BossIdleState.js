import { getRandomPositiveNumber } from "../../../lib/utilities.js";
import BossStateName from "../../enums/BossStateName.js";
import BossState from "./BossState.js";

export default class BossIdleState extends BossState {
    constructor() {
        super();
    }

    update(dt) {
        if(getRandomPositiveNumber(0, 10) > 3) {
            this.boss.stateMachine.change(BossStateName.Attacking, {boss: this.boss, player: this.player});
            return;
        }

        if(this.boss.hit) {
            this.boss.stateMachine.change(BossStateName.Hit, {boss: this.boss, player: this.player});
            return;
        }
    }
}