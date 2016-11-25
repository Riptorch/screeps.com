require('prototype.createCustomCreep')();

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleSeeker = require('role.seeker');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleClaimer = require('role.claimer');
var roleMigrater = require('role.migrater');

module.exports.loop = function () {
    
    
    var migrateFlag = 0;
    for (var flagName in Game.flags) {
        var flag = Game.flags[flagName];
        
        if (flag.color == COLOR_RED && flag.secondaryColor < flag.room.controller.level){
            if (!(flag.room.createConstructionSite(flag.pos, STRUCTURE_EXTENSION) < 0)){
                flag.remove();
            }
        }
        if (flag.color == COLOR_PURPLE && flag.secondaryColor < flag.room.controller.level){
            if (!(flag.room.createConstructionSite(flag.pos, STRUCTURE_TOWER) < 0)){
                flag.remove();
            }
        }
        if (flag.color == COLOR_BLUE && flag.secondaryColor == COLOR_YELLOW){
            migrateFlag++;
        }
    }

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            console.log('Clearing non-existing creep memory:', name, 
                ' role:',  Memory.creeps[name].role, 
                ' ticksHarvesting:',  Memory.creeps[name].ticksHarvesting,
                ' ticksMoving:', Memory.creeps[name].ticksMoving,
                ' ticksWorking', Memory.creeps[name].ticksWorking);
            delete Memory.creeps[name];
            
        }
    }
    var energy = Game.spawns.Spawn1.room.energyCapacityAvailable;
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    var claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer' || (creep.memory.role == 'migrater' && creep.memory.arrivalRole == 'claimer'));
    
    var minimumHarvesters = 4;
    var minimumUpgraders = 1;
    var minimumBuilders = 2;
    var minimumRepairers = 2;
    var maximumRepairers = 2;
    var minimumClaimers = 0;
    
    if (energy < 400){
        minimumHarvesters = 6;
    }
    if (energy >= 1200){
        minimumHarvesters = 2;
        minimumRepairers = 1;
        minimumBuilders = 1;
    }
    if (energy < 650){
        minimumClaimers = 0;
    }
    else if (energy >= 1300 && migrateFlag != 0){
        minimumClaimers = 1;
    }
    else if (energy < 1300 && migrateFlag != 0){
        minimumClaimers = 2;
    }
    
    //var remainingControl = Game.spawns.Spawn1.room.controller.progressTotal - Game.spawns.Spawn1.room.controller.progress;
    //console.log('Remaining Control:', remainingControl);
    
    if(harvesters.length < minimumHarvesters) {
        var newName = Game.spawns.Spawn1.createCustomCreep(energy, 'harvester');
        if (!(newName < 0)){
            console.log('Spawning new harvester: ' + newName);    
            console.log('harvesters:' + (harvesters.length+1));
        }
        
    }
    else if (upgraders.length < minimumUpgraders){
        var newName = Game.spawns['Spawn1'].createCustomCreep(energy, 'upgrader');
        if (!(newName < 0)){
            console.log('Spawning new upgrader:' + newName);
            console.log('upgraders:' + (upgraders.length+1));
        }
    }
    else if (repairers.length < minimumRepairers) {
        var newName = Game.spawns['Spawn1'].createCustomCreep(energy, 'repairer');
        if (!(newName < 0)){
            console.log('Spawning new repairer: ' + newName);    
            console.log('repairers:' + (repairers.length+1));
        } 
    }
    else if (builders.length < minimumBuilders) {
        var newName = Game.spawns['Spawn1'].createCustomCreep(energy, 'builder');
        if (!(newName < 0)){
            console.log('Spawning new builder: ' + newName);    
            console.log('builders:' + (builders.length+1));
        }
    }
    else if (claimers.length < minimumClaimers){
        var newName = Game.spawns['Spawn1'].createCustomCreep(energy, 'migrater', 'claimer', 'claimer');
        if (!(newName < 0)){
            console.log('Spawning new claimer: ' + newName);    
            console.log('claimers:' + (claimers.length+1));
        }
    }
    else
    {
        var newName = Game.spawns['Spawn1'].createCustomCreep(energy, 'builder');
        if (!(newName < 0)){
            console.log('Spawning new builder: ' + newName);    
            console.log('builders:' + (builders.length+1));
        }
        
    }
    
    if (harvesters.length == 0)
    {
        var newName = Game.spawns.Spawn1.createCustomCreep(Game.spawns.Spawn1.room.energyAvailable, 'harvester');
        if (!(newName < 0)){
            console.log('Spawning emergency harvester: ' + newName);    
            console.log('harvesters:' + (harvesters.length+1));
        }
    }
    var towers = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_TOWER
    });
    for (let tower of towers) {
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target != undefined) {
            tower.attack(target);
        }
    }
    
    var repairerCount = 0;
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.ticksWorking == undefined){
            creep.memory.ticksWorking = 0;
        }
        if (creep.memory.ticksHarvesting == undefined){
            creep.memory.ticksHarvesting = 0;
        }
        if (creep.memory.ticksMoving == undefined){
            creep.memory.ticksMoving = 0;
        }
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
            repairerCount++;
            if (repairerCount > maximumRepairers){
                creep.memory.role = 'builder';
            }
            
            roleRepairer.run(creep);
        }
        if (creep.memory.role == 'claimer'){
            roleClaimer.run(creep);
        }
        if (creep.memory.role == 'migrater'){
            roleMigrater.run(creep);
        }
        //creep.say(creep.memory.role);
    }
}