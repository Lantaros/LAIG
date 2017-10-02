
function MyUnitCubeQuad(scene) {
	CGFobject.call(this,scene);

	this.quad=new MyQuad(this.scene);
    this.quad.initBuffers();

};

MyUnitCubeQuad.prototype = Object.create(CGFobject.prototype);
MyUnitCubeQuad.prototype.constructor=MyUnitCubeQuad;		

MyUnitCubeQuad.prototype.display = function () {

	this.scene.pushMatrix();
   	this.scene.translate(0,0,0.5); //face da frente    
    this.quad.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0,0,-0.5); //face de trás    
    this.scene.rotate(-Math.PI,1,0,0);
    this.quad.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0,0.5,0)
   	this.scene.rotate(-Math.PI/2,1,0,0); //face de cima    
    this.quad.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0,-0.5,0)
   	this.scene.rotate(Math.PI/2,1,0,0); //face de baixo    
    this.quad.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0.5,0,0)
   	this.scene.rotate(Math.PI/2,0,1,0); //face de lado direito  
    this.quad.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(-0.5,0,0)
   	this.scene.rotate(-Math.PI/2,0,1,0); //face de lado esquerdo   
    this.quad.display();
    this.scene.popMatrix();

};
