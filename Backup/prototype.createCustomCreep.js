/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('prototype.createCustomCreep');
 * mod.thing == 'a thing'; // true
 */

module.exports = function(){
    StructureSpawn.prototype.createCustomCreep =
        function(energy, roleName) {
            var numberOfParts = Math.floor(energy / 200);
            var body = [];
            
            for (let i = 0; i < numberOfParts; i++){
                body.push(WORK);
            }
            for (let i = 0; i < numberOfParts; i++){
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++){
                body.push(MOVE);
            }
            
            return this.createCreep(body, undefined, {role: roleName, working : false});
        }

};