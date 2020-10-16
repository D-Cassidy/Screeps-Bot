let Phases = [
    {}, // Controller Level 0...
    { // Controller Level 1
        Level: 1,

        // Phase 1 Goal: build 5 extensions
        checkGoal: (room) => {
            let desiredExtensionCount = 5,
                structures = room.find(FIND_MY_STRUCTURES);
            for(name in structures) {
                let s = structures[name];
                if(s.structureType == STRUCTURE_EXTENSION) {
                    desiredExtensionCount--;
                }
            }
            if(desiredExtensionCount <= 0) {
                return true;
            }
            return false;
        },

        Harvester: {
            body: [WORK, CARRY, MOVE],
            count: 2
        },
        Upgrader: {
            body: [WORK, CARRY, MOVE],
            count: 4
        },
        Builder: {
            body: [WORK, CARRY, MOVE],
            count: 4
        },
        'Remote-Miner': {
            body: [],
            count: 0
        }
    },
    { // Controller Level 2
        Level: 2,

        // Phase 2 Goal: build 10 extensions and 1 tower
        checkGoal: (room) => {
            let desiredExtensionCount = 10,
                desiredTowerCount = 1;
                structures = room.find(FIND_MY_STRUCTURES);
            for(name in structures) {
                let s = structures[name];
                if(s.structureType == STRUCTURE_EXTENSION) {
                    desiredExtensionCount--;
                }
                if(s.structureType == STRUCTURE_TOWER) {
                    desiredTowerCount--;
                }
            }
            if(desiredExtensionCount <= 0 && desiredTowerCount <= 0) {
                return true;
            }
            return false;
        },

        Harvester: {
            body: [WORK, CARRY, MOVE],
            count: 2
        },
        Upgrader: {
            body: [WORK, CARRY, MOVE],
            count: 4
        },
        Builder: {
            body: [WORK, CARRY, MOVE],
            count: 4
        },
        'Remote-Miner': {
            body: [WORK, CARRY, MOVE],
            count: 0
        }
    },
    { // Controller Level 3
        Level: 3,

        // Phase 3 Goal: no goal yet
        checkGoal: (room) => {
            return false;
        },

        Harvester: {
            body: [WORK, WORK, CARRY],
            count: 2
        },
        Upgrader: {
            body: [WORK, CARRY, MOVE],
            count: 4
        },
        Builder: {
            body: [WORK, CARRY, MOVE],
            count: 4
        },
        'Remote-Miner': {
            body: [WORK, WORK, CARRY],
            count: 1
        }
    }
];

Phases.getPhaseDetails = function(room) {
    let phaseNo = room.memory.phase;
    while(!Phases[phaseNo]) {
        phaseNo--;
        if(phaseNo == 0) {
            console.log(`Phase does not exist`);
            return false;
        }
    }
    return Phases[phaseNo];
}
Phases.getCurrentPhaseNo = function(room) {
    return room.memory.phase || 1;
}
Phases.checkPhaseNo = function(room) {
    let phase = Phases.getPhaseDetails(room);
    if(room.controller.level > room.memory.phase && phase.checkGoal(room)) {
        console.log(`Room ${room.name} has completed phase ${room.memory.phase}, moving to phase ${room.memory.phase + 1}`);
        room.memory.phase++;
    }
}

module.exports = Phases;
