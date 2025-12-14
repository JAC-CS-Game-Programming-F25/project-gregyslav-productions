import State from '../../../lib/State'

export default class PowerUpState extends State{
	constructor(powerUp){
		super();
		this.powerUp = powerUp
	}

	enter(params){
		this.params = params || {};
	}

	update(dt){
		this.powerUp.updatePosition(dt);
	}

	render(context){
		this.powerUp.renderSprite(context);
	}
}