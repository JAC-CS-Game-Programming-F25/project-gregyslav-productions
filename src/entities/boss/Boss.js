export default class Boss {
    constructor(x, y, width, height, health, name, ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.health = health;
        this.name = name;
    }

    update(dt) {
        
    }

    render(canvas) {
        
    }

    takeDamage(amount) {
        this.health -= amount;
    }

    checkPhaseTransition() {
        
    }

    selectAttack() {

    }

    executeAttack() {

    }

    onPhaseChange(newPhase) {

    }

    onDefeat() {

    }
}