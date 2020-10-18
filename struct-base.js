const Phases = require('./phases');
const Room = require('./rooms');

class Struct {
    constructor(structureType) {
        this.structureType = structureType;
    }
    roleCount(room) {
        let roleCount = Object.values(Game.creeps).reduce((obj, creep) => {
            if(creep.memory.origin == room.name || creep.memory.shardWide) {
                if(!obj[creep.memory.role]) {
                    obj[creep.memory.role] = 0;
                }
                obj[creep.memory.role]++;
                return obj;
            }
            return obj;
        }, {
            Harvester: 0,
            Upgrader: 0,
            Builder: 0
        } );
        // Print role counts
        let phase = Phases.getPhaseDetails(room);
        console.log(
            `|`,
            `Harvesters: ${roleCount.Harvester || 0} |`,
            `Upgraders: ${roleCount.Upgrader || 0} |`,
            `Builders: ${roleCount.Builder || 0} |`,
            `in ${room.name} (Phase ${phase.Level || 0})`
        );
        return roleCount;
    }
    getExtensionCount(room) {
        let built = room.find(FIND_MY_STRUCTURES).reduce((total, s) => {
            if(s.structureType == STRUCTURE_EXTENSION) {
                return total + 1;
            }
            return total;
        }, 0);
        let constructing = room.find(FIND_CONSTRUCTION_SITES).reduce((total, s) => {
            if(s.structureType == STRUCTURE_EXTENSION) {
                return total + 1;
            }
            return total;
        }, 0);
        return built + constructing;
    }
    getTowerCount(room) {
        let built = room.find(FIND_MY_STRUCTURES).reduce((total, s) => {
            if(s.structureType == STRUCTURE_TOWER) {
                return total + 1;
            }
            return total;
        }, 0);
        let constructing = room.find(FIND_CONSTRUCTION_SITES).reduce((total, s) => {
            if(s.structureType == STRUCTURE_TOWER) {
                return total + 1;
            }
            return total;
        }, 0);
        return built + constructing;
    }
    displaySpawningText(spawn) {
        var percent = parseInt((spawn.spawning.needTime - spawn.spawning.remainingTime) / spawn.spawning.needTime * 100);
        spawn.room.visual.text(
            `Constructing ${spawn.spawning.name} (%${percent})`,
            spawn.pos.x + 1,
            spawn.pos.y,
            { size: '0.5', align: 'left', opacity: 0.8, font: 'bold italic 0.75 Comic Sans' }
        );
    }
}

module.exports = Struct;
