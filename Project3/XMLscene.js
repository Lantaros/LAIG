var DEGREE_TO_RAD = Math.PI / 180;
var BOARD_WIDTH = 8;
var BOARD_Y_OFFSET = 0;
var CELL_WIDTH = 1;
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


XMLscene.prototype.logPicking = function ()
{
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj)
				{
					var customId = this.pickResults[i][1];
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

    this.interfac.addGameEnvironmentsDropdown(this.gameEnvironnments);

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

    if (this.gameGraphs[this.currentEnvironment].loadedOk)
    {
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
        this.displayBoard();
        // this.displayPieces();

    }
	else
	{
		// Draw axis
		this.axis.display();
	}


    this.popMatrix();

    // ---- END Background, camera and axis setup

}

XMLscene.prototype.displayBoard = function(){
  let whiteCell = this.gameGraphs['lear.xml'].nodes["whiteCell"];
  let texWhite =  this.gameGraphs['lear.xml'].textures[whiteCell.textureID];
  whiteCell.leaves[0].updateTexCoords(texWhite[1], texWhite[2]);
  let matWhite =  this.gameGraphs['lear.xml'].materials[whiteCell.materialID];

  if (matWhite != null)
    whiteCell['materialObj'] =  matWhite;
  else
    whiteCell['materialObj'] =  this.gameGraphs['lear.xml'].materials['defaultMaterial'];

    whiteCell['textureObj'] = texWhite[0];

  let blackCell =  this.gameGraphs['lear.xml'].nodes["blackCell"];
  let texBlack = this.gameGraphs['lear.xml'].textures[blackCell.textureID];
  blackCell.leaves[0].updateTexCoords(texBlack[1], texBlack[2]);
  let matBlack = this.gameGraphs['lear.xml'].materials[blackCell.materialID];

  if (matBlack != null)
    blackCell['materialObj'] = matBlack;
  else
    blackCell['materialObj'] = this.gameGraphs['lear.xml'].materials['defaultMaterial'];

  blackCell['textureObj'] = texBlack[0];



  let whiteLineStart = new Array();
  let blackLineStart = new Array();

  for(let i = 0; i < BOARD_WIDTH; i++){
    if(i % 2 == 0)
      whiteLineStart.push(whiteCell);
    else
      whiteLineStart.push(blackCell);

  }

  for(let i = 0; i < BOARD_WIDTH; i++){
    if(i % 2 == 0)
      blackLineStart.push(blackCell);
    else
      blackLineStart.push(whiteCell);
  }

  let line;
  let cellId = 0;
  for(let j = 0; j < BOARD_WIDTH; j++){
    if(j % 2 == 0)
      line = whiteLineStart;
    else
      line = blackLineStart;

    this.pushMatrix();

    for (let i = 0; i < line.length; i++) {
      cellId++;
      line[i]['materialObj'].apply();

      if (line[i]['textureObj'] != null)
        line[i]['textureObj'].bind();

      this.registerForPick(cellId, line[i].leaves[0]);

      line[i].leaves[0].display();

      this.translate((CELL_WIDTH/2), 0, 0);
    }
    this.popMatrix();
    this.translate(0, 0, (CELL_WIDTH/2));
  }
};

XMLscene.prototype.displayPieces = function(){
  let whitePiece = this.gameGraphs['lear.xml'].nodes["whitePiece"];
  let texWhite = this.gameGraphs['lear.xml'].textures[whitePiece.textureID];
  whitePiece.leaves[0].updateTexCoords(texWhite[1], texWhite[2]);
  let matWhite =  this.gameGraphs['lear.xml'].materials[whitePiece.materialID];

  if (matWhite != null)
    whitePiece['materialObj'] =  matWhite;
  else
    whitePiece['materialObj'] =  this.gameGraphs['lear.xml'].materials['defaultMaterial'];

    let blackPiece = this.gameGraphs['lear.xml'].nodes["blackPiece"];
    let texBlack = this.gameGraphs['lear.xml'].textures[blackPiece.textureID];
    blackPiece.leaves[0].updateTexCoords(texBlack[1], texBlack[2]);
    let matBlack =  this.gameGraphs['lear.xml'].materials[blackPiece.materialID];

    if (matBlack != null)
      blackPiece['materialObj'] =  matBlack;
    else
      blackPiece['materialObj'] =  this.gameGraphs['lear.xml'].materials['defaultMaterial'];


  //   this.pushMatrix();
  //
  //   for (let i = 0; i < line.length; i++) {
  //     cellId++;
  //     line[i]['materialObj'].apply();
  //
  //     if (line[i]['textureObj'] != null)
  //       line[i]['textureObj'].bind();
  //
  //     this.registerForPick(cellId, line[i].leaves[0]);
  //
  //     line[i].leaves[0].display();
  //
  //     this.translate((CELL_WIDTH/2), 0, 0);
  //   }
  //   this.popMatrix();
  //   this.translate(0, 0, (CELL_WIDTH/2));
  // }
};

XMLscene.prototype.update = function(currTime){
 for(var node in this.gameGraphs['lear.xml'].nodes) {
    this.gameGraphs['lear.xml'].nodes[node].updateAnimationMatrix(currTime - this.lastTime);
  }
  for(var node in this.gameGraphs[this.currentEnvironment].nodes) {
     this.gameGraphs[this.currentEnvironment].nodes[node].updateAnimationMatrix(currTime - this.lastTime);
    }
 this.lastTime = currTime;
}


XMLscene.prototype.updateScalingFactor = function(date)
{
    this.shaders[this.currentShader].setUniformsValues({timeFactor: date});
};
