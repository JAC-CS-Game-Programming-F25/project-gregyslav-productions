export default class AttackPattern {
    constructor(name, bulletPattern, bulletPattern, bulletCount, bulletSpeed, spreadAngle, cooldown) {
        this.name = name;
        this.bulletPattern = bulletPattern;
        this.bulletCount = bulletCount;
        this.bulletSpeed = bulletSpeed;
        this.spreadAngle = spreadAngle;
        this.cooldown = cooldown;
    }
}