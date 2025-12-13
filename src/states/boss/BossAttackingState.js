import BossState from "./BossState.js";

export default class BossAttackingState extends BossState {
    constructor() {
        super();
    }

    enter(params) {
        super.enter(params);

        this.boss.executeAttack();
    }

    
}