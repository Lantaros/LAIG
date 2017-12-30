var DEGREE_TO_RAD = Math.PI / 180;
var BOARD_WIDTH = 8;
var BOARD_Y_OFFSET = 0;
var CELL_WIDTH = 1;
let PIECE_WIDTH = 0.25;
let PIECE_Y_OFFSET = 0.2;
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

    this.currentGameMode = "PVP";

    this.rotation = true;

    this.botDifficulties = ["Random", "Normal"];

    this.currentDifficulty = "Random";

    this.currentCameraAngle = 0;

    this.currentBoard =  new Array(BOARD_WIDTH);
    for (let i = 0; i <  this.currentBoard.length; i++) {
        this.currentBoard[i] = new Array(BOARD_WIDTH).fill(0);
    }
    scene = this;

    this.lastBoards  = new Array();

    this.selectedPiece = 0;

    this.whitePiecesArray = new Array();
    this.blackPiecesArray = new Array();

}

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
				let customId = this.pickResults[i][1];
        console.log(customId);
				if (obj && customId > 0){

          let cellColumn = customId % BOARD_WIDTH;
          if (cellColumn == 0)
            cellColumn = BOARD_WIDTH;

          let cellLine = Math.floor(customId / BOARD_WIDTH) + 1;
          if ( (customId / BOARD_WIDTH) % 1 == 0)
            cellLine -=1;

          //  if it's a piece
          if (obj.type ==  "halfsphere"){
            if (this.selectedPiece != 0)
                this.selectedPiece.selected = false;
            obj.selected = true;
            this.selectedPiece = customId;
          }

          else if (obj.type == "boardcell" && this.selectedPiece != 0){
                let control_points = new Array();
                let y_offset = 0;

                let pID = this.selectedPiece - 65;
                let pieceColumn = pID % 8;

                let pieceLine = Math.floor(pID / 8) ;

                  console.log("L: " + pieceLine);
                  console.log("C: " + pieceColumn);

                let pi = [PIECE_WIDTH/2  + (PIECE_WIDTH + CELL_WIDTH)*pieceLine,
                           PIECE_Y_OFFSET,
                           PIECE_WIDTH/2 + (PIECE_WIDTH + CELL_WIDTH)*pieceColumn];

                let pf = [0 + PIECE_WIDTH/2  + -(PIECE_WIDTH + CELL_WIDTH)*cellColumn,
                           PIECE_Y_OFFSET,
                           PIECE_WIDTH/2 + (PIECE_WIDTH + CELL_WIDTH)*cellLine];

                control_points.push(pi);
                control_points.push( new Array(1,1,1));
                control_points.push( new Array(2,2,2));
                control_points.push(pf);
                let animation = new BezierAnimation(this, this.selectedPiece, 1, control_points);
                this.animations[this.selectedPiece] = animation;
                this.animations.length++;
      					this.whitePiecesArray[this.selectedPiece].animationRefs.push(this.selectedPiece);
                //this.blackPiecesArray[this.selectedPiece].animationRefs.push(this.selectedPiece);
            }
          }
          // if (obj.type ==  "topPiece" || obj.type ==  "botPiece")
          //   this.setActiveShader(this.shaders["Red Pulse"]);
          //
          // this.setActiveShader(asdasdthis.defaultShader);
          //console.log(customId);
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}
	};

/*
  Handler called when the "lear.xml" graph is finally loaded.
 */
XMLscene.prototype.onGraphLoaded = function(){
    this.camera.near = this.gameGraphs["lear.xml"].near;
    this.camera.far = this.gameGraphs["lear.xml"].far;
    this.axis = new CGFaxis(this,this.gameGraphs["lear.xml"].referenceLength);

    this.setGlobalAmbientLight(this.gameGraphs["lear.xml"].ambientIllumination[0], this.gameGraphs["lear.xml"].ambientIllumination[1],
    this.gameGraphs["lear.xml"].ambientIllumination[2], this.gameGraphs["lear.xml"].ambientIllumination[3]);

    this.gl.clearColor(this.gameGraphs["lear.xml"].background[0], this.gameGraphs["lear.xml"].background[1], this.gameGraphs["lear.xml"].background[2], this.gameGraphs["lear.xml"].background[3]);

    this.initLights();
    //interface setup
    this.interfac.addLightsGroup(this.gameGraphs["lear.xml"].lights);
    this.interfac.addShadersDropdown(this.shadersRefs);
    this.interfac.addGameOptions(this.gameModes, this.botDifficulties);
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


    for(let i = 65; i < 97; i++)
      this.whitePiecesArray[i] = new MyGraphNode(this.whitePiece);
    for(let i = 97; i < 129; i++)
      this.blackPiecesArray[i] = new MyGraphNode(this.blackPiece);


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

    if (this.gameGraphs['lear.xml'].loadedOk && this.gameGraphs[this.currentEnvironment].loadedOk){
        // Applies initial transformations.
       this.multMatrix(this.gameGraphs[this.currentEnvironment].initialTransforms);
    		// Draw axis
    	 this.axis.display();

       this.setLights();

       let newDate = new Date();
       currTime = newDate.getTime();
       if(this.initialTime == null)
           this.initialTime = currTime;

       dT = (currTime - this.initialTime)/1000;

       this.deltaTime = this.deltaTime || 0;
       this.deltaTime = currTime - this.lastTime;
       this.updateScalingFactor(dT);

       this.displayEverything();

       this.updateCameraRotation();

    }
  	else
  		this.axis.display();

    this.popMatrix();
    // ---- END Background, camera and axis setup
};
/**
 * Displays everything
 */
