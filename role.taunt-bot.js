const Creep = require('./creeps');
const rickRoll = require('./keepRollinAndRollin');

const targetRoom = 'E44S41';
class TauntBot extends Creep {
    constructor() {
        super('TauntBot');
    }
    run(creep) {
        if(!creep.memory.roomOfOperations) {
            creep.memory.roomOfOperations = targetRoom;
            creep.memory.origin = targetRoom;
        }
        if(creep.room.name != creep.memory.origin) {
            let exitDir = creep.room.findExitTo(creep.memory.origin);
            let exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
            return;
        }
        creep.moveTo(creep.room.controller);
        creep.say(rickRoll[Game.time % rickRoll.length]);
    }
}

module.exports = new TauntBot();
