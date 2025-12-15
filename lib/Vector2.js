import Vector from "./Vector.js";

export default class Vector2 extends Vector {
    constructor(x = 0, y = 0) {
        super(x, y);
    }

    multiples(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    normalize() {
        const length = Math.sqrt(this.x * this.x + this.y * this.y);
        if (length === 0) {
            return new Vector2(0, 0);
        }
        return new Vector2(this.x / length, this.y / length);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    distanceTo(vector) {
        const dx = Math.abs(this.x - vector.x);
        const dy = Math.abs(this.y - vector.y);
        return Math.sqrt(dx * dx + dy * dy);
    }
}