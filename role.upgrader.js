const Creep = require('./creeps');
const Container = require('./struct-container');

class Upgrader extends Creep {
    constructor() {
        super('Upgrader');
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
            this.upgrade(creep);
        }
    }
}

module.exports = new Upgrader();
