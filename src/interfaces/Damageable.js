export default class Damageable {
    constructor(maxHealth, currentHealth) {
        this.maxHealth = maxHealth;
        this.currentHealth = currentHealth;
    }

    takeDamage(amount) {
        this.currentHealth -= amount;
    }

    heal(amount) {
        this.currentHealth += amount;
    }

    isDead() {
        return this.currentHealth <= 0;
    }

    getHealthPercentage() {
        return (this.currentHealth / this.maxHealth) * 100;
    }
}