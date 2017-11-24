
class ComboAnimation{
  constructor(scene, id, animations){
    this.scene = scene;
    this.id = id;
    this.animstions = animations;
  }

getTransformMatrix(time, section) {
   if(time * this.angVelocity >=  this.rotAng)
      this.animationEnd = true;
   else {
     mat4.identity(this.transformMatrix);
     let dAlfa = this.startAng + this.angVelocity* time;
     mat4.translate(this.transformMatrix, this.transformMatrix, [this.center[0], this.center[1], this.center[2] ]);
     mat4.rotate(this.transformMatrix, this.transformMatrix, dAlfa, [0, 1, 0]);
     mat4.translate(this.transformMatrix, this.transformMatrix, [this.radius, 0, 0]);
     mat4.rotate(this.transformMatrix, this.transformMatrix, Math.PI/2, [0, 1, 0]);
   }
   return this.transformMatrix;
 }

}
