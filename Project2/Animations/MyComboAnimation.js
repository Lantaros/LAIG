
class ComboAnimation{
  constructor(scene, id, animationRefs){

    this.scene = scene;
    this.id = id;
    this.animationRefs = animationRefs;
    this.animationMatrix = mat4.create();
    mat4.identity(this.animationMatrix);
    this.currentSection = 0;//Used in Linear and Combo Animations
    this.secTimes = new Array();
    this.totalTime = 0;
    let time = 0;
    for(let i = 0; i <this.animationRefs.length; i++){
      time = this.scene.animations[this.animationRefs[i]].getTotalTime();
      this.totalTime += time;
      this.secTimes.push(time);
    }

  }

  getTransformMatrix(time, combIte, section) {
    alert('here');
    let combSecTime = time;

    for(let i = 0; i < section; i++)
      combSecTime -= this.secTimes[i];
    if (combIte < this.animationRefs.length){
      return  this.graph.scene.animations[this.animationRefs[this.currAnimation]].getTransformMatrix(time, combIte, this.currentSection);
      if(time >= this.graph.scene.animations[this.animationRefs[this.currAnimation]].getTotalTime()){
        this.currentSection = 0;
        combIte++;
        }
       else if (time >= this.graph.scene.animations[this.animationRefs[this.currAnimation]].secTimes[this.currentSection])
          this.currentSection++;
      }
  }
}
