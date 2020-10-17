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
        if(desiredTowers <= currentTowers) return;
        while(desiredTowers > 0) {
            if(desiredTower == 0) {
                break;
            }
            let pos = new RoomPosition(spawn.pos.x - 1, spawn.pos.y - 5, room.name);
            room.memory.buildingTODO.towers.push(pos);
            desiredTower--;
        }
    }
    attackHostileCreeps(tower) {
        let creeps = tower.room.find(FIND_HOSTILE_CREEPS).filter(creep => {
            if(!creep.owner.username == 'Skitterkids') {return creep;}
        });
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