XMLscene.prototype.displayEverything = function(){

  this.gameGraphs['lear.xml'].displayScene();
  this.gameGraphs[this.currentEnvironment].displayScene();

  this.displayWhitePieces();
  this.displayBlackPieces();
  this.displayBoardTiles();

  this.displayBoard();
};

/**
 * Displays all Board Tiles
 */
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

  this.pushMatrix();

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
            line[i]['textureObj'] = texBlack[0];
          }

          line[i]['materialObj'].apply();

          if (line[i]['textureObj'] != null){
            line[i]['textureObj'].bind();
          }

          if (this.currentBoard[j][i] == "emptyCell")
            this.registerForPick(cellId, line[i].leaves[0]);
          else
            this.registerForPick(0, line[i].leaves[0]);

            // if (line[i].leaves[0].selected)
            //   this.setActiveShader(this.shaders['Red Pulse']);

          line[i].leaves[0].display();

        //  this.setActiveShader(this.defaultShader);

          this.translate((CELL_WIDTH/2), 0, 0);
        }
      this.popMatrix();
    this.translate(0, 0, (CELL_WIDTH/2));
  }
  this.popMatrix();
};

/**
 * Displays pieces on board based on the currentBoard from Prolog
 */
XMLscene.prototype.displayBoard = function(){
    this.pushMatrix();
      this.translate(PIECE_WIDTH, 0, PIECE_WIDTH);
      for (let i = 0; i < BOARD_WIDTH; i++) {
          this.pushMatrix();
            for (let j = 0; j < BOARD_WIDTH; j++) {
                if (this.currentBoard[i][j] == 'X')
                    this.displayPiece(this.blackPiece, this.blackPiece["textureObj"], this.blackPiece["materialObj"], 0);
                else if(this.currentBoard[i][j] == 'O')
                    this.displayPiece(this.whitePiece, this.whitePiece["textureObj"], this.whitePiece["materialObj"], 0);

                this.translate(2*PIECE_WIDTH, 0, 0);
            }
          this.popMatrix();
        this.translate(0, 0, 2*PIECE_WIDTH);
      }
    this.popMatrix();
};

/**
 * Displays all available pieces in the white box
 */
XMLscene.prototype.displayWhitePieces = function(){
  let counter = 64;
	this.pushMatrix();
    this.translate(6.6,0,0.4);

    for (let i = 1; i <= 4; i++){
      this.pushMatrix();
      for (let j = 1; j <= 8; j++){
        counter++;
        this.displayPiece(this.whitePiecesArray[counter], this.whitePiece['textureObj'], this.whitePiece['materialObj'], counter);
        this.translate( 0, 0, 0.6);
      }
      this.popMatrix();
      this.translate(0.6, 0, 0);
  	}
	this.popMatrix();
};

/**
 * Displays all available pieces in the black box
 */
XMLscene.prototype.displayBlackPieces = function(){
  let counter = 96;
	this.pushMatrix();
    this.translate(-4.4,0,0.4);
    for (let j = 0; j < 4; j++){
      this.pushMatrix();

      for (let i = 0; i < 8; i++){
        counter++;
        this.displayPiece(this.blackPiecesArray[counter], this.blackPiece['textureObj'], this.blackPiece['materialObj'], counter);
        this.translate( 0, 0, 0.6);
      }
      this.popMatrix();
      this.translate(0.6, 0, 0);
  	}
	this.popMatrix();
};

/**
 * Displays a piece
 * @param node piece to be displayed
 * @param parTex texture of node
 * @param parAsp material of node
 * @param pick picking value of the piece
 */
