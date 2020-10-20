const Creep = require('./creeps');
const Upgrader = require('./role.upgrader');
const Container = require('./struct-container');

class RemoteBuilder extends Creep {
    constructor() {
        super('RemoteBuilder');
    }
    run(creep) {
        if(!creep.memory.roomOfOperations) {
            for(let name in Game.rooms) {
                let room = Game.rooms[name];
                if(room.memory.isSettlement) {
                    creep.memory.roomOfOperations = room.name;
                    creep.memory.origin = room.name;
                }
            }
        }
        if(creep.room.name != creep.memory.origin) {
            let exitDir = creep.room.findExitTo(creep.memory.origin);
            let exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
            return;
        }

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

module.exports = new RemoteBuilder();
