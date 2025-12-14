import State from "../../../lib/State.js";

export default class BossState extends State {
    constructor(boss) {
        super(boss);
        this.boss = boss;
    }

    enter(params) {

    }

    update(dt) {
        this.boss.update(dt);
    }

    render(context) {
        this.boss.render(context);
    }
}