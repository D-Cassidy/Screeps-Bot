const Struct = require('./struct-base');

class Extension extends Struct {
    constructor() {
        super(STRUCTURE_EXTENSION);
    }
}

module.exports = new Extension();
