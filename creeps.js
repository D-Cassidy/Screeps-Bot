const Room = require('./rooms');

const pathStyle = {
    fill: 'transparent',
    stroke: '#fff',
    lineStyle: 'dashed',
    strokeWidth: .15,
    opacity: .1
};

class Creep {
    constructor(roleName) {
        this.roleName = roleName;
    }
    is(creep) {
        return creep.memory.role == this.roleName;
    }
    getFreeSource(creep) {
        let sources = Game.rooms[creep.memory.origin].find(FIND_SOURCES);
        for(let i in sources) {
            if(Room.getFreeSpacesAround(sources[i]).length > 0) {
                return sources[i].id;
            }
        }
        return sources[0].id;
    }
    getTransferrableStructures(creep) {
        return Game.rooms[creep.memory.origin].find(FIND_MY_STRUCTURES)
            .filter(s => {
                if((s.structureType == STRUCTURE_SPAWN ||
                s.structureType == STRUCTURE_EXTENSION ||
                s.structureType == STRUCTURE_TOWER ||
                s.structureType == STRUCTURE_CONTAINER ||
                s.structureType == STRUCTURE_STORAGE) &&
                s.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                    return s;
                }
            });
    }
    getConstructionSites(creep) {
        return Game.rooms[creep.memory.origin].find(FIND_MY_CONSTRUCTION_SITES)
            .sort((c1, c2) => { return c2.progress - c1.progress; });
    }
    checkWorkerState(creep) {
        if(creep.memory.working === undefined) {
            creep.memory.working = true;
        }
        if(creep.store[RESOURCE_ENERGY] == 0 && creep.memory.working == true) {
            creep.memory.working = false;
            creep.memory.sourceId = this.getFreeSource(creep);
            creep.say('BEEP');
        }
        else if(creep.store[RESOURCE_ENERGY] == creep.store.getCapacity() && creep.memory.working == false) {
            creep.memory.working = true;
            delete creep.memory.sourceId;
            creep.say('BOOP');
        }
    }
    harvest(creep) {
        let source = Game.getObjectById(creep.memory.sourceId);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: pathStyle});
        }
    }
    transfer(creep, structures) {
        if(creep.transfer(structures[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(structures[0], {visualizePathStyle: pathStyle});
        }
    }
    upgrade(creep) {
        let controller = Game.rooms[creep.memory.origin].controller;
        if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(controller, {visualizePathStyle: pathStyle});
        }
    }
    build(creep, constructionSites) {
        if(creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(constructionSites[0], {visualizePathStyle: pathStyle});
        }
    }
}

module.exports = Creep;
