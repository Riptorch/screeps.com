var actions = require('actions');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        actions.autoroad(creep);
        if (creep.memory.supplyTicks == undefined){
            creep.memory.supplyTicks = 0;
        }
        creep.memory.supplyTicks++;
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.currentSupplyTargetId = undefined;
            //console.log(creep.name, ' supply cycle: ', creep.memory.supplyTicks, ' ticks');
            if (creep.ticksToLive < creep.memory.supplyTicks){
                // Not likely to survive to harvest and supply energy. Avoiding dropping energy by suiciding.
                creep.say("RETIRING!");
                console.log(creep.name, ' retiring.');    
                
                creep.suicide();
            }
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
            if (creep.memory.currentSupplyTargetId == undefined)
            {
                var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION 
                             || structure.structureType == STRUCTURE_SPAWN
                             || structure.structureType == STRUCTURE_TOWER) &&
                            structure.energy < structure.energyCapacity;
                    }
                 });        
                if (target != undefined)
                {
                    creep.memory.currentSupplyTargetId = target.id;
                }

            }
            if(creep.memory.working && creep.memory.currentSupplyTargetId != undefined) {
                var buildResult = creep.transfer(Game.getObjectById(creep.memory.currentSupplyTargetId), RESOURCE_ENERGY);
                if(buildResult == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.currentSupplyTargetId));
                    creep.memory.ticksMoving++;
                }
                else if (buildResult != OK) {
                    creep.memory.currentSupplyTargetId = undefined;
                }
                else{
                    creep.memory.ticksWorking++;
                }
            }
        }
	}
};

module.exports = roleUpgrader;