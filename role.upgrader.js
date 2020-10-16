const Creep = require('./creeps');

class Upgrader extends Creep {
    constructor() {
        super('Upgrader');
    }
    run(creep) {
        this.checkWorkerState(creep);
        if(!creep.memory.working) {
            this.harvest(creep);
        }
        else {
            this.upgrade(creep);
        }
    }
}

module.exports = new Upgrader();
