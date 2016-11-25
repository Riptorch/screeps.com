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
        function(energy, roleName, partDesign, arrivalRoleName) {
            var body = [];
            if (partDesign == undefined || partDesign == 'worker'){
                var numberOfParts = Math.floor(energy / 200);
                var remainder = energy - (numberOfParts * 200);
                
                for (let i = 0; i < numberOfParts; i++){
                    body.push(WORK);
                }
                for (let i = 0; i < numberOfParts; i++){
                    body.push(CARRY);
                }
                if (remainder >= 150) {
                    body.push(CARRY);
                    body.push(CARRY);
                    body.push(MOVE);
                }
                else if (remainder >= 100)  {
                    body.push(CARRY);
                    body.push(MOVE);
                }
                else if (remainder >= 50) {
                    body.push(CARRY);
                }
                for (let i = 0; i < numberOfParts; i++){
                    body.push(MOVE);
                }
            }
            else if (partDesign == 'claimer'){
                var numberOfParts = Math.floor(energy / 650);
                for (let i = 0; i < numberOfParts; i++){
                    body.push(CLAIM);
                }                
                for (let i = 0; i < numberOfParts; i++){
                    body.push(MOVE);
                }
            }
            
            return this.createCreep(body, undefined, {role: roleName, working : false, arrivalRole : arrivalRoleName});
        }

};