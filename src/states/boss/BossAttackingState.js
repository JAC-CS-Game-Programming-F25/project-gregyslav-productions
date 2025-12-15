import BossStateName from "../../enums/BossStateName.js";
import BossState from "./BossState.js";

export default class BossAttackingState extends BossState {
    constructor(boss) {
        super(boss);
    }

    enter(params) {
        this.boss.executeAttack();
    }

    update(dt) {
        super.update(dt);

        this.boss.checkWeaponDone();

        if (this.boss.actionDone) {
            this.boss.stateMachine.change(BossStateName.Idle, {});
        }
    }
}