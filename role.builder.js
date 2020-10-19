const Creep = require('./creeps');
const Upgrader = require('./role.upgrader');
const Container = require('./struct-container');

class Builder extends Creep {
    constructor() {
        super('Builder');
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
            let constructionSites = this.getConstructionSites(creep);
            if(constructionSites.length > 0) {
                this.build(creep, constructionSites);
            }
            else {
                Upgrader.run(creep);
            }
        }
    }
}

module.exports = new Builder();
