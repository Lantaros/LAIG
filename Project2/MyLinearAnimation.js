
class LinearAnimation extends Animation{
  constructor(scene, id, animationVelocity, controlPoints){
    super(scene, id, animationVelocity, controlPoints);

    this.initValues = new Array();
    this.currentAnimation = 0;
    for (let i = 0; i < controlPoints.length; i++){
      let values = new Array();
      let dist = Math.sqrt(
        (controlPoints[i+1][0] - controlPoints[i][0])*(controlPoints[i+1][0] - controlPoints[i][0]) +
        (controlPoints[i+1][1] - controlPoints[i][1])*(controlPoints[i+1][1] - controlPoints[i][1]) +
        (controlPoints[i+1][2] - controlPoints[i][2])*(controlPoints[i+1][2] - controlPoints[i][2]));
      let cosAlfa = (controlPoints[i+1][0] - controlPoints[i][0])/dist;
      let senAlfa = (controlPoints[i+1][1] - controlPoints[i][1])/dist;
      let alfa = Math.acos(cosAlfa);
      values.push([animationVelocity * cosAlfa, animationVelocity * senAlfa, alfa]);
      initValues.push(values);
    }

    this.transformMatrix = mat4.create();
    this.time = 0;
  }

   update(dt) {
    if(this.currentAnimation < this.controlPoints.length - 1){
      this.time += dt;
      let dx = this.time * this.initValues[this.currentAnimation][0];
      let dy = this.time * this.initValues[this.currentAnimation][1];
      if (dx == this.controlPoints[this.currentAnimation][0] &&  dy == this.controlPoints[this.currentAnimation][1]) // currentAnimation has ended
        this.currentAnimation++;

    mat4.identity(this.transformMatrix);
    this.transformMatrix.translate(dx,dy,0);
    this.transformMatrix.translate(this.controlPoints[this.currentAnimation][0],this.controlPoints[this.currentAnimation][1],0);
    this.transformMatrix.rotate(Math.acos(this.initValues[this.currentAnimation][3]), 0, 1, 0);
    }
  }


}
