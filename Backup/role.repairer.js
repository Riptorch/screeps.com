
var roleBuilder = require('role.builder');

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        

        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.currentRepairTargetId = undefined;
            creep.say('harvesting');
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	        creep.memory.currentRepairTargetId = undefined;
	        creep.memory.currentHarvestTargetId = undefined;
	        creep.say('working');
	    }
	    if (creep.memory.working && creep.memory.currentRepairTargetId != undefined  && Game.getObjectById(creep.memory.currentRepairTargetId).hits == Game.getObjectById(creep.memory.currentRepairTargetId).hitsMax) {
	        creep.say('repaired');
	        creep.memory.currentRepairTargetId = undefined;
	    }
	    if(!creep.memory.working && creep.carry.energy < creep.carryCapacity) {
            if (creep.memory.currentHarvestTargetId == undefined)
            {
                var target = creep.pos.findClosestByPath(FIND_SOURCES); 
                if (target != undefined)
                {
                    creep.memory.currentHarvestTargetId = target.id;
                }

            }
            if(creep.memory.currentHarvestTargetId != undefined) {
                if(creep.harvest(Game.getObjectById(creep.memory.currentHarvestTargetId)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.currentHarvestTargetId));
                }
            }
        }
        else {
            if (creep.memory.currentRepairTargetId == undefined){
            
                var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter : (s) => s.structureType != STRUCTURE_WALL && s.hits < s.hitsMax
                }); 
                if (target != undefined)
                {
                    creep.memory.currentRepairTargetId = target.id;
                }

            }
            if(creep.memory.working && creep.memory.currentRepairTargetId != undefined) {
                
                var buildResult = creep.repair(Game.getObjectById(creep.memory.currentRepairTargetId));
                if(buildResult == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.currentRepairTargetId));
                }
                 
            }
            else
            {
                creep.memory.currentRepairTargetId = undefined;
                roleBuilder.run(creep);
            }
        }
	}
};

module.exports = roleRepairer;