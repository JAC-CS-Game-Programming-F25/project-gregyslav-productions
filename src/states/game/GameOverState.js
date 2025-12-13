import State from '../../../lib/State.js';
import Input from '../../../lib/Input.js';
import GameStateName from '../../enums/GameStateName.js';
import FontName from '../../enums/FontName.js';
import { input, gameData, stateMachine, saveHighScore, CANVAS_WIDTH, CANVAS_HEIGHT } from '../../globals.js';

export default class GameOverState extends State {
	constructor() {
		super();
		this.selectedOption = 0;
		this.options = ['Retry', 'Menu'];
		this.timer = 0;
		this.canSelect = false;
	}

	enter() {
		this.timer = 0;
		this.selectedOption = 0;
		this.canSelect = false;

		if (gameData.score > gameData.highScore) {
			gameData.highScore = gameData.score;
			saveHighScore();
		}
	}

	update(dt) {
		this.timer += dt;

		if (this.timer >= 1) {
			this.canSelect = true;
		}

		if (!this.canSelect) return;

		if (input.isKeyPressed(Input.KEYS.ARROW_UP) || input.isKeyPressed(Input.KEYS.W)) {
			this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
		}

		if (input.isKeyPressed(Input.KEYS.ARROW_DOWN) || input.isKeyPressed(Input.KEYS.S)) {
			this.selectedOption = (this.selectedOption + 1) % this.options.length;
		}

		if (input.isKeyPressed(Input.KEYS.ENTER) || input.isKeyPressed(Input.KEYS.SPACE)) {
			this.selectOption();
		}
	}

	selectOption() {
		switch (this.selectedOption) {
			case 0:
				gameData.score = 0;
				gameData.bossCount = 1;
				stateMachine.change(GameStateName.Playing);
				break;
			case 1:
				stateMachine.change(GameStateName.MainMenu);
				break;
		}
	}

	render(context) {
		// Dark red background
		context.fillStyle = '#110000';
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		// Game Over title
		context.fillStyle = '#ff0000';
		context.font = `32px ${FontName.PressStart2P}`;
		context.textAlign = 'center';
		context.fillText('GAME OVER', CANVAS_WIDTH / 2, 180);

		// Score display
		context.fillStyle = '#ffffff';
		context.font = `14px ${FontName.PressStart2P}`;
		context.fillText('Bosses Defeated: ' + gameData.score, CANVAS_WIDTH / 2, 260);

		// High score
		context.fillStyle = '#ffff00';
		context.font = `12px ${FontName.PressStart2P}`;
		context.fillText('High Score: ' + gameData.highScore, CANVAS_WIDTH / 2, 300);

		// Menu options
		if (this.canSelect) {
			const menuY = 400;

			for (let i = 0; i < this.options.length; i++) {
				const isSelected = i === this.selectedOption;
				context.fillStyle = isSelected ? '#ff6666' : '#666666';
				context.font = isSelected ? `16px ${FontName.PressStart2P}` : `12px ${FontName.PressStart2P}`;
				context.fillText(
					isSelected ? '> ' + this.options[i] + ' <' : this.options[i],
					CANVAS_WIDTH / 2,
					menuY + i * 50
				);
			}
		}
	}
}
