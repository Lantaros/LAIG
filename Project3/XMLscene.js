var DEGREE_TO_RAD = Math.PI / 180;

let CELL_WIDTH = 0.5;
let BOARD_WIDTH = 8;
let BOARD_Y_OFFSET = 0;
let WHITEBOX_CORNER = 6;

let PIECE_RADIUS = 0.25;
let PIECE_HEIGHT = 0;
let PIECE_Y_OFFSET = 0.2;
let ARC_HEIGHT = 3;

let CAMERA_TILT = 20;
let CAMERA_TILT_ORIGINAL = 25;
let CAMERA_TILT_BLACK = 25;
let CAMERA_PAN = 40;
let CAMERA_TILT_INCREMENT = Math.PI/180*2.5;
let CAMERA_PAN_INCREMENT_POS = [0.2,0,1];
let CAMERA_PAN_INCREMENT_NEG = [-0.2,0,1];

let Y_OFFSET_ALL = -0.45;

let scene;

/**
 * XMLscene class, representing the scene that is to be rendered.
 * @constructor
 */
function XMLscene(interfac) {
    CGFscene.call(this);

    this.interface = interfac;

    this.lightValues = {};

    this.lastTime = 0;

    this.currentSelectable = "None";
    this.currentShader = "Red Pulse";

    this.shaders = new Array();
    this.shadersRefs = new Array();

    this.gameGraphs = new Array();

    this.gameEnvironnments = new Array();

    //Lear variables
    this.boardPieces = new Array();
    this.gameEnded = false;

    this.gameModes = ["PVP", "PVB", "BVB"];

    this.currentGameMode = "PVP";

    this.rotation = true;

    this.botDifficulties = ["Random", "Normal"];

    this.currentDifficulty = "Random";

    this.currentCameraAngle = 0;

    let board =  new Array(BOARD_WIDTH);
    for (let i = 0; i < board.length; i++) {
        board[i] = new Array(BOARD_WIDTH).fill(0);
    }
    scene = this;

    this.selectedPiece = 0;

    this.initialTime = new Date().getTime();

    this.whitePiecesArray = new Array();
    this.blackPiecesArray = new Array();

    this.lear ={
      currentBoard: board,
      counter:64,
      whiteCounter:32,
      blackCounter:32,
      player:'X'
    };

    this.lear.lastBoards  = new Array();
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

/**
 * Handles possible picking
 */
XMLscene.prototype.logPicking = function (){
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (let i=0; i< this.pickResults.length; i++) {
				let obj = this.pickResults[i][0];
				let customId = this.pickResults[i][1];
        console.log("Picking ID: " + customId);
				if (obj && customId > 0){

          let cellColumn = (customId - 1) % BOARD_WIDTH;

          let cellLine = Math.floor(customId / BOARD_WIDTH);
          if ( (customId / BOARD_WIDTH) % 1 == 0)
            cellLine -=1;



          //  if it's a piece
          if (obj.type ==  "halfsphere"){
            if((this.lear.player == 'O' && customId >= 65 && customId <= 97) ||
            (this.lear.player == 'X' && customId >= 98 && customId <= 130))
              this.selectedPiece = customId;
            else
              this.selectedPiece = 0;
          }

          else if (obj.type == "boardcell" && this.selectedPiece != 0){
                let control_points = new Array();

                let pID = this.selectedPiece - 65;
                let pieceColumn = pID % 8;

                let pieceLine = Math.floor(pID / 8) ;

                  console.log("Piece L: " + pieceLine);
                  console.log("Piece C: " + pieceColumn);
                  console.log("Cell L: " + cellLine);
                  console.log("Cell C: " + cellColumn);

                  /*P1 = (x1, y1, z1)
                    P2 = (x1 + 1/3*(x4-x1), y23, z1 + 1/3*(z4-z1))
                    P3 = (x1 + 2/3*(x4-x1), y23, z1 + 2/3*(z4-z1))
                    P1 = (x4, y4, z4)
                  */
                let p1 = [0 ,0, 0];

                let pf = [CELL_WIDTH/2 + cellColumn * CELL_WIDTH,
                          PIECE_Y_OFFSET + PIECE_HEIGHT,
                          CELL_WIDTH/2 + cellLine * CELL_WIDTH];

                let chosenPiece = [ WHITEBOX_CORNER + PIECE_RADIUS  + PIECE_RADIUS * pieceLine,
                  PIECE_Y_OFFSET,
                  PIECE_RADIUS + PIECE_RADIUS * pieceColumn];

                  console.log("pf " + pf);
                  console.log("chosenPiece " + chosenPiece);


                let p4 = [pf[0] - chosenPiece[0],
                          pf[1] - chosenPiece[1],
                          pf[2] - chosenPiece[2] ];

                control_points.push(p1);
                control_points.push([p1[0] + 1/3*(p4[0] - p1[0]),
                                     ARC_HEIGHT,
                                    p1[2] + 1/3*(p4[2] - p1[2])]);

                control_points.push([p1[0] + 2/3*(p4[0] - p1[0]),
                                    ARC_HEIGHT,
                                   p1[2] + 2/3*(p4[2] - p1[2])]);

                control_points.push(p4);
                
                let animationObj = new BezierAnimation(this, this.selectedPiece, 1, control_points);

                this.nextPieceAnimeInfo = {
                  animation: animationObj,
                  pickID: this.selectedPiece,
                };
                
                if (this.lear.player == "X"){
                    this.lear.whiteCounter--;
      					    this.whitePiecesArray[this.selectedPiece].animationRefs.push(this.selectedPiece);
                    }
                    else{
                        this.lear.blackCounter--;
                        this.blackPiecesArray[this.selectedPiece].animationRefs.push(this.selectedPiece);
                    }
                    this.lear.counter--;
    
                moveRequest(this.lear.currentBoard, cellLine + 1, cellColumn + 1, this.lear.player);
            }
          }
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
    this.interface.addLightsGroup(this.gameGraphs["lear.xml"].lights);
    this.interface.addShadersDropdown(this.shadersRefs);
    this.interface.addGameOptions(this.gameModes, this.botDifficulties);
    this.interface.addExtraOptions(this.gameEnvironnments, this.cameraAngles);

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
		this.whiteCell['materialObj'] = matWhite;
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

    //Boxes
  this.whiteBox = this.gameGraphs['lear.xml'].nodes["whiteBox"];
  this.blackBox = this.gameGraphs['lear.xml'].nodes["blackBox"];

  texWhite = this.gameGraphs['lear.xml'].textures[this.whiteBox.textureID];
  matWhite =  this.gameGraphs['lear.xml'].materials[this.whiteBox.materialID];

  if (matWhite != null)
    this.whiteBox['materialObj'] =  matWhite;
  else
    this.whiteBox['materialObj'] =  this.gameGraphs['lear.xml'].materials['defaultMaterial'];

  texBlack = this.gameGraphs['lear.xml'].textures[this.blackBox.textureID];
  matBlack =  this.gameGraphs['lear.xml'].materials[this.blackBox.materialID];

  if (matBlack != null)
    this.blackBox['materialObj'] =  matBlack;
  else
    this.blackBox['materialObj'] =  this.gameGraphs['lear.xml'].materials['defaultMaterial'];

    for(let i = 65; i < 97; i++)
      this.whitePiecesArray[i] = new MyGraphNode(this.whitePiece);
    for(let i = 97; i < 129; i++)
      this.blackPiecesArray[i] = new MyGraphNode(this.blackPiece);
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

  this.gameGraphs[this.currentEnvironment].displayScene();
  this.pushMatrix();
    this.translate(0,Y_OFFSET_ALL, 0);
    this.displayBox(this.blackBox, this.blackBox["textureObj"], this.blackBox["materialObj"]);
    this.displayBox(this.whiteBox, this.whiteBox["textureObj"], this.whiteBox["materialObj"]);
    this.displayWhitePieces();
    this.displayBlackPieces();
    this.displayBoardTiles();
    this.displayBoard();
  this.popMatrix();
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

          if (this.lear.currentBoard[j][i] == "emptyCell")
            this.registerForPick(cellId, line[i].leaves[0]);
          else
            this.registerForPick(0, line[i].leaves[0]);

            //if (line[i].leaves[0].selected)
            //   this.setActiveShader(this.shaders['Red Pulse']);

          line[i].leaves[0].display();

        //  this.setActiveShader(this.defaultShader);

          this.translate(CELL_WIDTH, 0, 0);
        }
      this.popMatrix();
    this.translate(0, 0, CELL_WIDTH);
  }
  this.popMatrix();
};

