/**
 * A Circular Animation
 * @extends Animation
 */
class CircularAnimation extends Animation{
  /**
   * Constructs a Circular Animation
   * @param scene The Scene of the World
   * @param id Animation ID
   * @param animationVelocity Animation Velocity
   * @param center  Center coordinates
   * @param radius Distance between the object and the center
   * @param startAng Initial Angle
   * @param rotAng Rotation Angle
   */
  constructor(scene, id, animationVelocity, center, radius, startAng, rotAng){
    super(scene, id, animationVelocity, new Array());

    this.radius = radius;
    this.startAng = startAng * Math.PI/180;
    this.rotAng = rotAng * Math.PI/180;
    this.center = center;
    this.angVelocity = this.animationVelocity/this.radius;

    this.transformMatrix = mat4.create();
    this.totalTime = this.rotAng / this.angVelocity;
    this.secTimes.push(this.totalTime);
}
/**
 * Calculates the new Transform Matrix for the Animation
 * @param node Node referencing the Animation
 * @param time Time passed
 * @param section Current Section of the Animation(not used)
 * @return Returns the new Transform Matrix
 */
getTransformMatrix(node, time, section) {
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
