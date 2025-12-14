import CollisionLayer from "../enums/CollisionLayer.js";
import Colors from "../enums/Colors.js";
import { DEBUG } from "../globals.js";
import Entity from "./Entity.js";

export default class Shield extends Entity {
    constructor(x, y, width, height, angle) {
        let radius = (Math.max(width, height) * 1.2) / 2
        super(x, y, radius * 2, radius * 2, angle);
        this.radius = radius;
    }

    update(dt) {
        super.update(dt)
    }

    render(context) {
        if (!this.isVisible) return;
        
        context.save();
        context.globalAlpha = this.alpha;
        context.translate(this.position.x, this.position.y);
        context.rotate(this.angle * Math.PI / 180);
        context.beginPath();
        context.arc(0, 0, this.radius, 0, Math.PI * 2);
        context.lineWidth = 5;
        context.strokeStyle = Colors.BLUE;
        context.stroke();
        context.closePath();
        context.restore();
    }

    updateLocation(x, y, angle) {
        this.position.x = x
        this.position.y = y
        this.angle = angle
    }
}