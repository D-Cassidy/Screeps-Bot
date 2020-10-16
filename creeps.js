const Room = require('./rooms');

class Creep {
    constructor(roleName) {
        this.roleName = roleName;
    }
    getFreeSource(creep) {
        let sources = creep.room.find(FIND_SOURCES);
        for(let i in sources) {
            if(Room.getFreeSpacesAround(sources[i]).length > 0) {
                return sources[i].id;
            }
        }
        return sources[0].id;
    }
    getTransferrableStructures(creep) {
        return Game.rooms[creep.memory.origin].find(FIND_MY_STRUCTURES)
            .filter(structure => {
                if((structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_TOWER ||
                structure.structureType == STRUCTURE_CONTAINER ||
                structure.structureType == STRUCTURE_STORAGE) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                    return structure;
                }
            });
    }
    checkWorkerState(creep) {
        if(creep.memory.working === undefined) {
            creep.memory.working = true;
        }
        if(creep.store[RESOURCE_ENERGY] == 0 && creep.memory.working == true) {
            creep.memory.working = false;
            creep.memory.sourceId = this.getFreeSource(creep);
            creep.say('BEEP BOOP');
        }
        else if(creep.store[RESOURCE_ENERGY] == creep.store.getCapacity() && creep.memory.working == false) {
            creep.memory.working = true;
            delete creep.memory.sourceId;
            creep.say('BEEP BOOP');
        }
    }
    harvest(creep) {
        let source = Game.getObjectById(creep.memory.sourceId);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }
    transfer(creep, structures) {
        if(creep.transfer(structures[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(structures[0]);
        }
    }
    upgrade(creep) {
        let controller = creep.room.controller;
        if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(controller);
        }
    }
}

module.exports = Creep;
