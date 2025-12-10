import { getRandomNumber } from './utilities.js';
import Vector from './Vector.js';

export default class Particle {
	constructor(x, y, radius, color) {
		this.position = new Vector(x, y);
		this.velocity = new Vector(getRandomNumber(-25, 25), getRandomNumber(-25, 25));
		this.acceleration = new Vector(0, 0);
		this.radius = radius;
		this.lifetime = 50;
		this.life = this.lifetime;
		this.isAlive = true;
		this.color = color;
	}

	applyForce(force, dt) {
		this.acceleration.add(force, dt);
	}

	update(dt) {
		this.isAlive = this.life > 0;
		this.velocity.add(this.acceleration, dt);
		this.position.add(this.velocity, dt);
		this.life -= 1;
		this.radius -= this.radius / this.life;
	}

	render(context) {
		context.fillStyle = this.color;
		context.globalAlpha = this.life / this.lifetime;

		context.beginPath();

		context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);

		context.closePath();

		context.fill();
	}
}
