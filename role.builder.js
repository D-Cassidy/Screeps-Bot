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
            let repairSites = this.getRepairSites(creep),
                constructionSites = this.getConstructionSites(creep);
            if(Game.rooms[creep.memory.origin].memory.phase <= 2 && repairSites.length > 0) {
                this.repair(creep, repairSites);
            }
            else if(constructionSites.length > 0) {
                this.build(creep, constructionSites);
            }
            else {
                Upgrader.run(creep);
            }
        }
    }
}

module.exports = new Builder();
