/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.migrater');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
/** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.arrived == undefined){
            for (var flagName in Game.flags) {
                var flag = Game.flags[flagName];
                if (flag.color == COLOR_BLUE && flag.secondaryColor == COLOR_YELLOW){
                    if (flag.pos.roomName == creep.pos.roomName && flag.pos.x == creep.pos.x && flag.pos.y == creep.pos.y){
                        creep.memory.arrived = true;
                        creep.say('arrived!');
                        creep.memory.role = creep.memory.arrivalRole;
                    }                   
                    else{
                        creep.moveTo(flag.pos);
                        return;
                    }
                    

                }
            }     
        }
    }
};