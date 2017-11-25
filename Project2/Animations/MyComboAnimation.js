
class ComboAnimation{
  constructor(scene, id, animationRefs){

    this.scene = scene;
    this.id = id;
    this.animationRefs = animationRefs;
    this.animationMatrix = mat4.create();
    mat4.identity(this.animationMatrix);
    //this.currentSection = 0;//Used in Linear and Combo Animations
    this.secTimes = new Array();
    this.totalTime = 0;
    let time = 0;

    for(let i = 0; i <this.animationRefs.length; i++){
      time = this.scene.animations[this.animationRefs[i]].getTotalTime();
      this.totalTime += time;
      this.secTimes.push(time);
    }

  }
  getTotalTime(){
    return this.totalTime;
  }

  getTransformMatrix(time, combIte, section) {
    if(this.animationRefs[combIte] == 'testCirc')
      console.log(" ");
    let combSecTime = time;

    for(let i = 0; i < section; i++)
      combSecTime -= this.secTimes[i];

    if (combIte < this.animationRefs.length){
      mat4.identity(this.animationMatrix);
      this.animationMatrix =  this.scene.animations[this.animationRefs[combIte]].getTransformMatrix(time, combIte, section);
      if(time >= this.scene.animations[this.animationRefs[combIte]].getTotalTime()){
          section = 0;
          combIte++;
      }
      else if (time >= this.scene.animations[this.animationRefs[combIte]].secTimes[section])
          section++;
    }
    return this.animationMatrix;
  }

}
