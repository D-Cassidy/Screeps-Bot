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
            currentExtensions = this.getExtensionCount(room),
            i = 5;
        if(desiredExtensions <= currentExtensions) return;
        while(desiredExtensions > 0) {
            let possibleSpaces = Room.getSpacesAround(spawner, i, {isCheckerBoard: true});
            for(let j in possibleSpaces) {
                let space = possibleSpaces[j];
                if(space.lookFor(LOOK_TERRAIN) == 'wall') {
                    continue;
                }
                else if(space.lookFor(LOOK_STRUCTURES).length > 0 || space.lookFor(LOOK_CONSTRUCTION_SITES).length > 0) {
                    desiredExtensions--;
                }
                else {
                    space.createConstructionSite(STRUCTURE_EXTENSION);
                }
            }
            i += 2;
        }
    }
}

module.exports = new Extension();
