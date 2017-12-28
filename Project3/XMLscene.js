var DEGREE_TO_RAD = Math.PI / 180;
var BOARD_WIDTH = 8;
var BOARD_Y_OFFSET = 0;
var CELL_WIDTH = 1;
let scene;
/**
 * XMLscene class, representing the scene that is to be rendered.
 * @constructor
 */
function XMLscene(interfac) {
    CGFscene.call(this);

    this.interfac = interfac;

    this.lightValues = {};

    this.lastTime = 0;

    this.currentSelectable = "None";
    this.currentShader = "Red Pulse";

    this.shaders = new Array();
    this.shadersRefs = new Array();

    let currentDate = new Date();
    this.initialTime = currentDate.getTime();

    this.gameGraphs = new Array();

    this.gameEnvironnments = new Array();

    //Lear variables
    this.boardPieces = new Array();
    this.gameEnded = false;
    this.freeTiles = 64;

    this.gameModes = ["PVP", "PVB", "BVB"];

    this.currentGameMode = "";

    this.botDifficulties = ["Random", "Normal"];

    this.currentDifficulty = "Random";

    this.rotation = true;

    this.cameraAngles = ["Default", "Angle1", "Angle2"];

    this.currentCameraAngle = "Default";
    
    this.currentBoard =  new Array(BOARD_WIDTH);
    for (let i = 0; i <  this.currentBoard.length; i++) {
        this.currentBoard[i] = new Array(BOARD_WIDTH).fill(0);
    }
    scene = this;

    this.lastBoards  = new Array();
    
}

this.undo = function() { console.log("UNDO"); };

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
 * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
 */
XMLscene.prototype.init = function(application) {
    CGFscene.prototype.init.call(this, application);

    this.shaders["Red Pulse"] = new CGFshader(this.gl, "shaders/shader.vert", "shaders/shader.frag");
    this.shadersRefs.push("Red Pulse");
    this.shaders["Red Pulse"].setUniformsValues({selectedRed: 1.0, selectedGreen: 0.0, selectedBlue: 0.0});

    this.shaders["Orange Pulse"] = new CGFshader(this.gl, "shaders/shaderOrange.vert", "shaders/shaderOrange.frag");
    this.shadersRefs.push("Orange Pulse");
    this.shaders["Orange Pulse"].setUniformsValues({selectedRed: 1.0, selectedGreen: 0.5, selectedBlue: 0.0});
    this.updateScalingFactor();

    this.initCameras();

    this.enableTextures(true);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.axis = new CGFaxis(this);

    this.currTex = null;
    this.currMat = null;

    this.primitives = [];
    this.animations = [];
    this.setUpdatePeriod(16);

    this.setPickEnabled(true);
}

/**
 * Initializes the scene lights with the values read from the LSX file.
 */
XMLscene.prototype.initLights = function() {
    var i = 0;
    // Lights index.
    // Reads the lights from the scene graph.
      for (var key in this.gameGraphs['lear.xml'].lights) {
          if (i >= 8)
              break;              // Only eight lights allowed by WebGL.

          if (this.gameGraphs['lear.xml'].lights.hasOwnProperty(key)) {
              let light = this.gameGraphs['lear.xml'].lights[key];
              this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
              this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
              this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
              this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);
              this.lights[i].setVisible(true);
              if (light[0])
                  this.lights[i].enable();
              else
                  this.lights[i].disable();

              this.lights[i].update();

              i++;
          }
      }

}

/**
 * Initializes the scene cameras.
 */
XMLscene.prototype.initCameras = function() {
    this.camera = new CGFcamera(0.4,0.1,500,vec3.fromValues(15, 15, 15),vec3.fromValues(0, 0, 0));
}


