import Boss from "./Boss";

const MECH_BOSS_LEFT_MISSILE_OFFSET = { x: -30, y: 20 };
const MECH_BOSS_RIGHT_MISSILE_OFFSET = { x: 30, y: 20 };

export default class MechBoss extends Boss {
    constructor(x, y, width, height, health, attackPatterns) {
        super(x, y, width, height, health);
        this.attackPatterns = attackPatterns;


    }

    executeAttack() {

    }

    onPhaseChange(newPhase) {

    }

    onDefeat() {

    }

    laserBarrage() {

    }

    missileSwarm() {

    }

    shieldBash() {

    }
}