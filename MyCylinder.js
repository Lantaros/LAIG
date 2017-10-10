/**
 * MyCylinder
 * @constructor
 * @args height, bottom radius, top radius, sections along height(stacks) and parts per section(slices), botFlag and topFlag
 */
function MyCylinder(scene, args) {
    CGFobject.call(this, scene);

    args = args.split(" ");

    this.height = parseFloat(args[0]);
    this.botRad = parseFloat(args[1]);
    this.topRad = parseFloat(args[2]);
    this.stacks = parseFloat(args[3]);
    this.slices = parseFloat(args[4]);
    this.topFlag = parseFloat(args[5]);
    this.botFlag = parseFloat(args[6]);

    //Testing
//     this.topFlag = 1;
//     this.botFlag = 1;

    this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function() {

    var stepAng = 2 * Math.PI / this.slices;
    var currRadius = this.botRad;
    var radiusInc = (this.topRad - this.botRad)/this.stacks;

    this.vertices = new Array();
    this.indices = new Array();1
    this.normals = new Array();
    this.texCoords = new Array();

    var deltaS = 1/this.slices;
    var deltaT = 1/this.stacks;

	var depth = this.height/this.stacks;

 	for (let i = 0; i <=this.stacks; i++){
		for (let j = 0; j <= this.slices; j++){
			this.vertices.push(currRadius * Math.cos(j*stepAng), currRadius * Math.sin(j*stepAng), i*depth);
			this.normals.push(currRadius * Math.cos(j*stepAng), currRadius * Math.sin(j*stepAng), 0);
			this.texCoords.push(j*deltaS, i*deltaT);

			if (i < this.stacks) {
				this.indices.push((i*this.slices)+j+i, (i*this.slices)+this.slices+j+1+i, i*(this.slices)+this.slices+j+i);
				this.indices.push((i*this.slices)+j+i, (i*this.slices)+j+1+i, i*(this.slices)+this.slices+j+1+i);
			}
		}
        currRadius += radiusInc;
 	}

  //------------------LIDS-----------------------------------------------------


    if(this.topFlag){ //Z++
		this.vertices.push(0, 0, this.height);
		this.normals.push(0, 0, 1);
		this.texCoords.push(0.5, 0.5);

		let lidVtxIdx = this.vertices.length/3;


		for (var i = 0; i < this.slices; i++)
			this.indices.push(lidVtxIdx, lidVtxIdx - i - 2, lidVtxIdx - i - 1);

		this.vertices.push(this.topRad*1, 0, this.height);
		this.normals.push(0, 0, 1);
		this.texCoords.push(1, 0.5);

}

    if(this.botFlag){ //Z--
		this.vertices.push(0, 0, 0);
		this.normals.push(0, 0, -1);
		this.texCoords.push(0.5, 0.5);

		let lidVtxIdx = this.vertices.length/3;
     

		for (var i = 0; i < this.slices; i++)
			this.indices.push(lidVtxIdx, i+1, i);

		this.vertices.push(this.botRad*1, 0, 0);
		this.normals.push(0, 0, 1);
		this.texCoords.push(1, 0.5);

    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

MyCylinder.prototype.updateTexCoords = function (sFactor, tFactor) {	

};
