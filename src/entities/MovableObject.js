import Vector2 from "../../lib/Vector2";

export default class MovableObject extends GameObject {
    constructor(x = 0, y = 0, width = 0, height = 0, speed = 0) {
        super(x, y, width, height);
        this.velocity = new Vector2(0, 0);
        this.speed = speed;
        this.maxSpeed = speed;
    }

    move(deltaTime) {

    }

    setVelocity(vector) {
        this.velocity = vector;
    }
}