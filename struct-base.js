class Struct {
    roleCount(room) {
        let roleCount = Object.values(Game.creeps).reduce((obj, creep) => {
            if(creep.memory.origin == room.name || creep.memory.shardWide) {
                obj[creep.memory.role]++;
                if(creep.memory.working) { obj['Working']++; }
                else { obj['Slacking']++; }
                return obj;
            }
            return obj;
        }, {
            Harvester: 0,
            Upgrader: 0,
            Builder: 0,
            'Remote-Miner': 0,
            Working: 0,
            Slacking: 0
        });
        // Print role counts
        console.log(`Harvesters: ${roleCount.Harvester} |`,
            `Upgraders: ${roleCount.Upgrader} |`,
            `Builders: ${roleCount.Builder} |`,
            `Remote-Miners: ${roleCount['Remote-Miner']} |`,
            `(Working: ${roleCount.Working}, Harvesting: ${roleCount.Slacking})`,
            `in ${room.name}`
        );
        return roleCount;
    }
    displaySpawningText(spawn) {
        var percent = parseInt((spawn.spawning.needTime - spawn.spawning.remainingTime) / spawn.spawning.needTime * 100);
        spawn.room.visual.text(
            `CREATING ${spawn.spawning.name} (%${percent})`,
            spawn.pos.x + 1,
            spawn.pos.y,
            { size: '0.5', align: 'left', opacity: 0.8, font: 'bold italic 0.75 Comic Sans' }
        );
    }
}

module.exports = Struct;
