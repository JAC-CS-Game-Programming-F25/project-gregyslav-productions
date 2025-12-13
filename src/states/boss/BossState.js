import State from "../../../lib/State.js";

export default class BossState extends State {
    constructor() {
        super();
        this.boss = null;
        this.player = null;
    }

    enter(params) {
        this.boss = params.boss;
        this.player = params.player;
        this.boss.lockOnTarget(this.player);
    }

    update(dt) {
        this.boss.update(dt);
    }

    render(context) {
        this.boss.render(context);
    }
}