XMLscene.prototype.logPicking = function (){
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (let i=0; i< this.pickResults.length; i++) {
				let obj = this.pickResults[i][0];
				if (obj){
					let customId = this.pickResults[i][1];
					let control_points = new Array();
					control_points.push(new Array(0,0,0));
					control_points.push(new Array(0,5,0));
					let animation = new LinearAnimation(this, customId, 1, control_points);
					this.animations[customId]= animation;
					this.animations.length++;
					//change so it gets the node for a piece. That means we must create a node for each piece and save it.
					let node = this.gameGraphs['lear.xml'].nodes["whitePiece"];
					// /node.animationRefs.push(customId);

					let column = customId % BOARD_WIDTH;
					if (column == 0)
						column = BOARD_WIDTH;

					let line = Math.floor(customId / BOARD_WIDTH) + 1;
					if ( (customId / BOARD_WIDTH) % 1 == 0)
						line -=1;

					console.log("l: " + line);
					console.log("c: " + column);

					// console.log("Picked object: " + obj + ", with pick id " + customId);
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}
	}
}


/* Handler called when the graph is finally loaded.
 * As loading is asynchronous, this may be called already after the application has started the run loop
 */
XMLscene.prototype.onGraphLoaded = function()
{
    this.camera.near = this.gameGraphs["lear.xml"].near;
    this.camera.far = this.gameGraphs["lear.xml"].far;
    this.axis = new CGFaxis(this,this.gameGraphs["lear.xml"].referenceLength);

    this.setGlobalAmbientLight(this.gameGraphs["lear.xml"].ambientIllumination[0], this.gameGraphs["lear.xml"].ambientIllumination[1],
    this.gameGraphs["lear.xml"].ambientIllumination[2], this.gameGraphs["lear.xml"].ambientIllumination[3]);

    this.gl.clearColor(this.gameGraphs["lear.xml"].background[0], this.gameGraphs["lear.xml"].background[1], this.gameGraphs["lear.xml"].background[2], this.gameGraphs["lear.xml"].background[3]);

    this.initLights();

    this.interfac.addLightsGroup(this.gameGraphs["lear.xml"].lights);

    this.interfac.addNodesDropdown(this.gameGraphs["lear.xml"].selectableNodes);

    this.interfac.addShadersDropdown(this.shadersRefs);

    //GAME OPTIONS
    this.interfac.addGameOptions(this.gameModes, this.botDifficulties);

    //EXTRA OPTIONS
    this.interfac.addExtraOptions(this.gameEnvironnments, this.cameraAngles);

    this.learTemplateObjects();

}
/**
 * Creates board tiles and pieaces generic objects
 */
XMLscene.prototype.learTemplateObjects = function(){
	//BoadCells
	this.whiteCell = this.gameGraphs['lear.xml'].nodes["whiteCell"];
	let texWhite =  this.gameGraphs['lear.xml'].textures[this.whiteCell.textureID];
	this.whiteCell.leaves[0].updateTexCoords(texWhite[1], texWhite[2]);
	let matWhite =  this.gameGraphs['lear.xml'].materials[this.whiteCell.materialID];

	if (matWhite != null)
		this.whiteCell['materialObj'] =  matWhite;
	else
		this.whiteCell['materialObj'] =  this.gameGraphs['lear.xml'].materials['defaultMaterial'];

	this.whiteCell['textureObj'] = texWhite[0];

	this.blackCell =  this.gameGraphs['lear.xml'].nodes["blackCell"];
	let texBlack = this.gameGraphs['lear.xml'].textures[this.blackCell.textureID];
	this.blackCell.leaves[0].updateTexCoords(texBlack[1], texBlack[2]);
	let matBlack = this.gameGraphs['lear.xml'].materials[this.blackCell.materialID];

	if (matBlack != null)
		this.blackCell['materialObj'] = matBlack;
	else
		this.blackCell['materialObj'] = this.gameGraphs['lear.xml'].materials['defaultMaterial'];

	this.blackCell['textureObj'] = texBlack[0];

    //Pieces
	this.whitePiece = this.gameGraphs['lear.xml'].nodes["whitePiece"];
	this.blackPiece = this.gameGraphs['lear.xml'].nodes["blackPiece"];

	texWhite = this.gameGraphs['lear.xml'].textures[this.whitePiece.textureID];
	matWhite =  this.gameGraphs['lear.xml'].materials[this.whitePiece.materialID];

	if (matWhite != null)
		this.whitePiece['materialObj'] =  matWhite;
	else
		this.whitePiece['materialObj'] =  this.gameGraphs['lear.xml'].materials['defaultMaterial'];

	texBlack = this.gameGraphs['lear.xml'].textures[this.blackPiece.textureID];
	matBlack =  this.gameGraphs['lear.xml'].materials[this.blackPiece.materialID];

	if (matBlack != null)
		this.blackPiece['materialObj'] =  matBlack;
	else
    this.blackPiece['materialObj'] =  this.gameGraphs['lear.xml'].materials['defaultMaterial'];

    makeRequest("startGameRequest(pvp)");
}

