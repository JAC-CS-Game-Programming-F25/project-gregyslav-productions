export default class Boss extends Entity {
    constructor(x, y, width, height, health, name, ) {
        super(x, y, width, height);
        this.health = health;
        this.name = name;
    }

    update(dt) {
        super.update(dt);
    }

    render(canvas) {
        super.render(canvas);
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