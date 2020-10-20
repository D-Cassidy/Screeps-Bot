const Creep = require('./creeps');

class Settler extends Creep {
    constructor() {
        super('Settler');
    }
    run(creep) {
        if(!creep.memory.roomToClaim) {
            creep.memory.roomToClaim = 'E46S41';
        }
        if(creep.room.name != creep.memory.roomToClaim) {
            let exitDir = creep.room.findExitTo(creep.memory.roomToClaim);
            let exit = creep.pos.findClosestByPath(exitDir);
            creep.moveTo(exit);
        }
        else if(creep.room.name == creep.memory.roomToClaim) {
            if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
}

module.exports = new Settler();
