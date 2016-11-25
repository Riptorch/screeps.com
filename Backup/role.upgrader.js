
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        

        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.currentUpgradeTargetId = undefined;
            creep.say('harvesting');
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	        creep.memory.currentUpgradeTargetId = undefined;
	        creep.say('working');
	    }
	    
	    if(!creep.memory.working && creep.carry.energy < creep.carryCapacity) {
            if (creep.memory.currentUpgradeTargetId == undefined)
            {
                var target = creep.pos.findClosestByPath(FIND_SOURCES); 
                if (target != undefined)
                {
                    creep.memory.currentUpgradeTargetId = target.id;
                }

            }
            if(creep.memory.currentUpgradeTargetId != undefined) {
                if(creep.harvest(Game.getObjectById(creep.memory.currentUpgradeTargetId)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.currentUpgradeTargetId));
                }
            }
        }
        else {
            if (creep.memory.currentUpgradeTargetId == undefined)
            {
                var target = creep.room.controller; 
                if (target != undefined)
                {
                    creep.memory.currentUpgradeTargetId = target.id;
                }

            }
            if(creep.memory.working && creep.memory.currentUpgradeTargetId != undefined) {
                var buildResult = creep.upgradeController(Game.getObjectById(creep.memory.currentUpgradeTargetId));
                if(buildResult == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.currentUpgradeTargetId));
                }
                else if (buildResult != OK) {
                    creep.memory.currentUpgradeTargetId = undefined;
                }
            }
        }
	}
};

module.exports = roleUpgrader;