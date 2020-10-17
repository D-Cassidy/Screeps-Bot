const Phases = require('./phases');
const Room = require('./rooms');

class Struct {
    constructor(structureType) {
        this.structureType = structureType;
    }
    buildTODOList(room) {
        let phase = Phases.getPhaseDetails(room),
            todo = room.memory.buildingTODO;
        for(let i in todo.extensions) {
            let pos = todo.extensions[i];
            pos.createConstructionSite(STRUCTURE_EXTENSION);
        }
        for(let i in todo.towers) {
            let pos = todo.towers[i];
            pos.createConstructionSite(STRUCTURE_TOWER);
        }
        for(let i in todo.roads) {
            let pos = todo.roads[i];
            pos.createConstructionSite(STRUCTURE_ROAD);
        }
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
        }, {} );
        // Print role counts
        console.log(
            `|`,
            `Harvesters: ${roleCount.Harvester} |`,
            `Upgraders: ${roleCount.Upgrader} |`,
            `Builders: ${roleCount.Builder} |`,
            `in ${room.name}`
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
