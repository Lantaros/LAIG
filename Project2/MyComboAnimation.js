
class ComboAnimation{
  constructor(id, scene, animationIDs){
  this.id = id;
  this.scene = scene;
  this.currAnimation = 0;
  this.animationIDs = animationIDs;
  }

   update(dt) {
    if(this.currAnimation < this.animationIDs.length)
      this.scene.animations[this.currAnimation].update(dt);
  }
}
