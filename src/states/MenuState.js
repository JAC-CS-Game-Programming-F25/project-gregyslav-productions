import State from '../../lib/State.js';
import Input from '../../lib/Input.js';
import GameStateName from '../enums/GameStateName.js';
import FontName from '../enums/FontName.js';
import SaveManager from '../services/SaveManager.js';
import {
	context,
	input,
	stateMachine,
	images,
	CANVAS_WIDTH,
	CANVAS_HEIGHT
} from '../globals.js';

export default class MainMenuState extends State {
	constructor() {
		super();
		this.menuOptions = ['New Game', 'Continue'];
		this.selectedIndex = 0;
		this.hasSaveFile = false;
		this.scene = null;
	}

	enter(params) {
		this.hasSaveFile = SaveManager.hasSave();
		this.selectedIndex = 0;
		this.scene = params.scene;
	}

	update(dt) {
		if (input.isKeyPressed(Input.KEYS.W) || input.isKeyPressed(Input.KEYS.ARROW_UP)) {
			this.selectedIndex--;
			if (this.selectedIndex < 0) {
				this.selectedIndex = this.hasSaveFile ? 1 : 0;
			}
			// TODO: play menu navigate sound
		}

		if (input.isKeyPressed(Input.KEYS.S) || input.isKeyPressed(Input.KEYS.ARROW_DOWN)) {
			this.selectedIndex++;
			const maxIndex = this.hasSaveFile ? 1 : 0;
			if (this.selectedIndex > maxIndex) {
				this.selectedIndex = 0;
			}
			// TODO: play menu navigate sound
		}

		if (input.isKeyPressed(Input.KEYS.ENTER) || input.isKeyPressed(Input.KEYS.SPACE)) {
			this.selectOption();
		}

		this.scene.update(dt)
	}

	selectOption() {
		// TODO: play menu select sound
		if (this.selectedIndex === 0) {
			// new game
			SaveManager.deleteSave();
			stateMachine.change(GameStateName.Play, { loadSave: false, scene: this.scene });
		} else if (this.selectedIndex === 1 && this.hasSaveFile) {
			// continue
			stateMachine.change(GameStateName.Play, { loadSave: true, scene: this.scene });
		}
	}

	render() {
		this.scene.render();
		//this.renderBackground();
		this.renderTitle();
		this.renderMenu();
		this.renderHighScore();
	}

	renderBackground() {
		const bg = images.get('background');
		if (bg) {
			context.drawImage(bg.image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
			context.fillStyle = 'rgba(0, 0, 0, 0.6)';
			context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		} else {
			context.fillStyle = '#000011';
			context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		}
	}

	renderTitle() {
		context.fillStyle = '#ffffff';
		context.font = `24px ${FontName.PressStart2P}`;
		context.textAlign = 'center';
		context.fillText('SPACE', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3 - 20);
		context.fillText('RAIDER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3 + 20);
	}

	renderMenu() {
		const startY = CANVAS_HEIGHT / 2 + 20;
		const lineHeight = 40;

		context.font = `12px ${FontName.PressStart2P}`;
		context.textAlign = 'center';

		// new game option
		if (this.selectedIndex === 0) {
			context.fillStyle = '#ffff00';
			context.fillText('> New Game <', CANVAS_WIDTH / 2, startY);
		} else {
			context.fillStyle = '#ffffff';
			context.fillText('New Game', CANVAS_WIDTH / 2, startY);
		}

		// continue option (only if save exists)
		if (this.hasSaveFile) {
			if (this.selectedIndex === 1) {
				context.fillStyle = '#ffff00';
				context.fillText('> Continue <', CANVAS_WIDTH / 2, startY + lineHeight);
			} else {
				context.fillStyle = '#ffffff';
				context.fillText('Continue', CANVAS_WIDTH / 2, startY + lineHeight);
			}
		}

		// controls hint
		context.fillStyle = '#888888';
		context.font = `8px ${FontName.PressStart2P}`;
		context.fillText('W/S or UP/DOWN to select', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 60);
		context.fillText('ENTER or SPACE to confirm', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 40);
		context.fillText('Press H during game to save', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 20);
	}

	renderHighScore() {
		const highScore = SaveManager.getHighScore();
		if (highScore > 0) {
			context.fillStyle = '#ffff00';
			context.font = `8px ${FontName.PressStart2P}`;
			context.textAlign = 'center';
			context.fillText(`HIGH SCORE: ${highScore}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3 + 60);
		}
	}
}