/**
 * Displays the scene.
 */
XMLscene.prototype.display = function() {
    this.logPicking();
  	this.clearPickRegistration();

    // ---- BEGIN Background, camera and axis setup

    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    this.pushMatrix();

    if (this.gameGraphs[this.currentEnvironment].loadedOk){
        // Applies initial transformations.
    this.multMatrix(this.gameGraphs[this.currentEnvironment].initialTransforms);

		// Draw axis
		this.axis.display();

        var i = 0;
        for (var key in this.lightValues) {
            if (this.lightValues.hasOwnProperty(key)) {
                if (this.lightValues[key]) {
                    this.lights[i].setVisible(true);
                    this.lights[i].enable();
                }
                else {
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }
                this.lights[i].update();
                i++;
            }
        }

       let newDate = new Date();
       currTime = newDate.getTime();
       if(this.initialTime == null) {
           this.initialTime = currTime;
       }
       dT = (currTime - this.initialTime)/1000;
       this.updateScalingFactor(dT);
        // Displays the scene.
        this.gameGraphs['lear.xml'].displayScene();
        this.gameGraphs[this.currentEnvironment].displayScene();

        //Board Display
        this.displayBoardTiles();
        this.displayBoard();

        //this.displayWhitePieces();
    
      }
	else
	{
		// Draw axis
		this.axis.display();
	}


    this.popMatrix();

    // ---- END Background, camera and axis setup

}

XMLscene.prototype.displayBoardTiles = function(){
  let whiteLineStart = new Array();
  let blackLineStart = new Array();

  for(let i = 0; i < BOARD_WIDTH; i++){
    if(i % 2 == 0)
      whiteLineStart.push(this.whiteCell);
    else
      whiteLineStart.push(this.blackCell);

  }

  for(let i = 0; i < BOARD_WIDTH; i++){
    if(i % 2 == 0)
      blackLineStart.push(this.blackCell);
    else
      blackLineStart.push(this.whiteCell);
  }

  let line;
  let cellId = 0;

  let texWhite = this.gameGraphs[this.currentEnvironment].textures["white"];
  let texBlack = this.gameGraphs[this.currentEnvironment].textures["black"];

  for(let j = 0; j < BOARD_WIDTH; j++){
    if(j % 2 == 0)
      line = whiteLineStart;
    else
      line = blackLineStart;

    this.pushMatrix();

    for (let i = 0; i < line.length; i++) {
      cellId++;

      if (line[i].nodeID == "whiteCell"){
        line[i].leaves[0].updateTexCoords(texWhite[1], texWhite[2]);
        line[i]['textureObj'] = texWhite[0];
        }
      else if (line[i].nodeID == "blackCell"){
        line[i].leaves[0].updateTexCoords(texBlack[1], texBlack[2]);
        line[i]['textureObj'] = texBlack[0];
      }

      line[i]['materialObj'].apply();

      if (line[i]['textureObj'] != null){
        line[i]['textureObj'].bind();
      }

      this.registerForPick(cellId, line[i].leaves[0]);

      line[i].leaves[0].display();

      this.translate((CELL_WIDTH/2), 0, 0);
    }
    this.popMatrix();
    this.translate(0, 0, (CELL_WIDTH/2));
  }
};

