
class LinearAnimation extends Animation{
  constructor(scene, id, animationVelocity, controlPoints){
    super(scene, id, animationVelocity, controlPoints);

    this.initValues = new Array();
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
      let dz = controlPoints[i+1][2] - controlPoints[i][2];
      let alfa = Math.acos(cosAlfa);
      this.secTimes.push(dist/this.animationVelocity);
      values.push(animationVelocity * cosAlfa, animationVelocity * senAlfa, dz, alfa);
      this.initValues.push(values);
    }
    this.totalTime = this.totalDistance / animationVelocity;
    this.transformMatrix = mat4.create();
  }

   getTransformMatrix(time, section) {
    let secTime = time;
    for(let i = 0; i < section; i++)
      secTime -= this.secTimes[i];


    mat4.identity(this.transformMatrix);
    if(section < this.controlPoints.length - 1){
      let dx = secTime * this.initValues[section][0];
      let dy = secTime * this.initValues[section][1];
      let dz = secTime * this.initValues[section][2];

      mat4.identity(this.transformMatrix);
      mat4.translate(this.transformMatrix, this.transformMatrix, [dx, dy, dz]);
      mat4.translate(this.transformMatrix, this.transformMatrix,
         [this.controlPoints[section][0],
         this.controlPoints[section][1],
         this.controlPoints[section][2]]);

      console.log("Section " + section);
      // console.log("a " + this.initValues[section][3]);
      mat4.rotate(this.transformMatrix, this.transformMatrix, Math.acos(this.initValues[section][3]), [0, 1, 0]);
    }
    else
      this.animationEnd = true;

    return this.transformMatrix;
  }

}
