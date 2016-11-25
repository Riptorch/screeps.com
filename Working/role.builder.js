var actions = require('actions');
var roleUpgrader = require('role.upgrader');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {


        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.currentBuildTargetId = undefined;
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
            if (creep.memory.currentBuildTargetId == undefined)
            {
                var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES); 
                if (target != undefined)
                {
                    creep.memory.currentBuildTargetId = target.id;
                }

            }
            if(creep.memory.working && creep.memory.currentBuildTargetId != undefined) {
                var buildResult = creep.build(Game.getObjectById(creep.memory.currentBuildTargetId));
                if(buildResult == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.currentBuildTargetId));
                    creep.memory.ticksMoving++;
                }
                else if (buildResult != OK) {
                    creep.memory.currentBuildTargetId = undefined;
                } 
                else {
                    creep.memory.ticksWorking++;
                }
            }
            else
            {
                creep.memory.currentBuildTargetId = undefined;
                roleUpgrader.run(creep);
            }
        }
	}
};

module.exports = roleBuilder;