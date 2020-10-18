const Phases = require('./phases');
const Struct = require('./struct-base');
const Harvester = require('./role.harvester');
const Upgrader = require('./role.upgrader');
const Builder = require('./role.builder');
const Extension = require('./struct-extension');
const Tower = require('./struct-tower');
const creepNames = require('./creepNames');

class Spawner extends Struct {
    constructor(structureType) {
        super(STRUCTURE_SPAWN);
    }
    buildTODOList(room, s) {
        let phase = Phases.getPhaseDetails(room),
            todo = room.memory.buildingTODO;
        Extension.buildInRoom(room, s);
        Tower.buildInRoom(room, s);
        for(let i in todo.extensions) {
            if(!todo.extensions[i]) {
                continue;
            }
            let pos = new RoomPosition(todo.extensions[i].x, todo.extensions[i].y, todo.extensions[i].roomName);
            pos.createConstructionSite(STRUCTURE_EXTENSION);
            todo.extensions.splice(i);
            i--;
        }
        for(let i in todo.towers) {
            if(!todo.extensions[i]) {
                continue;
            }
            let pos = new RoomPosition(todo.towers[i].x, todo.towers[i].y, todo.towers[i].roomName);
            pos.createConstructionSite(STRUCTURE_TOWER);
            todo.towers.splice(i);
            i--;
        }
        for(let i in todo.roads) {
            if(!todo.extensions[i]) {
                continue;
            }
            let pos = new RoomPosition(todo.roads[i].x, todo.roads[i].y, todo.roads[i].roomName);
            pos.createConstructionSite(STRUCTURE_ROAD);
            todo.roads.splice(i);
            i--;
        }
    }
    checkForSpawn(spawner) {
        let phase = Phases.getPhaseDetails(spawner.room),
            roleCount = this.roleCount(spawner.room),
            memory = {origin: spawner.room.name, spawn: spawner.name};
        if (roleCount.Harvester < phase.Harvester.count) {
            memory.role = Harvester.roleName;
            this.spawnDrone(spawner, memory, roleCount);
        }
        else if (roleCount.Upgrader < phase.Upgrader.count) {
            memory.role = Upgrader.roleName;
            this.spawnDrone(spawner, memory, roleCount);
        }
        else if (roleCount.Builder < phase.Builder.count) {
            memory.role = Builder.roleName;
            this.spawnDrone(spawner, memory, roleCount);
        }
    }
    spawnDrone(spawner, memory, roleCount, opts = {}) {
        let phase = Phases.getPhaseDetails(spawner.room),
            dName = creepNames[Game.time % creepNames.length] + ' ' + memory.role.charAt(0),
            body;
        if(roleCount.Harvester == 0) {
            body = this.createCreepBody(spawner, phase[memory.role].body, {panic: true});
        }
        else {
            body = this.createCreepBody(spawner, phase[memory.role].body)
        }
        if (spawner.spawnCreep(body, dName, {dryRun: true}) == OK) {
            console.log(`Creating Drone in ${spawner.room.name}. Welcome ${dName}, please enjoy your short existence...`);
            spawner.spawnCreep(body, dName, {memory: memory});
        }
    }
    createCreepBody(spawner, creepBodyBase, opts = {}) {
        let availableEnergy,
            creepBodyBaseCost = this.getCreepBodyCost(creepBodyBase),
            creepBody = [],
            n;
        if(opts.panic) {
            availableEnergy = parseInt(spawner.room.energyAvailable);
        }
        else {
            availableEnergy = parseInt(spawner.room.energyCapacityAvailable)
        }
        n = parseInt(availableEnergy / creepBodyBaseCost);
        while(n != 0) {
            creepBody = creepBody.concat(creepBodyBase);
            n--;
        }
        return creepBody;
    }
    getCreepBodyCost(body) {
        return body.reduce((total, part) => {
            return total + BODYPART_COST[part];
        }, 0);
    }
    run(spawner) {
        if(spawner.spawning) {
            this.displaySpawningText(spawner);
        }
        if(Game.time % 25 == 3) {
            this.checkForSpawn(spawner);
        }
    }
}

module.exports = new Spawner();
