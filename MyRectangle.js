/**
 * MyRectangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 * @ param args coordinates for left-top and right-bottom vertices.
 */


function MyRectangle(scene, args) {
	CGFobject.call(this,scene);

	this.args = [];
	this.args = args;
	this.args = this.args.split(" ");
	for(let i = 0; i < args.length; i++){
			this.args[i] = parseFloat(this.args[i]);
	}



	this.minS = 0;
	this.minT = 0;
	this.maxS = 1;
	this.maxT = 1;

	this.initBuffers();
};

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor=MyRectangle;

MyRectangle.prototype.initBuffers = function () {

this.vertices = [
            this.args[0], this.args[1], 0,
            this.args[0], this.args[3] ,0,
            this.args[2], this.args[3], 0,
            this.args[2], this.args[1], 0,
			];

	this.indices = [
           0,1,2,
           2,3,0,
        ];

    this.normals = [
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
    ]

	//coordenadas de textura, tendo em conta os vértices

   this.texCoords = [
		this.minS, this.minT,
		this.minS, this.maxT,
		this.maxS, this.maxT,
		this.maxS, this.minT,
	];


	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
