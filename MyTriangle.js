 
/**
 * MyTriangle
 * @constructor
 */
 function MyTriangle(scene) {
 	CGFobject.call(this,scene);
    this.initBuffers();
 };

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;

 MyTriangle.prototype.initBuffers = function() {
   
    this.vertices = new Array();
    this.indices = new Array();
    this.normals = new Array();

    this.vertices.push(0,0,0);
    this.vertices.push(1,0,0);
    this.vertices.push(0,1,0);
    this.normals.push(0,1,0);
    this.normals.push(0,1,0);
    this.normals.push(0,1,0);

    this.indices.push(0, 1, 2);
       
    this.primitiveType=this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};