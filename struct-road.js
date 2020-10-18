const Phases = require('./phases');
const Room = require('./rooms');
const Struct = require('./struct-base');

class Road extends Struct {
    constructor() {
        super(STRUCTURE_ROAD);
    }
}

module.exports = new Road();
