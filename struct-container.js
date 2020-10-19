const Phases = require('./phases');
const Room = require('./rooms');
const Struct = require('./struct-base');

class Container extends Struct {
    constructor() {
        super(STRUCTURE_CONTAINER);
    }
    buildInRoom(room) {
        let phase = Phases.getPhaseDetails(room),
            desiredContainers = room.find(FIND_SOURCES).length,
            currentContainers = this.getContainerCount(room) + room.memory.buildingTODO.containers.length;
        if(desiredContainers <= currentContainers) return;
        desiredContainers -= currentContainers;
        console.log(`Marking locations for container placement in ${room.name}`);
        while(desiredContainers > 0) {
            let sources = room.find(FIND_SOURCES);
            for(let i in sources) {
                let hasContainer = false,
                    source = sources[i],
                    spaces = Room.getFreeSpacesAround(source, 3, {excludeCreeps: true});
                for(let j in spaces) {
                    let space = spaces[j];
                    if(space.lookFor(LOOK_STRUCTURES) == STRUCTURE_CONTAINER) {
                        hasContainer = true;
                        desiredContainers--;
                    }
                }
                if(hasContainer) continue;
                room.memory.buildingTODO.containers.push(spaces[0]);
                console.log("Pushing container location into memory...");
                desiredContainers--;
            }
        }
    }
}

module.exports = new Container();