XMLscene.prototype.displayPiece = function(node, parTex, parAsp, pick) {

  	var textura = parTex;
  	var material = parAsp;

    this.pushMatrix();
    this.multMatrix(node.animationMatrix);
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
      this.displayPiece(this.gameGraphs['lear.xml'].nodes[node.children[i]], textura, material, pick);
    }

    material.apply();

    if (textura != null) {
        textura.bind();
    }

    for (let j = 0; j < node.leaves.length; j++){
      // if (pick ){
      //   // if (node.leaves[j].selected)
      //   //   this.setActiveShader(this.shaders['Red Pulse']);
      //   pick = 65;
      // // }
      // if (pick ==)
      this.registerForPick(pick, node.leaves[j]);
      node.leaves[j].display();
    }
    this.popMatrix();
};

/**
 * Gets a prolog Request
*/
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
/**
 * Makes a prolog Request
*/
function makeRequest(requestString){
    // Make Request
    getPrologRequest(requestString, handleReply);
}

/**
 * Handles the server's response, updating currentBoard,
 * freeTiles and gameEnded attributes
 * @param data JSON server response
 */
function handleReply(data){
    console.log("Reply!!\n");
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
/**
 * Parses the Board from Prolog with RegEx
*/
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

/**
 * Converts the Board to a string
 @param board Board
*/
function boardToString(board){
	let boardString = "[";
	for (let i = 0; i < scene.currentBoard.length; i++) {
		boardString +="[";
		for (let j = 0; j < scene.currentBoard[i].length; j++) {
				boardString += "'" + scene.currentBoard[i][j] + "'";
				if(j != scene.currentBoard[i].length -1)
					boardString += ",";
		}
		boardString += "]";
		if(i != scene.currentBoard.length - 1)
			boardString += ",";
	}
	boardString += "]";
	return boardString;
}
/**
 * Sets the lights on the screen
*/
XMLscene.prototype.setLights = function(){
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
};

/**
 * Updates the animations
 *@param currTime current time
*/
XMLscene.prototype.update = function(currTime){
 	for(var node in this.gameGraphs['lear.xml'].nodes) {
		this.gameGraphs['lear.xml'].nodes[node].updateAnimationMatrix(currTime - this.lastTime);
	}
  for(var node in this.gameGraphs[this.currentEnvironment].nodes) {
     this.gameGraphs[this.currentEnvironment].nodes[node].updateAnimationMatrix(currTime - this.lastTime);
	}
  if (this.gameGraphs['lear.xml'].loadedOk && this.whitePiecesArray.length){
    for(let i = 65; i < 97; i++)
      this.whitePiecesArray[i].updateAnimationMatrix(currTime - this.lastTime);
    for(let i = 97; i < 129; i++)
       this.blackPiecesArray[i].updateAnimationMatrix(currTime - this.lastTime);
  }
	this.lastTime = currTime;
}

/**
 * Updates shaders' scaling factor based on the date
 * @param date date
*/
XMLscene.prototype.updateScalingFactor = function(date){
    this.shaders[this.currentShader].setUniformsValues({timeFactor: date});
};
/**
 * Rotates the Camera
 * @param rotation angle
*/
XMLscene.prototype.rotateCamera = function(rotation){
    this.cameraRotation = rotation;
    this.cameraAcc = 0;
};
/**
 * Changes the Camera ViewPoint
*/
XMLscene.prototype.changeCamera = function(){
    this.cameraAcc = 0;

    if (this.currentCameraAngle == 0){ // index start at 1
        this.cameraRotation = 90;
        this.currentCameraAngle++; // if 1, White Player Viewpoint
      }
    else if (this.currentCameraAngle == 1){
      this.cameraRotation = 45;
      this.currentCameraAngle++; // if 2, Black Player Viewpoint
    }
    else if (this.currentCameraAngle == 2){
      this.cameraRotation = 22;
      this.currentCameraAngle = 0; // if 2, Top View
    }

};
/**
 * Updates the Camera Rotation
*/
XMLscene.prototype.updateCameraRotation = function(){
  let increment = this.deltaTime/3 * this.cameraRotation / Math.abs(this.cameraRotation);
  if(Math.abs(this.cameraAcc) < Math.abs(this.cameraRotation)) {
     if(Math.abs(this.cameraAcc+increment) > Math.abs(this.cameraRotation))
         increment = this.cameraRotation-this.cameraAcc;
     if (this.currentCameraAngle == 0)
        this.camera.orbit(CGFcameraAxisID.Y, increment * DEGREE_TO_RAD);
     if (this.currentCameraAngle == 1)
        this.camera.orbit(CGFcameraAxisID.Z, increment * DEGREE_TO_RAD);
    if (this.currentCameraAngle == 2)
       this.camera.orbit(CGFcameraAxisID.X, increment * DEGREE_TO_RAD);
     this.cameraAcc += increment;
  }
};
