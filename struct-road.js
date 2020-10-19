const Phases = require('./phases');
const Room = require('./rooms');
const Struct = require('./struct-base');

class Road extends Struct {
    constructor() {
        super(STRUCTURE_ROAD);
    }
    buildInRoom(room, spawner) {
        let phase = Phases.getPhaseDetails(room),
            desireRoads = phase.desireRoads || false;
        if(Game.time % 1000 != 3) return;
        if(!desireRoads) return;
        let sources = room.find(FIND_SOURCES);
        for(let i in sources) {
            let source = sources[i],
                path;
            path = room.findPath(spawner.pos, source.pos, {ignoreCreeps: true, avoid: [source.pos]});
            while(path.length != 0) {
                let pos = new RoomPosition(path[0].x, path[0].y, room.name);
                if(pos.lookFor(LOOK_CONSTRUCTION_SITES).length == 0 && pos.lookFor(LOOK_STRUCTURES).length == 0) {
                    room.memory.buildingTODO.roads.push(pos);
                }
                path.shift();
            }
        }
    }
}

module.exports = new Road();
