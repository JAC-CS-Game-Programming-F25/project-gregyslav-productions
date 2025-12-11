import Hitbox from "../../../lib/Hitbox.js";
import State from "../../../lib/State.js";
import MechBoss from "../../entities/boss/MechBoss.js";
import Player from "../../entities/player/Player.js";
import BossBullet from "../../entities/projectiles/BossBullet.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, input } from "../../globals.js";

export default class PlayState extends State {
	constructor() {
		super();
		this.scene = null;
		this.boss = new MechBoss(CANVAS_WIDTH / 2, 70, 100, 100, 1000, []);
		this.test = new BossBullet(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 100, 10, null, 0, 0);
		this.hitbox = new Hitbox(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 200, 50, 67, 'red');
		this.player = new Player(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 100);
	}

	enter(parameters) { 
		this.scene = parameters.scene;
	}

	exit() { }

	update(dt) {
		this.scene.update(dt);
		this.boss.update(dt);
		//this.test.update(dt);
		let mousePos = input.getMousePosition();
		if (this.hitbox.checkCollisionOnPoint(mousePos)) {
			console.log("Collision!");
		}
	 }

	render() {
		this.scene.render();
		this.boss.render(context);
		this.test.render(context);
		//this.hitbox.render(context);
		this.player.render(context);
	}
}
