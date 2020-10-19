let Phases = [
    {}, // Controller Level 0...
    { // Controller Level 1
        Level: 1,
        desiredExtensions: 5,

        // Phase 1 Goal: build 5 extensions
        checkGoal: (room) => {
            let phase = Phases.getPhaseDetails(room),
                desiredExtensionCount = phase.desiredExtensions,
                desiredContainerCount = room.find(FIND_SOURCES).length,
                structures = room.find(FIND_MY_STRUCTURES);
            for(name in structures) {
                let s = structures[name];
                if(s.structureType == STRUCTURE_EXTENSION) {
                    desiredExtensionCount--;
                }
                if(s.structureType == STRUCTURE_CONTAINER) {
                    desiredContainerCount--;
                }
            }
            if(desiredExtensionCount <= 0 && desiredContainerCount <= 0) {
                return true;
            }
            return false;
        },

        Harvester: {
            body: [WORK, CARRY, MOVE, MOVE],
            count: 2
        },
        Upgrader: {
            body: [WORK, CARRY, MOVE, MOVE],
            count: 4
        },
        Builder: {
            body: [WORK, CARRY, MOVE, MOVE],
            count: 4
        },
        Miner: {
            body: [],
            count: 0
        },
        'Remote-Miner': {
            body: [],
            count: 0
        },
        Settler: {
            body:[],
            count:0
        }
    },
    { // Controller Level 2
        Level: 2,
        desiredExtensions: 10,
        desiredTowers: 1,

        // Phase 2 Goal: build 10 extensions and 1 tower
        checkGoal: (room) => {
            let phase = Phases.getPhaseDetails(room);
            let desiredExtensionCount = phase.desiredExtensions,
                desiredTowerCount = phase.desiredTowers;
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
            body: [WORK, CARRY, MOVE, MOVE],
            count: 2
        },
        Upgrader: {
            body: [WORK, CARRY, MOVE, MOVE],
            count: 3
        },
        Builder: {
            body: [WORK, CARRY, MOVE, MOVE],
            count: 3
        },
        Miner: {
            body: [WORK, WORK, WORK, WORK ,WORK, MOVE],
            count: 1
        },
        'Remote-Miner': {
            body: [],
            count: 0
        },
        Settler: {
            body:[],
            count:0
        }
    },
    { // Controller Level 3
        Level: 3,
        desiredExtensions: 20,
        desiredTowers: 1,

        // Phase 3 Goal: no goal yet
        checkGoal: (room) => {
            return false;
        },

        Harvester: {
            body: [WORK, CARRY, MOVE],
            count: 2
        },
        Upgrader: {
            body: [WORK, CARRY, MOVE],
            count: 3
        },
        Builder: {
            body: [WORK, CARRY, MOVE],
            count: 3
        },
        Miner: {
            body: [WORK, WORK, WORK, WORK ,WORK, MOVE],
            count: 1
        },
        'Remote-Miner': {
            body: [],
            count: 0
        },
        Settler: {
            body:[],
            count:0
        }
    }
];

Phases.getPhaseDetails = function(room) {
    let phaseNo = room.memory.phase;
    while(!Phases[phaseNo]) {
        phaseNo--;
        if(phaseNo == 0) {
            console.log(`Phase does not exist in room ${room.name}`);
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
