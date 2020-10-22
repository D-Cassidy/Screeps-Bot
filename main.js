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
const Miner = require('./role.miner');
const Settler = require('./role.settler');
const RemoteBuilder = require('./role.remote-builder');
const TauntBot = require('./role.taunt-bot');

const rickRoll = require('./keepRollinAndRollin');

// TODO:
// Room scouting and scoring
// Room defenses (walls, ramparts)
// Storage?

module.exports.loop = function() {
    for(let name in Memory.creeps) {
        let creep = Game.creeps[name];
        if(!creep) {
            console.log(`Holy shit ${name} from ${Memory.creeps[name].origin} is fucking dead oh my god...`);
            delete Memory.creeps[name];
        }
    }

    for(let name in Game.rooms) {
        let room = Game.rooms[name];
        if(!room.controller.my) {
            continue;
        }
        /*
        if(room.name == 'E46S41') {
            let sites = room.find(FIND_CONSTRUCTION_SITES);
            for(let name in sites) {
                let site = sites[name];
                site.remove();
            }
        }*/

        Room.initRoomMemory(room);
        //if(Game.time % 10 == 3) {
        Phases.checkPhaseNo(room);
        //}

        let structures = room.find(FIND_MY_STRUCTURES).filter(s => {
            if(s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_TOWER) {
                return s;
            }
        });
        for(let name in structures) {
            let s = structures[name];
            if(s.structureType == STRUCTURE_SPAWN) {
                Spawner.run(s);
                if(Game.time % 10 == 3) {
                    Spawner.buildTODOList(room, s);
                }
            }
            else if(s.structureType == STRUCTURE_TOWER) {
                Tower.run(s);
            }
        }
    }

    // let i = 0;
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];

        /*
        // Rick roll em baby
        if(i == Game.time % rickRoll.length % Object.keys(Game.creeps).length) {
            creep.say(rickRoll[Game.time % rickRoll.length]);
        }
        i++;
        */

        if(Harvester.is(creep)) {
            Harvester.run(creep);
        }
        else if(Miner.is(creep)) {
            Miner.run(creep);
        }
        else if(Upgrader.is(creep)) {
            Upgrader.run(creep);
        }
        else if(Builder.is(creep)) {
            Builder.run(creep);
        }
        else if(Settler.is(creep)) {
            Settler.run(creep);
        }
        else if(RemoteBuilder.is(creep)) {
            RemoteBuilder.run(creep);
        }
        else if(TauntBot.is(creep)) {
            TauntBot.run(creep);
        }
    }
};
