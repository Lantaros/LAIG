
class CircularAnimation extends Animation{
  constructor(scene, id, animationVelocity, center, radius, startAng, rotAng){
    super(scene, id, animationVelocity, new Array());

    this.radius = radius;
    this.startAng = startAng;
    this.rotAng = rotAng;
    this.center = center;
    this.angVelocity = this.animationVelocity/this.radius;

    this.transformMatrix = mat4.create();
    this.lastAng = 0;
    this.time = 0;

}

 update(dt) {
    if(this.lastAng >= this.rotAng)
      return;

    this.time += dt;
    let dAlfa = this.startAng + this.angVelocity* this.time;

    mat4.identity(this.transformMatrix);

    this.transformMatrix.translate(this.center[0], this.center[1], 0);
    this.transformMatrix.rotate(dAlfa, 0, 1, 0);
    this.transformMatrix.translate(this.radius, 0, 0);
    this.transformMatrix.rotate(Math.PI/2, 0, 1, 0);
  }

}
