import MovableObject from "./MovableObject";

export default class Asteroid extends MovableObject {
    constructor(x, y, size, rotationSpeed, powerUpDropChance, currencyDropChance, health, onDestroyed, spawnDrop) {
        super(x, y, size, size, 0);
        this.size = size;
        this.rotationSpeed = rotationSpeed;
        this.powerUpDropChance = powerUpDropChance;
        this.currencyDropChance = currencyDropChance;
        this.health = health;

        this.onDestroyed = onDestroyed
        this.spawnDrop = spawnDrop;
    }

    update(dt) {
        super.update(dt);
    }

    takeDamage(amount) {
        this.health -= amount;
    }
}