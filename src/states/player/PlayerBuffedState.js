import PlayerState from './PlayerState.js';
import PlayerStateName from '../../enums/PlayerStateName.js';

export default class PlayerBuffedState extends PlayerState {
	constructor(player) {
		super(player);
	}

	enter() {
		// TODO: Play power-up activation sound
	}

	exit() {
		// Nothing to clean up - icons handled per-frame
	}

	update(dt, gameState) {
		// Handle movement
		const isMoving = this.handleMovement();

		// Handle shooting (power-ups may modify fire rate/pattern)
		this.handleShooting(dt, gameState);

		// Update position
		super.update(dt);

		// Update power-up timers and check expiration
		this.updatePowerUpTimers(dt);

		// State transitions (priority order)
		if (this.player.isDead()) {
			this.player.stateMachine.change(PlayerStateName.Dead);
			return;
		}

		if (this.player.isInvincible) {
			this.player.stateMachine.change(PlayerStateName.Invincible);
			return;
		}

		// If no more active power-ups, return to normal state
		if (Object.keys(this.player.activePowerUps).length === 0) {
			if (isMoving) {
				this.player.stateMachine.change(PlayerStateName.Moving);
			} else {
				this.player.stateMachine.change(PlayerStateName.Idle);
			}
		}
	}

	updatePowerUpTimers(dt) {
		const expiredPowerUps = [];

		for (const [type, data] of Object.entries(this.player.activePowerUps)) {
			data.duration -= dt;
			if (data.duration <= 0) {
				expiredPowerUps.push(type);
			}
		}

		// Remove expired power-ups
		for (const type of expiredPowerUps) {
			this.player.removePowerUp(type);
			// TODO: Play power-up expired sound
		}
	}

	render(context) {
		// Render player sprite normally
		super.render(context);

		// Render buff icons with colored contours
		this.renderBuffIcons(context);
	}

	renderBuffIcons(context) {
		const iconSize = 20;
		const iconPadding = 4;
		const contourWidth = 2;

		// Position icons above the player
		let offsetX = 0;
		const startX = this.player.position.x + (this.player.dimensions.x / 2) - 
			((Object.keys(this.player.activePowerUps).length * (iconSize + iconPadding)) / 2);
		const iconY = this.player.position.y - iconSize - 8;

		for (const [type, data] of Object.entries(this.player.activePowerUps)) {
			const iconX = startX + offsetX;

			// Calculate contour color based on remaining time percentage
			const contourColor = this.getContourColor(data.duration, data.maxDuration);

			// Draw contour (colored border)
			context.strokeStyle = contourColor;
			context.lineWidth = contourWidth;
			context.strokeRect(
				iconX - contourWidth,
				iconY - contourWidth,
				iconSize + contourWidth * 2,
				iconSize + contourWidth * 2
			);

			// TODO: Draw actual buff sprite icon (for now it's placeholder with type initial)
			context.fillStyle = this.getIconBackgroundColor(type);
			context.fillRect(iconX, iconY, iconSize, iconSize);

			context.fillStyle = 'white';
			context.font = '12px Arial';
			context.textAlign = 'center';
			context.textBaseline = 'middle';
			context.fillText(
				type.charAt(0).toUpperCase(),
				iconX + iconSize / 2,
				iconY + iconSize / 2
			);

			offsetX += iconSize + iconPadding;
		}
	}

	getContourColor(remaining, max) {
		const percentage = remaining / max;

		if (percentage > 0.5) {
			// Green to Yellow (100% - 50%)
			const progress = (percentage - 0.5) / 0.5; 
			const r = Math.floor(255 * (1 - progress));
			const g = 255;
			return `rgb(${r}, ${g}, 0)`;
		} else if (percentage > 0.25) {
			// Yellow to Orange (50% - 25%)
			const progress = (percentage - 0.25) / 0.25; 
			const g = Math.floor(255 * progress);
			return `rgb(255, ${g}, 0)`;
		} else {
			// Red (25% - 0%)
			return 'rgb(255, 0, 0)';
		}
	}

	getIconBackgroundColor(type) {
		// TODO: Replace with actual sprite rendering
		const colors = {
			'rapid-fire': '#cc6600',
			'triple-shot': '#cccc00',
			'shield': '#0066cc',
			'speed-boost': '#00cc00',
			'screen-clear': '#cc0000'
		};
		return colors[type] || '#666666';
	}
}