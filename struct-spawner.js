const Struct = require('./struct-base');
const Harvester = require('./role.harvester');
const Upgrader = require('./role.upgrader');
const creepNames = require('./creepNames');

class Spawner extends Struct {
    checkForSpawn(spawner) {
        if(!Game.time % 10 == 3) {
            return;
        }
        let roleCount = this.roleCount(spawner.room);
        let memory = {origin: spawner.room.name, spawn: spawner.name};
        if (roleCount.Harvester < 4) {
            memory.role = Harvester.roleName;
            this.spawnDrone(spawner, memory);
        }
        else if (roleCount.Upgrader < 4) {
            memory.role = Upgrader.roleName;
            this.spawnDrone(spawner, memory);
        }
        else if (roleCount.Builder < 0) {
            memory.role = Upgrader.roleName;
            this.spawnDrone(spawner, memory);
        }
    }
    spawnDrone(spawner, memory) {
        let body = [WORK, CARRY, MOVE, MOVE];
        let dName = creepNames[Game.time % creepNames.length] + ' ' + memory.role.charAt(0);
        if (spawner.spawnCreep(body, dName, {dryRun: true}) == OK) {
            console.log(`CREATING DRONE IN ${spawner.room.name}. WELCOME ${dName}, PLEASE ENJOY YOUR SHORT EXISTENCE`);
            spawner.spawnCreep(body, dName, {memory: memory});
        }
    }
    run(spawner) {
        this.checkForSpawn(spawner);
        if(spawner.spawning) {
            this.displaySpawningText(spawner);
        }
    }
}

module.exports = new Spawner();
