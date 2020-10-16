const Creep = require('./creeps');
const Upgrader = require('./role.upgrader');

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
            let structures = this.getTransferrableStructures(creep);
            if(structures.length > 0) {
                this.transfer(creep, structures);
            }
            Upgrader.run(creep);
        }
    }
}

module.exports = new Harvester();