/**
 * Displays pieces on board based on the currentBoard from Prolog
 */
XMLscene.prototype.displayBoard = function(){
    this.pushMatrix();
      this.translate(PIECE_RADIUS, 0, PIECE_RADIUS);
      for (let i = 0; i < BOARD_WIDTH; i++) {
          this.pushMatrix();
            for (let j = 0; j < BOARD_WIDTH; j++) {
                if (this.lear.currentBoard[i][j] == 'X')
                    this.displayPiece(this.blackPiece, this.blackPiece["textureObj"], this.blackPiece["materialObj"], 0);
                else if(this.lear.currentBoard[i][j] == 'O')
                    this.displayPiece(this.whitePiece, this.whitePiece["textureObj"], this.whitePiece["materialObj"], 0);

                this.translate(2*PIECE_RADIUS, 0, 0);
            }
          this.popMatrix();
        this.translate(0, 0, 2*PIECE_RADIUS);
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
        if (this.whitePiecesArray[counter] != null){
          this.displayPiece(this.whitePiecesArray[counter], this.whitePiece['textureObj'], this.whitePiece['materialObj'], counter);
          this.translate( 0, 0, 0.6);
        }
      }
      this.popMatrix();
      this.translate(0.6, 0, 0);
  	}
	this.popMatrix();
};

