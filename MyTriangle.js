 
/**
 * MyTriangle
 * @constructor
 * @args coordinates of each vertex(x,y,z)
 */
 function MyTriangle(scene, args) {
 	CGFobject.call(this,scene);
    this.initBuffers(args);
 };

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;

 MyTriangle.prototype.initBuffers = function(args) {
   
    this.vertices = new Array();
    this.indices = new Array();
    this.normals = new Array();

    this.vertices.push(args[0],args[1],args[2]);
    this.vertices.push(args[3],args[4],args[5]);
    this.vertices.push(args[6],args[7],args[8]);

    this.normals.push(0,1,0);
    this.normals.push(0,1,0);
    this.normals.push(0,1,0);

    this.indices.push(0, 1, 2);
       
    this.primitiveType=this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};