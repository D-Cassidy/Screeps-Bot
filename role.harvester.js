const Creep = require('./creeps');

class Harvester extends Creep {
    constructor() {
        super('Harvester');
    }
    run(creep) {
        this.checkWorkerState(creep);
        if(!creep.memory.working) {
            this.harvest(creep);
        }
        else {
            this.transfer(creep);
        }
    }
}

module.exports = new Harvester();
