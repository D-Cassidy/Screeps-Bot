const Phases = require('./phases');
const Room = require('./rooms');
const Struct = require('./struct-base');

class Tower extends Struct {
    constructor() {
        super(STRUCTURE_TOWER);
    }
    buildInRoom(room, spawner) {
        let phase = Phases.getPhaseDetails(room),
            desiredTowers = phase.desiredTowers || 0,
            currentTowers = this.getTowerCount(room);
        if(desiredTowers <= currentTowers + room.memory.buildingTODO.towers.length) return;
        console.log(`Marking locations for tower placement in ${room.name}`);
        while(desiredTowers > 0) {
            let pos;
            pos = new RoomPosition(spawner.pos.x - 1, spawner.pos.y - 4, room.name);
            if((pos.lookFor(LOOK_STRUCTURES).length == 0 ||
                !(pos.lookFor(LOOK_STRUCTURES)[0].structureType == STRUCTURE_TOWER))  &&
                !pos.lookFor(LOOK_CONSTRUCTION_SITES).length > 0) {
                room.memory.buildingTODO.towers.push(pos);
                console.log("Pushing tower location into memory...");
                desiredTowers--;
            }
            if(desiredTowers == 0) {
                break;
            }
            pos = new RoomPosition(spawner.pos.x + 1, spawner.pos.y - 4, room.name);
            if((pos.lookFor(LOOK_STRUCTURES).length == 0 ||
                !(pos.lookFor(LOOK_STRUCTURES)[0].structureType == STRUCTURE_TOWER))  &&
                !pos.lookFor(LOOK_CONSTRUCTION_SITES).length > 0) {
                room.memory.buildingTODO.towers.push(pos);
                console.log("Pushing tower location into memory...");
                desiredTowers--;
            }
            if(desiredTowers == 0) {
                break;
            }
            pos = new RoomPosition(spawner.pos.x + 4, spawner.pos.y - 1, room.name);
            if((pos.lookFor(LOOK_STRUCTURES).length == 0 ||
                !(pos.lookFor(LOOK_STRUCTURES)[0].structureType == STRUCTURE_TOWER))  &&
                !pos.lookFor(LOOK_CONSTRUCTION_SITES).length > 0) {
                room.memory.buildingTODO.towers.push(pos);
                console.log("Pushing tower location into memory...");
                desiredTowers--;
            }
            if(desiredTowers == 0) {
                break;
            }
            pos = new RoomPosition(spawner.pos.x + 4, spawner.pos.y + 1, room.name);
            if((pos.lookFor(LOOK_STRUCTURES).length == 0 ||
                !(pos.lookFor(LOOK_STRUCTURES)[0].structureType == STRUCTURE_TOWER))  &&
                !pos.lookFor(LOOK_CONSTRUCTION_SITES).length > 0) {
                room.memory.buildingTODO.towers.push(pos);
                console.log("Pushing tower location into memory...");
                desiredTowers--;
            }
            if(desiredTowers == 0) {
                break;
            }
            break;
        }
    }
    attackHostileCreeps(tower) {
        let creeps = tower.room.find(FIND_HOSTILE_CREEPS);
        tower.attack(creeps[0]);
    }
    healFriendlyCreeps(tower) {
        let creeps = tower.room.find(FIND_MY_CREEPS).filter(creep => {
            if(creep.hits < creep.hitsMax) {return creep;}
        });
        tower.heal(creeps[0]);
    }
    repairStructures(tower) {
        let structures = tower.room.find(FIND_STRUCTURES).filter(structure => {
            if(structure.hits < structure.hitsMax) {return structure;}
        });
        tower.repair(structures[0]);
    }
    run(tower) {
        this.attackHostileCreeps(tower);
        this.healFriendlyCreeps(tower);
        this.repairStructures(tower);
    }
}

module.exports = new Tower();
