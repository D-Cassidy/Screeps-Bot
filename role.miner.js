const Creep = require('./creeps');
const Upgrader = require('./role.upgrader');

class Miner extends Creep {
    constructor() {
        super('Miner');
    }
    run(creep) {
        let container = Game.getObjectById(creep.memory.container) || undefined;
        if(!creep.memory.container) {
            let containers = this.getContainers(creep);
            for(let i in containers) {
                let container = containers[i];
                if(container.pos.lookFor(LOOK_CREEPS).length > 0) {
                    continue;
                }
                creep.memory.container = container.id;
            }
            return;
        }

        if(creep.memory.container) {
            let source = Game.getObjectById(creep.memory.sourceId) || undefined;
            if(creep.pos.x != container.pos.x || creep.pos.y != container.pos.y) {
                creep.moveTo(container);
            }
            else if(creep.memory.sourceId) {
                this.harvest(creep);
            }
            else {
                creep.memory.sourceId = creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES)).id;
            }
        }
    }
}

module.exports = new Miner();
