const Phases = require('./phases');

class Room {
    initRoomMemory(room) {
        let roomMem = room.memory || room;
        if(!roomMem.phase) {
            console.log(`Initializing Phase No. in ${room.name}`);
            roomMem.phase = Phases.getCurrentPhaseNo(room);
        }
        let phase = Phases.getPhaseDetails(room);
        if(!roomMem.buildingTODO) {
            console.log(`Initializing Building TODO in ${room.name}`);
            roomMem.buildingTODO = {};
        }
        let todo = roomMem.buildingTODO;
        if(!todo.extensions) {
            todo.extensions = [];
        }
        if(!todo.towers) {
            todo.towers = [];
        }
        if(!todo.roads) {
            todo.roads = [];
        }
        if(!todo.containers) {
            todo.containers = [];
        }
    }
    getSpacesAround(object, size, opts = {}) {
        let radius = parseInt(size / 2),
            xStart = object.pos.x - radius,
            yStart = object.pos.y - radius,
            spaces = [];
        if(!opts.isCheckerBoard) {
            for(let i = 0; i < size; i++) {
                for(let j = 0; j < size; j++) {
                    spaces.push(new RoomPosition(xStart + j, yStart + i, object.room.name));
                }
            }
        }
        if(opts.isCheckerBoard) {
            for(let i = 0; i < size; i++) {
                for(let j = 0; j < size; j++) {
                    if((j % 2 == 0 && i % 2 == 0) || (j % 2 == 1 && i % 2 == 1)) {
                        spaces.push(new RoomPosition(xStart + j, yStart + i, object.room.name));
                    }
                }
            }
        }
        return spaces;
    }
    getFreeSpacesAround(object) {
        return this.getSpacesAround(object, 3).filter(s => {
            if(s.lookFor(LOOK_TERRAIN) != 'wall' && s.lookFor(LOOK_CREEPS).length == 0) {
                return s;
            }
        })
    }
}

module.exports = new Room();
