require('prototype.createCustomCreep')();

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleSeeker = require('role.seeker');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');

module.exports.loop = function () {
    
    for (var flagName in Game.flags) {
        var flag = Game.flags[flagName];
        if (flag.color == COLOR_RED && flag.secondaryColor == COLOR_RED){
            if (!(Game.spawns.Spawn1.room.createConstructionSite(flag.pos, STRUCTURE_EXTENSION) < 0)){
                flag.remove();
            }
            
        }
        
        
    }

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    var energy = Game.spawns.Spawn1.room.energyCapacityAvailable;
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    
    
    var minimumHarvesters = 4;
    var minimumUpgraders = 1;
    var minimumBuilders = 4;
    var minimumRepairers = 2;
    
    if (energy < 400){
        minimumHarvesters = 6;
        minimumBuilders = 10;
    }
    
    if(harvesters.length < minimumHarvesters) {
        var newName = Game.spawns.Spawn1.createCustomCreep(energy, 'harvester');
        if (!(newName < 0)){
            console.log('Spawning new harvester: ' + newName);    
            console.log('harvesters:' + harvesters.length);
        }
        
    }
    else if (upgraders.length < minimumUpgraders){
        var newName = Game.spawns['Spawn1'].createCustomCreep(energy, 'upgrader');
        if (!(newName < 0)){
            console.log('Spawning new upgrader:' + newName);
            console.log('upgraders:' + upgraders.length);
        }
    }
    else if (repairers.length < minimumRepairers) {
        var newName = Game.spawns['Spawn1'].createCustomCreep(energy, 'repairer');
        if (!(newName < 0)){
            console.log('Spawning new repairer: ' + newName);    
            console.log('repairers:' + repairers.length);
        } 
    }
    else if (builders.length < minimumBuilders) {
        var newName = Game.spawns['Spawn1'].createCustomCreep(energy, 'builder');
        if (!(newName < 0)){
            console.log('Spawning new builder: ' + newName);    
            console.log('builders:' + builders.length);
        }
    }
    else
    {
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
        
        var newName = Game.spawns['Spawn1'].createCustomCreep(energy, 'repairer');
        if (!(newName < 0)){
            console.log('Spawning new repairer:' + newName);
        }
        
    }
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'seeker') {
            roleSeeker.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
    }
}