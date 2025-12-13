import Hitbox from "../../../lib/Hitbox.js";
import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import MechBoss from "../../entities/boss/MechBoss.js";
import Player from "../../entities/player/Player.js";
import BossBullet from "../../entities/projectiles/BossBullet.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, input, projectileFactory } from "../../globals.js";
import ProjectileFactory from "../../services/ProjectileFactory.js";

export default class PlayState extends State {
	constructor() {
		super();
		this.scene = null;
		this.boss = new MechBoss(CANVAS_WIDTH / 2, 70, 100, 100, 1000, []);
		this.player = new Player(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 100);
		this.test = { position: new Vector(0, 0) };
		this.boss.moveToLocation(50, 50);
		this.boss.lockOnTarget(this.test);
	}

	enter(parameters) { 
		this.scene = parameters.scene;
	}

	exit() { }

	update(dt) {
		this.scene.update(dt);
		projectileFactory.update(dt);
		this.boss.update(dt);
		let mousePos = input.getMousePosition();
		this.test.position.x = mousePos.x;
		this.test.position.y = mousePos.y;
		this.boss.executeAttack();
	}

	render() {
		this.scene.render();
		this.boss.render(context);
		this.player.render(context);
	}
}
