const Creep = require('./creeps');

class Builder extends Creep {
    constructor() {
        super('Builder');
    }
    run(creep) {
        this.checkWorkerState(creep);
        if(!creep.memory.working) {
            // RUN HARVEST CODE HERE
        }
        else {
            // RUN BUILD CODE HERE
        }
    }
}

module.exports = new Upgrader();