XMLscene.prototype.displayBoard = function(){
    scene.pushMatrix();
    for (let i = 0; i < BOARD_WIDTH; i++) {
        scene.pushMatrix(); 
        for (let j = 0; j < BOARD_WIDTH; j++) {
            if (scene.currentBoard[i][j] == 'X ')
                scene.displayPiece(scene.blackPiece, scene.blackPiece["textureObj"], scene.blackPiece["materialObj"]);
            else if(scene.currentBoard[i][j] == 'O ')
                scene.displayPiece(scene.whitePiece, scene.whitePiece["textureObj"], scene.whitePiece["materialObj"]);

            //scene.translate((CELL_WIDTH/2), 0, 0);
        }
        scene.popMatrix();
        //scene.translate(0, 0, (CELL_WIDTH/2));
    }
    scene.popMatrix();
};


XMLscene.prototype.displayWhitePieces = function(){

  for (let j = 0; j < 4; j++){

    this.pushMatrix();

    for (let i = 0; i < 8; i++){
      this.displayPiece(this.whitePiece, this.whitePiece['textureObj'], this.whitePiece['materialObj']);
      this.translate( 0, 0, -0.6);
    }
    this.popMatrix();
    this.translate(0.6, 0, 0);
    }

}

XMLscene.prototype.displayPiece = function(node, parTex, parAsp) {

  	var textura = parTex;
  	var material = parAsp;

    this.pushMatrix();
    this.multMatrix(node.transformMatrix);

    if (node.textureID !='null') {
      if (node.textureID == 'clear')
        textura = null;
      else{
        this.currTexture = this.gameGraphs['lear.xml'][node.textureID];
        textura =  this.gameGraphs['lear.xml'].textures[node.textureID][0];
      }
    }

    if (node.materialID != "null") {
      material = this.gameGraphs['lear.xml'].materials[node.materialID];
    }

    for (var i = 0; i < node.children.length; i++) {
      this.displayPiece(this.gameGraphs['lear.xml'].nodes[node.children[i]], textura, material);
    }

    material.apply();

    if (textura != null) {
        textura.bind();
    }

    for (let j = 0; j < node.leaves.length; j++)
      node.leaves[j].display();

    this.popMatrix();
};


function getPrologRequest(requestString, onSuccess, onError, port){
    let requestPort = port || 8081;
    let request = new XMLHttpRequest();
    request.scene = this;
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

    request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
    request.onerror = onError || function(){console.log("Error waiting for response");};

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}

function makeRequest(requestString){
    // Make Request
    getPrologRequest(requestString, handleReply);
}

/**
 * Handles the server's response, updating currentBoard,
 * freeTiles and gameEnded attriutes
 * @param data JSON server response
 */
function handleReply(data){
    console.log("Reply!!\n" + data);
    let regex = new RegExp("^(.*)(?:-(.*)-(.*))?$");
    let matched = regex.exec(data.target.responseText);
    if(matched[2] != undefined && matched[3] != undefined){
        this.lastBoards.push(this.currentBoard);
        this.freeTiles = matched[2];
        this.gameEnded = matched[3];
    }
    
    scene.currentBoard = parseBoard(matched[1]);
    console.log(scene.currentBoard);
}

function parseBoard(string){
	let board = new Array();
	let regex = /\[(?:\[)?([^,]*),([^,]*),([^,]*),([^,]*),([^,]*),([^,]*),([^,]*),([^\]]*)\](?:\])?(?:,|\])/y;

	for(let i = 0; i < BOARD_WIDTH; i++){
		board[i] = new Array();
		let matched = regex.exec(string);
		for (let j = 1; j < matched.length; j++) {
			board[i].push(matched[j]);
		}
	}
	return board;
}

XMLscene.prototype.update = function(currTime){
 	for(var node in this.gameGraphs['lear.xml'].nodes) {
		this.gameGraphs['lear.xml'].nodes[node].updateAnimationMatrix(currTime - this.lastTime);
	}
  for(var node in this.gameGraphs[this.currentEnvironment].nodes) {
     this.gameGraphs[this.currentEnvironment].nodes[node].updateAnimationMatrix(currTime - this.lastTime);
	}
	this.lastTime = currTime;
}


XMLscene.prototype.updateScalingFactor = function(date){
    this.shaders[this.currentShader].setUniformsValues({timeFactor: date});
};
