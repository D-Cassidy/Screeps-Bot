const Phases = require('./phases');
const Struct = require('./struct-base');
const Harvester = require('./role.harvester');
const Upgrader = require('./role.upgrader');
const Builder = require('./role.builder');
const creepNames = require('./creepNames');

class Spawner extends Struct {
    constructor(structureType) {
        super(STRUCTURE_SPAWN);
    }
    checkForSpawn(spawner) {
        let phase = Phases.getPhaseDetails(spawner.room),
            roleCount = this.roleCount(spawner.room),
            memory = {origin: spawner.room.name, spawn: spawner.name};
        if (roleCount.Harvester < phase.Harvester.count) {
            memory.role = Harvester.roleName;
            this.spawnDrone(spawner, memory);
        }
        else if (roleCount.Upgrader < phase.Upgrader.count) {
            memory.role = Upgrader.roleName;
            this.spawnDrone(spawner, memory);
        }
        else if (roleCount.Builder < phase.Builder.count) {
            memory.role = Builder.roleName;
            this.spawnDrone(spawner, memory);
        }
    }
    spawnDrone(spawner, memory) {
        let phase = Phases.getPhaseDetails(spawner.room);
        let dName = creepNames[Game.time % creepNames.length] + ' ' + memory.role.charAt(0),
            body = this.createCreepBody(spawner, phase[memory.role].body);
        if (spawner.spawnCreep(body, dName, {dryRun: true}) == OK) {
            console.log(`CREATING DRONE IN ${spawner.room.name}. WELCOME ${dName}, PLEASE ENJOY YOUR SHORT EXISTENCE`);
            spawner.spawnCreep(body, dName, {memory: memory});
        }
    }
    createCreepBody(spawner, creepBodyBase) {
        let availableEnergy = spawner.room.energyCapacityAvailable,
            creepBodyBaseCost = this.getCreepBodyCost(creepBodyBase),
            creepBody = [],
            n;
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
        if(Game.time % 10 == 3) {
            this.checkForSpawn(spawner);
        }
    }
}

module.exports = new Spawner();
