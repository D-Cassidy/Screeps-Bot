const Creep = require('./creeps');
const Upgrader = require('./role.upgrader');

class Builder extends Creep {
    constructor() {
        super('Builder');
    }
    run(creep) {
        this.checkWorkerState(creep);
        if(!creep.memory.working) {
            this.harvest(creep);
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
