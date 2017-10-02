/**
 * MyLamp
 * @constructor
 */
 function MyLamp(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;

 	this.initBuffers();
 };

 MyLamp.prototype = Object.create(CGFobject.prototype);
 MyLamp.prototype.constructor = MyLamp;

 MyLamp.prototype.initBuffers = function() {

	var stepAng = 2*Math.PI / this.slices; //step in radians	
	this.vertices = new Array();
	this.indices = new Array();
	this.normals = new Array();
	this.texCoords = new Array();
	//var depth = 1.0/this.stacks;
	var radius = (Math.PI/2) / this.stacks; //Radius 
	var currtRadius;

 	for (var i = 0; i <this.stacks; i++){
		currtRadius = i * radius;
		for (var j = 0; j < this.slices; j++){
			//vertices and normals
			this.vertices.push(Math.sin(currtRadius) * Math.cos(j*stepAng), Math.sin(currtRadius) * Math.sin(j*stepAng), Math.cos(currtRadius));	
			this.normals.push(Math.sin(currtRadius) * Math.cos(j*stepAng), Math.sin(currtRadius) * Math.sin(j*stepAng), Math.cos(currtRadius));	
			
			this.vertices.push(Math.sin(currtRadius + radius) * Math.cos(j*stepAng), Math.sin(currtRadius + radius) * Math.sin(j*stepAng), Math.cos(radius * (i+1)));
			this.normals.push(Math.sin(currtRadius + radius) * Math.cos(j*stepAng), Math.sin(currtRadius + radius) * Math.sin(j*stepAng), Math.cos(radius * (i+1))); //Normals in line with the vertexes	

			this.texCoords.push(((i + 1)/this.stacks) * (Math.cos(j*stepAng)/2 + 0.5), (i + 1)/this.stacks) * (1- (Math.sin(j*stepAng)/2 + 0.5));
			this.texCoords.push(((i + 1)/this.stacks) * (Math.cos(j*stepAng)/2 + 0.5), (i + 2)/this.stacks) * (1- (Math.sin(j*stepAng)/2 + 0.5));


	 		//indices
	 		/*this.indices.push((i*2*this.slices)+(2*j)+0);
			this.indices.push((i*2*this.slices)+(((2*j)+3)% (this.slices * 2)));
			this.indices.push((i*2*this.slices)+(2*j)+1);
		
			this.indices.push((i*2*this.slices)+(((2*j)+0) % (this.slices * 2))); //This doesn't need integer division
			this.indices.push((i*2*this.slices)+(((2*j)+2) % (this.slices * 2)));
			this.indices.push((i*2*this.slices)+(((2*j)+3) % (this.slices * 2)));*/
			this.indices.push((i*2*this.slices)+(2*j)+0);
			this.indices.push((i*2*this.slices)+(2*j)+1);
			this.indices.push((i*2*this.slices)+(((2*j)+3)% (this.slices * 2)));
		
			this.indices.push((i*2*this.slices)+(((2*j)+2) % (this.slices * 2)));
			this.indices.push((i*2*this.slices)+(((2*j)+0) % (this.slices * 2))); //This doesn't need integer division
			this.indices.push((i*2*this.slices)+(((2*j)+3) % (this.slices * 2)));

		}
 	}

	
	//DEBUG
//  	console.log("vertices: " + this.vertices.length + "   " + this.vertices + "\n");
 	//console.log("normals: " +  this.normals.length + "   " +  this.normals + "\n");
 	//console.log("indices: " + this.indices.length/3 + "  " + this.indices + "\n");
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
