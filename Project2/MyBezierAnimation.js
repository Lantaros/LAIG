
class BezierAnimation extends Animation{
  constructor(scene, id, animationVelocity, controlPoints){
    super(scene, id, animationVelocity, controlPoints);

    this.initValues = new Array();
    this.totalDistance = 0;
    this.p1 = controlPoints[0];
    this.p2 = controlPoints[1];
    this.p3 = controlPoints[2];
    this.p4 = controlPoints[3];


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

  bezier(pts) {
  	return function (t) {
  		for (var a = pts; a.length > 1; a = b)  // do..while loop in disguise
  			for (var i = 0, b = [], j; i < a.length - 1; i++)  // cycle over control points
  				for (b[i] = [], j = 0; j < a[i].length; j++)  // cycle over dimensions
  					b[i][j] = a[i][j] * (1 - t) + a[i+1][j] * t;  // interpolation
  		return a[0];
  	}
  }

}
