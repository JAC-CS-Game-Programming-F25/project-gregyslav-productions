import PowerUpState from './PowerUpState.js';
import PowerUpStateName from '../../enums/PowerUpStateName.js';

export default class PowerUpSpawningState extends PowerUpState {
	constructor(powerUp) {
		super(powerUp);
	}

	enter() {
		this.powerUp.spawnTimer = 0.2;
	}

	update(dt) {
		super.update(dt);

		this.powerUp.spawnTimer -= dt;
		if (this.powerUp.spawnTimer <= 0) {
			this.powerUp.stateMachine.change(PowerUpStateName.Active);
		}
	}
}