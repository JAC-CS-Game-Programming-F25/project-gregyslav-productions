import State from "../../../lib/State.js";
import MechBoss from "../../entities/boss/MechBoss.js";
import { context } from "../../globals.js";

export default class PlayState extends State {
	constructor() {
		super();
		this.scene = null;
		this.boss = new MechBoss(400, 100, 100, 100, 1000, []);
	}

	enter(parameters) { 
		this.scene = parameters.scene;
	}

	exit() { }

	update(dt) {
		this.scene.update(dt);
	 }

	render() {
		this.scene.render();
		this.boss.render(context);
	}
}
