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
            if(Room.getFreeSpacesAround(sources[i], 3).length > 0) {
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
    getContainers(creep) {
        return Game.rooms[creep.memory.origin].find(FIND_STRUCTURES)
            .filter(s => {
                if(s.structureType == STRUCTURE_CONTAINER) {
                    return s;
                }
            })
            .sort((a, b) => {
                return (Math.abs(a.pos.x - creep.pos.x) + Math.abs(a.pos.y - creep.pos.y)) -
                        (Math.abs(b.pos.x - creep.pos.x) + Math.abs(b.pos.y - creep.pos.y));
            });
    }
    getConstructionSites(creep) {
        return Game.rooms[creep.memory.origin].find(FIND_MY_CONSTRUCTION_SITES)
            .sort((c1, c2) => { return c2.progress - c1.progress; });
    }
    getRepairSites(creep) {
        return Game.rooms[creep.memory.origin].find(FIND_STRUCTURES).filter(structure => {
            if(structure.hits < structure.hitsMax) {return structure;}
        });
    }
    checkWorkerState(creep) {
        if(creep.memory.working === undefined) {
            creep.memory.working = true;
        }
        if(creep.store[RESOURCE_ENERGY] == 0 && creep.memory.working == true) {
            creep.memory.working = false;
            creep.memory.sourceId = this.getFreeSource(creep);
        }
        else if(creep.store[RESOURCE_ENERGY] == creep.store.getCapacity() && creep.memory.working == false) {
            creep.memory.working = true;
            delete creep.memory.sourceId;
        }
    }
    harvestFromContainers(creep) {
        let containers = this.getContainers(creep);
        for(let i in containers) {
            let container = containers[i];
            if(container.store[RESOURCE_ENERGY] < creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
                continue;
            }
            else if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
                return;
            }
        }
        if(creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(containers[0]);
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
        let controller = Game.rooms[creep.memory.origin].controller;
        if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
            let closestSpots = Room.getFreeSpacesAround(controller, 7),
                closestSpot = creep.pos.findClosestByPath(closestSpots);
            creep.moveTo(closestSpot);
        }
    }
    build(creep, constructionSites) {
        if(creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(constructionSites[0]);
        }
    }
    repair(creep, repairSites) {
        if(creep.repair(repairSites[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(repairSites[0]);
        }
    }
}

module.exports = Creep;
