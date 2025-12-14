import State from '../../../lib/State.js';
import Input from '../../../lib/Input.js';
import GameStateName from '../../enums/GameStateName.js';
import FontName from '../../enums/FontName.js';
import { input, gameData, stateMachine, saveHighScore, CANVAS_WIDTH, CANVAS_HEIGHT } from '../../globals.js';

export default class VictoryState extends State {
	constructor() {
		super();
		this.timer = 0;
		this.intermissionDuration = 3;
	}

	enter(params) {
		this.timer = 0;
		gameData.score++;

		if (gameData.score > gameData.highScore) {
			gameData.highScore = gameData.score;
			saveHighScore();
		}
		this.scene = params.scene;
	}

	update(dt) {
		this.timer += dt;

		if (this.timer >= this.intermissionDuration) {
			gameData.bossCount++;
			stateMachine.change(GameStateName.Play, {scene: this.scene});
		}

		if (input.isKeyPressed(Input.KEYS.ENTER) || input.isKeyPressed(Input.KEYS.SPACE)) {
			gameData.bossCount++;
			stateMachine.change(GameStateName.Play, {scene: this.scene});
		}
	}

	render(context) {
		// Dark green background
		context.fillStyle = '#001100';
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		// Victory title
		context.fillStyle = '#00ff00';
		context.font = `32px ${FontName.PressStart2P}`;
		context.textAlign = 'center';
		context.fillText('VICTORY!', CANVAS_WIDTH / 2, 200);

		// Score display
		context.fillStyle = '#ffffff';
		context.font = `14px ${FontName.PressStart2P}`;
		context.fillText('Bosses Defeated: ' + gameData.score, CANVAS_WIDTH / 2, 280);

		// Next wave info
		context.fillStyle = '#ffff00';
		context.font = `12px ${FontName.PressStart2P}`;
		const bossText = (gameData.bossCount + 1) + ' Boss' + (gameData.bossCount > 0 ? 'es' : '') + '!';
		context.fillText('Next Wave: ' + bossText, CANVAS_WIDTH / 2, 340);

		// Countdown timer
		const timeLeft = Math.ceil(this.intermissionDuration - this.timer);
		context.fillStyle = '#888888';
		context.font = `10px ${FontName.PressStart2P}`;
		context.fillText('Continuing in ' + timeLeft + '...', CANVAS_WIDTH / 2, 420);

		// Continue prompt
		context.fillStyle = '#555555';
		context.font = `8px ${FontName.PressStart2P}`;
		context.fillText('Press ENTER to continue', CANVAS_WIDTH / 2, 500);
	}
}
