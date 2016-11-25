var roleSeeker = {
    run : function(creep) {
        var target = Game.getObjectById(creep.memory.targetId);
        var result = creep.rangedAttack(target);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        if (result == ERR_INVALID_TARGET) {
            var enemies = creep.room.find(FIND_HOSTILE_CREEPS);
            
            if (enemies.length > 0) {
                creep.memory.targetId = enemies[0].id;
                creep.moveTo(enemies[0]);
            }
        }
    }
}

module.exports = roleSeeker;