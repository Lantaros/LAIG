
class Animation{
  constructor(scene, id, animationVelocity, controlPoints){
      this.scene = scene;
      this.id = id;
      this.animationVelocity = animationVelocity;
      this.controlPoints = controlPoints;
  }


  Animation.prototype.update = function(dt) {
  }
}
