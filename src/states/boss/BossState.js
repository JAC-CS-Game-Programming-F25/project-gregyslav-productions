import State from "../../../lib/State.js";
import BossStateName from "../../enums/BossStateName.js";

export default class BossState extends State {
    constructor(boss) {
        super(boss);
        this.boss = boss;
    }

    enter(params) {

    }

    update(dt) {
        this.boss.update(dt);

        if (this.boss.isDead()) {
            this.boss.stateMachine.change(BossStateName.DeathAnimation, {})
        }
    }

    render(context) {
        this.boss.render(context);
    }
}