/**
 * Displays the boxes
 */
XMLscene.prototype.displayBox = function(node, parTex, parAsp){

  var textura = parTex;
  var material = parAsp;

  this.pushMatrix();
  this.multMatrix(node.transformMatrix);
  this.multMatrix(node.animationMatrix);

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
    this.displayBox(this.gameGraphs['lear.xml'].nodes[node.children[i]], textura, material);
  }

  material.apply();

  if (textura != null) {
      textura.bind();
  }

  for (let j = 0; j < node.leaves.length; j++)
    node.leaves[j].display();

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
        if (this.blackPiecesArray[counter] != null){
          this.displayPiece(this.blackPiecesArray[counter], this.blackPiece['textureObj'], this.blackPiece['materialObj'], counter);
          this.translate( 0, 0, 0.6);
        }
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
    this.multMatrix(node.transformMatrix);
    this.multMatrix(node.animationMatrix);


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
     /*if (node.leaves[j].selected)
        this.setActiveShader(this.shaders[this.currentShader]);
      else
        this.setActiveShader(this.defaultShader);*/
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
    let regex = new RegExp("^([^-]+)(?:-([^-]+)-(.+))?$");
    let matched = regex.exec(data.target.responseText);
    if(matched[1] == "Invalid Move"){
      scene.lear.invalidMove = true;
      //scene.lear.reply = true;
      return;
    }

    scene.lear.invalidMove = false;   
    scene.lear.boardAfterAnimation = parseBoard(matched[1]);

    if(matched[2] != undefined && matched[3] != undefined){
      scene.lear.lastBoards.push(scene.lear.currentBoard);
      scene.lear.counter = matched[2];
      scene.lear.gameEnded = matched[3];

      //When the response is alright, procede to animate
    let animation = scene.nextPieceAnimeInfo.animation;
    animation.setStartTime((new Date().getTime() - scene.initialTime)/1000);
    scene.animations[scene.nextPieceAnimeInfo.pickID] = animation;
    scene.animations.length++;
    scene.lear.player == 'X' ? scene.lear.player = 'O' : scene.lear.player = 'X';
  }
  else
    scene.lear.currentBoard = scene.lear.boardAfterAnimation;

    console.log(scene.lear.boardAfterAnimation);
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
 @param board Board to stringify
