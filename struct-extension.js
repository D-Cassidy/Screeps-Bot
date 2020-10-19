const Phases = require('./phases');
const Room = require('./rooms');
const Struct = require('./struct-base');

class Extension extends Struct {
    constructor() {
        super(STRUCTURE_EXTENSION);
    }
    buildInRoom(room, spawner) {
        let phase = Phases.getPhaseDetails(room),
            desiredExtensions = phase.desiredExtensions,
            currentExtensions = this.getExtensionCount(room) + room.memory.buildingTODO.extensions.length,
            i = 5;
        if(desiredExtensions <= currentExtensions) return;
        desiredExtensions -= currentExtensions;
        console.log(`Marking locations for extension placement in ${room.name}`);
        while(desiredExtensions > 0) {
            let possibleSpaces = Room.getSpacesAround(spawner, i, {isCheckerBoard: true});
            for(let j in possibleSpaces) {
                let space = possibleSpaces[j];
                if(desiredExtensions == 0) {
                    break;
                }
                if(space.lookFor(LOOK_TERRAIN) == 'wall') {
                    continue;
                }
                else if(space.lookFor(LOOK_STRUCTURES).length > 0 || space.lookFor(LOOK_CONSTRUCTION_SITES).length > 0) {
                    continue;
                }
                else {
                    room.memory.buildingTODO.extensions.push(space);
                    console.log("Pushing extension location into memory...");
                    desiredExtensions--;
                }
            }
            i += 2;
        }
    }
}

module.exports = new Extension();
