var actions = require('actions');
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.role == 'upgrader'){
            actions.autoroad(creep);
        }
        
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.currentUpgradeTargetId = undefined;
            creep.say('harvesting');
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	        creep.memory.currentSupplyTargetId = undefined;
	        creep.say('working');
	    }
	    
	    if(!creep.memory.working && creep.carry.energy < creep.carryCapacity) {
            actions.harvest(creep);
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
                    creep.memory.ticksMoving++;
                }
                else if (buildResult != OK) {
                    creep.memory.currentUpgradeTargetId = undefined;
                }
                else{
                    creep.memory.ticksWorking++;
                }
            }
        }
	}
};

module.exports = roleUpgrader;