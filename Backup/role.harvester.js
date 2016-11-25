
var roleUpgrader = require('role.upgrader');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        /*if (creep.body.filter((c) => c.type == WORK).length >= 5){*/
        /*    creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);*/
        /*}*/

        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	        creep.say('working');
	    }
	    
	    if(!creep.memory.working && creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });        
            if(creep.memory.working && target != undefined) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else
            {
                roleUpgrader.run(creep);
            }
        }
	}
};

module.exports = roleHarvester;