*/
function boardToString(board){
	let boardString = "[";
	for (let i = 0; i < board.length; i++) {
		boardString +="[";
		for (let j = 0; j < board[i].length; j++) {
				boardString += "'" + board[i][j] + "'";
				if(j != board[i].length -1)
					boardString += ",";
		}
		boardString += "]";
		if(i != board.length - 1)
			boardString += ",";
	}
	boardString += "]";
	return boardString;
}

/**
 * Makes Prolog a move request, expecting to receive
 * the new board or "Invalid Move"
 * @param  board current board matrix
 * @param  line move's board line
 * @param  column move's board column
 * @param  player current player char -  'X' or 'O' 
 */
function moveRequest(board, line, column, player){  
	makeRequest("moveRequest(" + boardToString(board) + "," + line + "," + column + ",'X'," + scene.lear.counter + ")");
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

  if(this.nextPieceAnimeInfo != null && this.nextPieceAnimeInfo.animation.hasEnded()) //When piece animation has finished
      this.lear.currentBoard = this.lear.boardAfterAnimation;


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
    this.rotation= true;
    this.cameraTiltBlackCounter = 0;
    this.cameraPanCounter = 0;
    this.cameraTiltCounter = 0;
};

/**
 * Updates the Camera Rotation
*/
XMLscene.prototype.updateCameraRotation = function(){

  if (this.rotation){
    if (this.currentCameraAngle == 0){ //WHITE VIEW
       if (this.cameraTiltCounter < CAMERA_TILT) {
           this.camera.orbit(CGFcameraAxisID.Y, Math.PI/90 *1.1);
           this.cameraTiltCounter++;
       }
       else if (this.cameraTiltCounter == CAMERA_TILT){
           this.currentCameraAngle = 1;
           this.rotation = false;
       }
   }
   else if (this.currentCameraAngle == 1)  { //BLACK VIEW
     if (this.cameraTiltCounter < CAMERA_TILT_BLACK){
          this.camera.orbit(CGFcameraAxisID.Y, Math.PI/90 * 3.6);
          this.cameraTiltCounter++;
      }
     else if (this.cameraTiltCounter == CAMERA_TILT_BLACK){
        this.currentCameraAngle = 2;
        this.rotation = false;
      }
   }
    else if(this.currentCameraAngle == 2){  //TOP DOWN VIEW
      if (this.cameraTiltBlackCounter < CAMERA_TILT_BLACK){
           this.camera.orbit(CGFcameraAxisID.Y, Math.PI/90 * 3.6);
           this.cameraTiltBlackCounter++;
       }
      else if (this.cameraTiltCounter < CAMERA_TILT){
            this.camera.orbit(CGFcameraAxisID.X, CAMERA_TILT_INCREMENT);
            this.cameraTiltCounter++;
        }
        else if (this.cameraPanCounter < CAMERA_PAN){
            this.camera.orbit(CGFcameraAxisID.Y, Math.PI/2);
            this.camera.pan(CAMERA_PAN_INCREMENT_POS);
            this.camera.orbit(CGFcameraAxisID.Y, -Math.PI/2);
            this.cameraPanCounter++;
          }
         else if (this.cameraPanCounter == CAMERA_PAN && this.cameraTiltCounter == CAMERA_TILT){
            this.currentCameraAngle = 3;
            this.rotation = false;
        }
     }
   else if (this.currentCameraAngle == 3)  {  //RESET TOP DOWN VIEW
     if (this.cameraPanCounter < CAMERA_PAN) {
        this.camera.orbit(CGFcameraAxisID.Y, Math.PI / 2);
        this.camera.pan(CAMERA_PAN_INCREMENT_NEG);
        this.camera.orbit(CGFcameraAxisID.Y, -Math.PI / 2);
        this.cameraPanCounter = this.cameraPanCounter + 1;
    }
    else if (this.cameraTiltCounter < CAMERA_TILT) {
        this.camera.orbit(CGFcameraAxisID.X, -CAMERA_TILT_INCREMENT);
        this.cameraTiltCounter++;
    }
    else if (this.cameraPanCounter == CAMERA_PAN && this.cameraTiltCounter == CAMERA_TILT){
        this.currentCameraAngle = 0;
        this.rotation = false;
    }
   }
 }
};
