/**
 * A Animation that is used by others except Combo
 */
class Animation{
  /**
   * Constructs an Animation
   * @param scene The Scene of the World
   * @param id Animation ID
   * @param animationVelocity Animation Velocity
   * @param controlPoints Animation Control Points
   */
  constructor(scene, id, animationVelocity, controlPoints){
      this.scene = scene;
      this.id = id;
      this.animationVelocity = animationVelocity;
      this.controlPoints = controlPoints;
      this.animationEnd = false;
      this.totalTime = 0;
      this.secTimes = new Array();
  }

/**
 * Returns the Total Time for the Animation
 * @return Returns the total time
 */
 getTotalTime(){
   return this.totalTime;
 }

}
