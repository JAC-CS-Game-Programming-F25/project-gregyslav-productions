import Particle from "../../../lib/Particle.js";
import Scene from "../../../lib/Scene.js";
import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import Colors from "../../enums/Colors.js";
import ImageName from "../../enums/ImageName.js";
import {
	images,
	context,
	CANVAS_WIDTH,
	CANVAS_HEIGHT
} from "../../globals.js";

export default class TitleScreenState extends State {
	constructor() {
		super();
		this.particles = [];
		this.shipX = CANVAS_WIDTH / 2;
		this.shipY = CANVAS_HEIGHT - 80;
		this.scene = new Scene();
	}

	enter(parameters) {
		
	}

	exit() { }

	update(dt) {
		this.particles.push(new Particle(this.shipX, this.shipY, 5, Colors.FIRE_COLORS[Math.floor(Math.random() * Colors.FIRE_COLORS.length)]));

		this.particles = this.particles.filter(particle => particle.isAlive);

		this.particles.forEach(particle => {
			particle.applyForce(new Vector(0, 10000), dt);
			particle.update(dt);
		});

		this.scene.update(dt);
	}

	render() {
		context.save();
		this.scene.render();
		context.font = '40px Arial';
		context.textAlign = 'center';
		context.fillStyle = "white";
		context.fillText('SPACE RAIDER XD', CANVAS_WIDTH / 2, 120);
		this.particles.forEach(particle => particle.render(context));
		images.render(ImageName.PlayerShip, this.shipX - 20.5, this.shipY - 16, 41, 33);
		
		context.fillStyle = "white";
		context.font = '10px Arial';
		context.fillText('> Press any key to start <', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 25);
		context.restore();
	}
}
