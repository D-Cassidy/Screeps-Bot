const Phases = require('./phases');

const Harvester = require('./role.harvester');
const Upgrader = require('./role.upgrader');
const Builder = require('./role.builder');
const Miner = require('./role.miner');

const Struct = require('./struct-base');
const Extension = require('./struct-extension');
const Tower = require('./struct-tower');
const Container = require('./struct-container');

class Spawner extends Struct {
    constructor(structureType) {
        super(STRUCTURE_SPAWN);
    }
    buildTODOList(room, s) {
        let phase = Phases.getPhaseDetails(room),
            todo = room.memory.buildingTODO;
        Extension.buildInRoom(room, s);
        Tower.buildInRoom(room, s);
        Container.buildInRoom(room);
        for(let i in todo.extensions) {
            let pos = new RoomPosition(todo.extensions[0].x, todo.extensions[0].y, todo.extensions[0].roomName);
            if(pos.createConstructionSite(STRUCTURE_EXTENSION) == OK) {
                console.log(`Building extension in ${room.name}`);
                todo.extensions.shift();
            }

        }
        for(let i in todo.towers) {
            let pos = new RoomPosition(todo.towers[0].x, todo.towers[0].y, todo.towers[0].roomName);
            if(pos.createConstructionSite(STRUCTURE_TOWER) == OK) {
                console.log(`Building tower in ${room.name}`);
                todo.towers.shift();
            }
        }
        for(let i in todo.containers) {
            let pos = new RoomPosition(todo.containers[0].x, todo.containers[0].y, todo.containers[0].roomName);
            if(pos.createConstructionSite(STRUCTURE_CONTAINER) == OK) {
                console.log(`Building container in ${room.name}`);
                todo.containers.shift();
            }
        }
        for(let i in todo.roads) {
            let pos = new RoomPosition(todo.roads[0].x, todo.roads[0].y, todo.roads[0].roomName);
            pos.createConstructionSite(STRUCTURE_ROAD);
            todo.roads.shift();
        }
    }
    checkForSpawn(spawner) {
        let phase = Phases.getPhaseDetails(spawner.room),
            roleCount = this.roleCount(spawner.room),
            memory = {origin: spawner.room.name, spawn: spawner.name};
        if (phase.Miner.count > 0) {
            phase.Miner.count = spawner.room.find(FIND_SOURCES).length;
        }

        if (roleCount.Harvester < phase.Harvester.count) {
            memory.role = Harvester.roleName;
            this.spawnDrone(spawner, memory, roleCount);
        }
        else if (roleCount.Miner < phase.Miner.count) {
            memory.role = Miner.roleName;
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
            dName = 'Drone ' + memory.role.charAt(0) + Game.time % 10000,
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
