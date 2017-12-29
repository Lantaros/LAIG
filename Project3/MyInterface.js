 /**
 * MyInterface class, creating a GUI interface.
 * @constructor
 */
function MyInterface() {
    //call CGFinterface constructor
    CGFinterface.call(this);
}
;

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * Initializes the interface.
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
    // call CGFinterface init
    CGFinterface.prototype.init.call(this, application);

    // init GUI. For more information on the methods, check:
    //  http://workshop.chromeexperiments.com/examples/gui

    this.gui = new dat.GUI();

    // add a group of controls (and open/expand by defult)
    return true;
};

/**
 * Adds a folder containing the IDs of the lights passed as parameter.
 */
MyInterface.prototype.addLightsGroup = function (lights) {

  var group = this.gui.addFolder("Lights");
  group.open();

  // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
  // e.g. this.option1=true; this.option2=false;

  for (var key in lights) {
    if (lights.hasOwnProperty(key)) {
        this.scene.lightValues[key] = lights[key][0];
        group.add(this.scene.lightValues, key);
    }
  }
};

/**
 * Adds dropdown box for  selecting the node witch the shader will be applied
 * @param  nodes array containing all selectable nodes ID's
 */
MyInterface.prototype.addNodesDropdown = function(nodes) {
  this.shadersGroup = this.gui.addFolder("Shader Options");
  this.shadersGroup.open();
  this.shadersGroup.add(this.scene, "currentSelectable", nodes).name("Selectable Node");
};

/**
 * Adds dropdown box for  selecting  one of the special shaders
 * @param  shaders array containing all special shader's ID's
 */
MyInterface.prototype.addShadersDropdown = function(shaders) {
  this.shadersGroup.add(this.scene, "currentShader", shaders).name("Special Shader");
};

MyInterface.prototype.addGameOptions = function(gameModes, botDifficulties) {
  this.gameOptions = this.gui.addFolder("Game Options");
  this.gameOptions.open();
  this.gameOptions.add(this.scene, "currentGameMode", gameModes).name("Mode");
  this.gameOptions.add(this.scene, "currentDifficulty", botDifficulties).name("AI");
  let start = { startGame:function(){
    console.log("START GAME");
    makeRequest("moveRequest(" + boardToString(this.currentBoard) + ",1,1,'X',51)");
 }};
  let startBound = {startGame:start.startGame.bind(this.scene)};
  this.gameOptions.add(startBound,'startGame');
};

MyInterface.prototype.addExtraOptions = function(gameGraphs, cameraAngles) {
  this.extraOptions = this.gui.addFolder("Other Options");
  this.extraOptions.add(this.scene, 'rotation').name('Board Rotation');
  let obj = { undo:function(){ console.log("UNDO STUFF") }};
  this.extraOptions.add(obj,'undo').name("Undo");
  this.extraOptions.add(this.scene, "currentEnvironment", gameGraphs).name("Environment");
  this.extraOptions.add(this.scene, 'changeCamera').name('Rotate 90º');
};
