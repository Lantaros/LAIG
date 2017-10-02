/**
 * MyCylinderClosed
 * @constructor
 */
function MyCylinderClosed(scene, slices, stacks) {
    CGFobject.call(this, scene);

    this.slices = slices;
    this.stacks = stacks;

    this.initBuffers();
}
;
MyCylinderClosed.prototype = Object.create(CGFobject.prototype);
MyCylinderClosed.prototype.constructor = MyCylinderClosed;

MyCylinderClosed.prototype.initBuffers = function() {
    /*
 	* TODO:
 	* Replace the following lines in order to build a cylinder with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a cylinder with varying number of slices and stacks?
 	*/

    var stepAng = 2 * Math.PI / this.slices;
    //step in radians	
    this.vertices = new Array();
    this.indices = new Array();
    this.normals = new Array();
    this.texCoords = new Array();

    var deltaS = 1/this.slices;
	var deltaT = 1/this.stacks;

	var depth = 1.0/this.stacks;

 	for (let i = 0; i <=this.stacks; i++){
		for (let j = 0; j <= this.slices; j++){
			this.vertices.push(Math.cos(j*stepAng), Math.sin(j*stepAng),i*depth);	
			this.normals.push(Math.cos(j*stepAng), Math.sin(j*stepAng), 0);						
			this.texCoords.push(j*deltaS, i*deltaT);

		}
 	}

 	for(let i = 0; i < this.stacks; i++){
		for(let j = 0; j <= this.slices; j++){	
			this.indices.push((i*this.slices)+j+i, (i*this.slices)+this.slices+j+1+i, i*(this.slices)+this.slices+j+i);
			this.indices.push((i*this.slices)+j+i, (i*this.slices)+j+1+i, i*(this.slices)+this.slices+j+1+i);
		}
 	}		
//------------------LIDS-----------------------------------------------------
    var lidVtxIdx = this.vertices.length/3;

    //Back lid (Z--)
    this.vertices.push(0, 0, 0);
    this.normals.push(0, 0, -1);
    this.texCoords.push(0.5, 0.5);

    for (let i = 0; i < this.slices; i++) {

        this.vertices.push(Math.cos(i * stepAng), Math.sin(i * stepAng), 0);
        this.normals.push(0, 0, -1);
        this.texCoords.push(Math.cos(i * stepAng) / 2 + 0.5, 1 - (Math.sin(i * stepAng) / 2 + 0.5));

        this.indices.push(lidVtxIdx, lidVtxIdx + i + 2, lidVtxIdx + i + 1);
    }

//     //Last point
    this.vertices.push(1, 0, 0);
    this.normals.push(0, 0, -1);
    this.texCoords.push(1, 0.5);
    this.indices.push(lidVtxIdx, lidVtxIdx + (this.slices-1) + 2, lidVtxIdx + (this.slices-1) + 1);


    lidVtxIdx = this.vertices.length/3;
    
    //Front lid (Z++)
    this.vertices.push(0, 0, 1);
    this.normals.push(0, 0, 1);
    this.texCoords.push(0.5, 0.5);

    for (let i = 0; i < this.slices; i++) {

        this.vertices.push(Math.cos(i * stepAng), Math.sin(i * stepAng), 1);
        this.normals.push(0, 0, 1);
        this.texCoords.push(Math.cos(i * stepAng) / 2 + 0.5, 1 - (Math.sin(i * stepAng) / 2 + 0.5));

        this.indices.push(lidVtxIdx, lidVtxIdx + i + 1, lidVtxIdx + i + 2);
    }

     //Last point 2 Lid
    this.vertices.push(1, 0, 1);
    this.normals.push(0, 0, 1);
    this.texCoords.push(1, 0.5);
    this.indices.push(lidVtxIdx, lidVtxIdx + (this.slices-1) + 2, lidVtxIdx + (this.slices-1) + 1);


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
