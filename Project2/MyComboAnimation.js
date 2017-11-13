
class ComboAnimation{
  constructor(id, scene, animationIDs){
  this.id = id;
  this.scene = scene;
  this.currAnimation = 0;
  this.animationIDs = animationIDs;
  }

  ComboAnimation.prototype.update = function(dt) {
    if(this.currAnimation < this.animationIDs.length)
      this.scene.animations[this.currAnimation].update(dt);
  }
}
