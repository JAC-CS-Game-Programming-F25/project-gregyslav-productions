import Sprite from "../../lib/Sprite.js";
import Colors from "../enums/Colors.js";
import ImageName from "../enums/ImageName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, images } from "../globals.js";

export default class HealthDisplay {
    constructor(bossMaxHealth) {
        this.bossMaxHealth = bossMaxHealth
        this.bossHealthBar = null;
        this.playerLives = [];
        this.playerHeartSprite = new Sprite(images.get(ImageName.Hearts), 64, 0, 16, 16);
        this.playerHealth = 3;
        this.bossHealth = bossMaxHealth;
    }
    
    updateHealthDisplay(playerHealth, bossHealth) {
        this.playerHealth = playerHealth
        this.bossHealth = bossHealth
    }

    render(context) {
        context.save();
        let healthFraction = this.bossHealth / this.bossMaxHealth

        let color = healthFraction < 0.66 ? healthFraction < 0.33 ? Colors.RED : Colors.YELLOW : Colors.GREEN

        context.beginPath();
        context.fillStyle = '#2c2c2cff';
		context.rect((CANVAS_WIDTH / 2) - (CANVAS_WIDTH / 4), (CANVAS_HEIGHT / 15), (CANVAS_WIDTH / 2), (CANVAS_HEIGHT / 15));
		context.fill();
		context.closePath();

        context.beginPath();
        context.fillStyle = color;
		context.rect((CANVAS_WIDTH / 2) - (CANVAS_WIDTH / 4) + 2, (CANVAS_HEIGHT / 15) + 2, ((CANVAS_WIDTH / 2) - 4) * healthFraction, (CANVAS_HEIGHT / 15) - 4);
		context.fill();
		context.closePath();

        for (let index = 0; index < this.playerHealth; index++) {
            this.playerHeartSprite.render(50 + (index * 30), CANVAS_HEIGHT - 50, {x: 1.5, y: 1.5});
        }
		context.restore();
    }
}