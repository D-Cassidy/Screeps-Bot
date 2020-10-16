// Screeps-Colony
// by Whimsickal
// -------------
const Phases = require('./phases');
const Room = require('./rooms');
const Spawner = require('./struct-spawner');
const Extension = require('./struct-extension');
const Harvester = require('./role.harvester');
const Upgrader = require('./role.upgrader');
const Builder = require('./role.builder');

module.exports.loop = function() {
    for(name in Memory.creeps) {
        let creep = Game.creeps[name];
        if(!creep) {
            delete Memory.creeps[name];
        }
    }

    let spawn = Game.spawns['Hive Alpha'];
    let spacesAround = Room.getSpacesAround(spawn, 5, {isCheckerBoard: true});

    for(name in Game.rooms) {
        let room = Game.rooms[name];

        Room.initRoomMemory(room);
        Phases.checkPhaseNo(room);

        let structures = room.find(FIND_MY_STRUCTURES).filter(s => {
            if(s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_TOWER) {
                return s;
            }
        })

        for(name in structures) {
            let s = structures[name];
            if(s.structureType == STRUCTURE_SPAWN) {
                if(Game.time % 100 == 3) {
                    Extension.buildExtensionsInRoom(room, s);
                }
                Spawner.run(s);
            }
            else if(s.structureType == STRUCTURE_TOWER) {
                // RUN TOWER CODE HERE
                ;
            }
        }
    }

    for(name in Game.creeps) {
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
