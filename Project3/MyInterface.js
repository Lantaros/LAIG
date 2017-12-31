 /**
 * MyInterface class, creating a GUI interface.
 * @constructor
 */
function MyInterface() {
    //call CGFinterface constructor
    CGFinterface.call(this);
    makeRequest("startGameRequest('PVP')");//TODO DELETE
    this.ongoingGame = false;
    this.freeCam = false;
};

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
 * Adds dropdown box for  selecting  one of the special shaders
 * @param  shaders array containing all special shader's ID's
 */
MyInterface.prototype.addShadersDropdown = function(shaders) {
  this.shadersGroup = this.gui.addFolder("Shader Options");
  this.shadersGroup.open();
  this.shadersGroup.add(this.scene, "currentShader", shaders).name("Special Shader");
};

MyInterface.prototype.addGameOptions = function(gameModes, botDifficulties) {
  this.gameOptions = this.gui.addFolder("Game Options");
  this.gameOptions.open();
  this.gameOptions.add(this.scene, "currentGameMode", gameModes).name("Mode");
  this.gameOptions.add(this.scene, "currentDifficulty", botDifficulties).name("AI");
  let start = { startGame:function(){
    console.log("START GAME");
    if(this.ongoingGame)
      confirm("There's an ongoing game, do you really wish to restart?");

    this.ongoingGame = true;
    scene.lear.gameType = scene.currentGameMode;
    makeRequest("startGameRequest('" + scene.currentGameMode + "')");
  }};
  let startBound = {startGame:start.startGame.bind(this.scene)};
  this.gameOptions.add(startBound,'startGame');
};

MyInterface.prototype.addExtraOptions = function(gameGraphs, cameraAngles) {
  this.extraOptions = this.gui.addFolder("Other Options");
  this.extraOptions.open();

  this.extraOptions.add(this.scene, 'rotation').name('Board Rotation');

  let funcObj = {
    undo:function(){
      console.log("UNDO");
      if(scene.lear.lastBoards.length)
          scene.lear.currentBoard = scene.lear.lastBoards.pop();
      else
        alert("Can't undo a game with no previous moves...");
    },
    toggleFreeCam:function(){
      let inter = scene.interface;
      if(inter.freeCam){
        console.log("Locked Camera");
        inter.freeCam = false;
        inter.setActiveCamera(null);
      }
      else{
        console.log("Unlocked Camera");
        inter.freeCam = true;
        inter.setActiveCamera(scene.camera);
      }
    }};
  this.extraOptions.add(funcObj,'undo').name("Undo");
  this.extraOptions.add(funcObj,'toggleFreeCam').name("Lock/Unlock Cam");


  this.extraOptions.add(this.scene, "currentEnvironment", gameGraphs).name("Environment");
  this.extraOptions.add(this.scene, 'changeCamera').name('Change angle');
};
