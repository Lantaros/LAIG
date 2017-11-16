
class LinearAnimation extends Animation{
  constructor(scene, id, animationVelocity, controlPoints){
    super(scene, id, animationVelocity, controlPoints);

    this.initValues = new Array();
    this.currentAnimation = 0;
    this.totalDistance = 0;
    for (let i = 0; i < controlPoints.length-1; i++){
      let values = new Array();
      let dist = Math.sqrt(
        (controlPoints[i+1][0] - controlPoints[i][0])*(controlPoints[i+1][0] - controlPoints[i][0]) +
        (controlPoints[i+1][1] - controlPoints[i][1])*(controlPoints[i+1][1] - controlPoints[i][1]) +
        (controlPoints[i+1][2] - controlPoints[i][2])*(controlPoints[i+1][2] - controlPoints[i][2]));

      this.totalDistance += dist;
      let cosAlfa = (controlPoints[i+1][0] - controlPoints[i][0])/dist;
      let senAlfa = (controlPoints[i+1][1] - controlPoints[i][1])/dist;
      let alfa = Math.acos(cosAlfa);
      values.push(animationVelocity * cosAlfa, animationVelocity * senAlfa, alfa);
      this.initValues.push(values);
    }
    this.totalTime = this.totalDistance / animationVelocity;
    this.transformMatrix = mat4.create();
    this.time = 0;
  }

   getTransformMatrix(time) {
    mat4.identity(this.transformMatrix);
    if(this.currentAnimation < this.controlPoints.length - 1){
      let dx = time * this.initValues[this.currentAnimation][0];
      let dy = time * this.initValues[this.currentAnimation][1];

      console.log("dx: "+ dx +  "-" + "CPx: " + this.controlPoints[this.currentAnimation+1][0]);
      console.log("idx " + this.currentAnimation);
      if (dx > this.controlPoints[this.currentAnimation+1][0] && dy > this.controlPoints[this.currentAnimation+1][1]) // currentAnimation has ended
        this.currentAnimation++;

      mat4.identity(this.transformMatrix);
      mat4.translate(this.transformMatrix, this.transformMatrix, [dx, dy, 0]);
      mat4.translate(this.transformMatrix, this.transformMatrix,
         [this.controlPoints[this.currentAnimation][0], this.controlPoints[this.currentAnimation][1], 0]);

      mat4.rotate(this.transformMatrix, this.transformMatrix, Math.acos(this.initValues[this.currentAnimation][2]), [0, 1, 0]);
      // this.transformMatrix.translate(this.controlPoints[this.currentAnimation][0],this.controlPoints[this.currentAnimation][1],0);
      // this.transformMatrix.rotate(Math.acos(this.initValues[this.currentAnimation][3]), 0, 1, 0);
    }
    else
      this.animationEnd = true;

    return this.transformMatrix;
  }

}
