import BossState from "./BossState.js";

export default class BossDyingState extends BossState {
    constructor(boss) {
        super(boss);
    }

    enter(params) {
        this.boss.explode()
    }
}