const Creep = require('./creeps');
const Upgrader = require('./role.upgrader');
const Container = require('./struct-container');

class Harvester extends Creep {
    constructor() {
        super('Harvester');
    }
    run(creep) {
        this.checkWorkerState(creep);
        if(!creep.memory.working) {
            if(Container.roleCount(creep.room).Miner > 0) {
                this.harvestFromContainers(creep);
            }
            else {
                this.harvest(creep);
            }
        }
        else {
            let structures = this.getTransferrableStructures(creep);
            if(structures.length > 0) {
                this.transfer(creep, structures);
            }
            else {
                Upgrader.run(creep);
            }
        }
    }
}

module.exports = new Harvester();
