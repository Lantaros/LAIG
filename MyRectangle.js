/**
 * MyRectangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */


function MyRectangle(scene, args) {
	CGFobject.call(this,scene);
	
	this.args = new Array();

	for(let i = 0; i < args.length; i++){
		if(i % 2 == 0)
			this.args.push(parseInt([i]));
	}

	this.initBuffers();
};

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor=MyRectangle;

MyRectangle.prototype.initBuffers = function () {
// 	this.vertices = [
//             this.args[0], this.args[1], 0, //A ->0
//             this.args[0], this.args[3] ,0,  //B ->1
//             this.args[2], this.args[3], 0,   //C ->2
//             this.args[2], this.args[1], 0,  //D ->3
// 			];

this.vertices = [
            this.args[0], this.args[1], 0, //A ->0
            this.args[0], this.args[3] ,0,  //B ->1
            this.args[2], this.args[3], 0,   //C ->2
            this.args[2], this.args[1], 0,  //D ->3
			];

	this.indices = [
		  //xy z=0.5
          0,1,2,  //ABC
          2,3,0,  //CDA
        ];

    this.normals = [
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
    ]

	//coordenadas de textura, tendo em conta os vértices
   	
   /* this.texCoords = [
		this.minS, this.maxT,
		this.maxS, this.maxT,
		this.maxS, this.minT,
		this.minS, this.minT,
	];*/
	 
		
	this.primitiveType=this.scene.gl.TRIANGLES;

	//console.log("Rect parsed");


	this.initGLBuffers();
};