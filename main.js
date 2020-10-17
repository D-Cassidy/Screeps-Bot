// Screeps-Colony
// by Whimsickal
// -------------
const Phases = require('./phases');
const Room = require('./rooms');
const Spawner = require('./struct-spawner');
const Tower = require('./struct-tower');
const Extension = require('./struct-extension');
const Harvester = require('./role.harvester');
const Upgrader = require('./role.upgrader');
const Builder = require('./role.builder');

// TODO:
// * Container mining after phase 2
// * Miner role
// * Containers as a phase 2 goals

module.exports.loop = function() {
    for(let name in Memory.creeps) {
        let creep = Game.creeps[name];
        if(!creep) {
            console.log(`Holy shit ${name} is fucking dead oh my god...`);
            delete Memory.creeps[name];
        }
    }

    for(let name in Game.rooms) {
        let room = Game.rooms[name];
        if(!room.controller.my) {
            continue;
        }
        Room.initRoomMemory(room);
        Phases.checkPhaseNo(room);
        Extension.buildTODOList(room);

        let structures = room.find(FIND_MY_STRUCTURES).filter(s => {
            if(s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_TOWER) {
                return s;
            }
        });
        for(let name in structures) {
            let s = structures[name];
            if(s.structureType == STRUCTURE_SPAWN) {
                Spawner.run(s);
                Extension.buildInRoom(room, s);
                Tower.buildInRoom(room, s);
            }
            else if(s.structureType == STRUCTURE_TOWER) {
                Tower.run(tower);
            }
        }
    }

    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        if(Harvester.is(creep)) {
            Harvester.run(creep);
        }
        else if(Upgrader.is(creep)) {
            Upgrader.run(creep);
        }
        else if(Builder.is(creep)) {
            Builder.run(creep);
        }
    }
};
