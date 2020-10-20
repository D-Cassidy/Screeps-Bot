const Phases = require('./phases');

const Struct = require('./struct-base');
const Extension = require('./struct-extension');
const Tower = require('./struct-tower');
const Container = require('./struct-container');
const Road = require('./struct-road');

const Harvester = require('./role.harvester');
const Upgrader = require('./role.upgrader');
const Builder = require('./role.builder');
const Miner = require('./role.miner');
const RemoteBuilder = require('./role.remote-builder');
const TauntBot = require('./role.taunt-bot');

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
        Road.buildInRoom(room, s);
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

        /*
        console.log(
            `|`,
            `Harvesters: ${roleCount.Harvester || 0} |`,
            `Miners: ${roleCount.Miner || 0} |`,
            `Upgraders: ${roleCount.Upgrader || 0} |`,
            `Builders: ${roleCount.Builder || 0} |`,
            `in ${spawner.room.name} (Phase ${phase.Level || 0})`
        );
        */
        if(roleCount.Harvester < phase.Harvester.count) {
            memory.role = Harvester.roleName;
            this.spawnDrone(spawner, memory, roleCount);
        }
        else if(roleCount.Miner < phase.Miner.count) {
            memory.role = Miner.roleName;
            this.spawnDrone(spawner, memory, roleCount);
        }
        else if(roleCount.Upgrader < phase.Upgrader.count) {
            memory.role = Upgrader.roleName;
            this.spawnDrone(spawner, memory, roleCount);
        }
        else if(roleCount.Builder < phase.Builder.count) {
            memory.role = Builder.roleName;
            this.spawnDrone(spawner, memory, roleCount);
        }
        else if(roleCount.RemoteBuilder < phase.RemoteBuilder.count) {
            for(let name in Memory.rooms) {
                let roomMem = Memory.rooms[name];
                if(roomMem.isSettlement) {
                    memory.role = RemoteBuilder.roleName;
                    memory.shardWide = true;
                    this.spawnDrone(spawner, memory, roleCount);
                }
            }
        }
        else if(roleCount.TauntBot < phase.TauntBot.count) {
            memory.role = TauntBot.roleName;
            memory.shardWide = true;
            this.spawnDrone(spawner, memory, roleCount);
        }
    }
    spawnDrone(spawner, memory, roleCount, opts = {}) {
        let phase = Phases.getPhaseDetails(spawner.room),
            dName = 'Rick Astley ' + memory.role.charAt(0) + Game.time % 10000,
            body;
        if(roleCount.Harvester == 0) {
            body = this.createCreepBody(spawner, memory.role, {panic: true});
        }
        else {
            body = this.createCreepBody(spawner, memory.role);
        }
        if (spawner.spawnCreep(body, dName, {dryRun: true}) == OK) {
            console.log(`Creating Drone in ${spawner.room.name}. Welcome ${dName}, please enjoy your short existence...`);
            spawner.spawnCreep(body, dName, {memory: memory});
        }
    }
    createCreepBody(spawner, role, opts = {}) {
        let phase = Phases.getPhaseDetails(spawner.room),
            availableEnergy,
            maxParts = phase[role].maxParts || 100,
            baseBody = phase[role].bodyBase,
            creepBody = phase[role].body,
            baseCost = this.getCreepBodyCost(baseBody),
            bodyCost = this.getCreepBodyCost(creepBody),
            newBody = [],
            n;
        if(opts.panic) {
            availableEnergy = parseInt(spawner.room.energyAvailable);
        }
        else {
            availableEnergy = parseInt(spawner.room.energyCapacityAvailable)
        }
        n = parseInt((availableEnergy - baseCost) / bodyCost);
        newBody = newBody.concat(baseBody);
        while(n != 0) {
            if(newBody.length + creepBody.length > maxParts) {
                break;
            }
            newBody = newBody.concat(creepBody);
            n--;
        }
        return newBody;
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
