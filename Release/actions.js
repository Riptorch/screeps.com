/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('actions');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    harvest: function(creep) {
        if (creep.memory.currentSupplyTargetId == undefined){
            var target = creep.pos.findClosestByPath(FIND_SOURCES); 
            if (target != undefined){
                creep.memory.currentSupplyTargetId = target.id;
            }
            else{ // All routes blocked.. look for some lying around.
                console.log('looking for dropped energy');
                target = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
                if (target != undefined){
                    console.log('found dropped energy');
                    creep.memory.currentSupplyTargetId = target.id;
                }
            }

        }
        if(creep.memory.currentSupplyTargetId != undefined) {
            var harvestResult = creep.harvest(Game.getObjectById(creep.memory.currentSupplyTargetId))
            if(harvestResult == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.currentSupplyTargetId));
                creep.memory.ticksMoving++;
                creep.memory.supplyTicks = 0;
            }
            else if (harvestResult == ERR_NOT_ENOUGH_ENERGY) {
                creep.moveTo(Game.getObjectById(creep.memory.currentSupplyTargetId)); // Still move toward it by default
                creep.memory.currentSupplyTargetId = undefined; // But have it check for a new source, in case there is no path to the empty one anyway
                creep.memory.ticksMoving++;
            }
            else if (harvestResult == OK) {
                creep.memory.ticksHarvesting++;
            }
            else {
                creep.memory.currentSupplyTargetId = undefined; //likely trying to get to a non existent source.
            }
        }
    },
    autoroad:function(creep){
        var currentConstructions = creep.room.find(FIND_CONSTRUCTION_SITES).length;
        if (creep.room.energyCapacityAvailable >= 550 && currentConstructions < 10){
            creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
        }
    }
};