class Room {
    getSpacesAround(object, size) {
        let xStart = object.pos.x - parseInt(size / 2),
            yStart = object.pos.y - parseInt(size / 2),
            spaces = [];
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                spaces.push(new RoomPosition(xStart + j, yStart + i, object.room.name));
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
