/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */


function MyQuad(args) {
	CGFobject.call(this,scene);

	this.minS = minS;
	this.maxS = maxS;
	this.minT = minT;
	this.maxT = maxT;
	this.initBuffers();
};

MyQuad.prototype = Object.create(CGFobject.prototype);
MyQuad.prototype.constructor=MyQuad;

MyQuad.prototype.initBuffers = function () {
	this.vertices = [
            args[0], args[1], 0, //A ->0
            args[0], args[3] ,0,  //B ->1
            args[2], args[3], 0,   //C ->2
            args[2], args[1], 0,  //D ->3
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
   	
    this.texCoords = [
		this.minS, this.maxT,
		this.maxS, this.maxT,
		this.maxS, this.minT,
		this.minS, this.minT,
	];
	 
		
	this.primitiveType=this.scene.gl.TRIANGLES;


	this.initGLBuffers();
};