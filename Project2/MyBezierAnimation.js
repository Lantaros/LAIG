
class BezierAnimation extends Animation{
  constructor(scene, id, animationVelocity, controlPoints){
    super(scene, id, animationVelocity, controlPoints);

    this.bezierPoints = new Array();
    this.points = new Array();
    this.secTimes = new Array();

    this.totalDistance = 0;
    for(let i = 0; i < 4; i++)
      this.bezierPoints.push(vec3.fromValues(controlPoints[i][0], controlPoints[i][1], controlPoints[i][2]));


    this.totalDistance = this.casteljau(1);

    this.totalTime = this.totalDistance / animationVelocity;
    this.transformMatrix = mat4.create();
    this.time = 0;
  }

  casteljau(nIterations){
  /*  let castelPoints = new Array();
    for(let i = 0; i < nIterations; i++){
      for(let j = 0; j < 6*(i+1);j++){
        castelPoints.splice(j+0, 0, bezierPoints[]);
        castelPoints[j+0] =
      }
    }*/

    let p12 = vec3.create();
    vec3.sub(p12, this.bezierPoints[1],this.bezierPoints[0]);
    vec3.scale(p12, p12, 0.5);

    let p23 = vec3.create();
    vec3.sub(p23, this.bezierPoints[2],this.bezierPoints[1]);
    vec3.scale(p23, p23, 0.5);

    let p34 = vec3.create();
    vec3.sub(p34, this.bezierPoints[3],this.bezierPoints[2]);
    vec3.scale(p34, p34, 0.5);

    let p123 = vec3.create();
    vec3.sub(p123, p23, p12);
    vec3.scale(p123, p123, 0.5);

    let p234 = vec3.create();
    vec3.sub(p234, p34, p23);
    vec3.scale(p234, p123, 0.5);

    let pM = vec3.create();
    vec3.sub(p123, p234, p123);
    vec3.scale(pM, pM, 0.5);

    return vec3.distance(p12, this.bezierPoints[0]) +
           vec3.distance(p12, p123) +
           vec3.distance(p123, p234) +
           vec3.distance(p234, p34) +
           vec3.distance(p34, this.bezierPoints[3]);

  }

getTransformMatrix(time, section) {

     mat4.identity(this.transformMatrix);
     if(section < this.points.length - 1){

       let dx = Math.pow(1-time,3) * this.bezierPoints[0][0] + 3*time*Math.pow(1-time,2) * this.bezierPoints[1][0] + 3*time*time*(1-time)* this.bezierPoints[2][0] + Math.pow(time,3)* this.bezierPoints[3][0];
       let dy = Math.pow(1-time,3) * this.bezierPoints[0][1] + 3*time*Math.pow(1-time,2) * this.bezierPoints[1][1] + 3*time*time*(1-time)* this.bezierPoints[2][1] + Math.pow(time,3)* this.bezierPoints[3][1];
       let dz = Math.pow(1-time,3) * this.bezierPoints[0][2] + 3*time*Math.pow(1-time,2) * this.bezierPoints[1][2] + 3*time*time*(1-time)* this.bezierPoints[2][2] + Math.pow(time,3)* this.bezierPoints[3][2];

      let xAng = 3 * this.p4[0] * time * time
       - 3 * this.bezierPoints[2][0] * time * time
       + 6 * this.bezierPoints[2][0] * (1 - time) * time
       - 6 * this.bezierPoints[1][0] * (1 - time) * time
       + 3 * this.bezierPoints[1][0] * Math.pow(1 - time, 2)
       - 3 * this.bezierPoints[0][0] * Math.pow(1 - time, 2);

      let zAng = 3 * this.p4[2] * time * time
       - 3 * this.bezierPoints[2][2] * time * time
       + 6 * this.bezierPoints[2][2] * (1 - time) * time
       - 6 * this.bezierPoints[1][2] * (1 - time) * time
       + 3 * this.bezierPoints[1][2] * Math.pow(1 - time, 2)
       - 3 * this.bezierPoints[0][2] * Math.pow(1 - time, 2);

       let ang = -Math.atan2(xAng, zAng);

       mat4.identity(this.transformMatrix);
       mat4.translate(this.transformMatrix, this.transformMatrix, [dx, dy, dz]);
       mat4.rotate(this.transformMatrix, this.transformMatrix, ang , [0, 1, 0]);

       console.log("Section Bez" + section);
    //   mat4.rotate(this.transformMatrix, this.transformMatrix, Math.acos(this.points[section][3]), [0, 1, 0]);
     }
     else
       this.animationEnd = true;

     return this.transformMatrix;
  }

}
