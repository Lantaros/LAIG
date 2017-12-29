/**
 * MyGraphNode class, representing an intermediate node in the scene graph.
 * @param       graph      graph's reference
 * @param       nodeID     Unique node identifier
 * @param       selectable Selectable node boolean
 * @constructor
 */
function MyGraphNode(graph, nodeID, selectable) {
    this.graph = graph;

    this.nodeID = nodeID;

    // IDs of child nodes.
    this.children = [];

    // IDs of child nodes.
    this.leaves = [];

    // The material ID.
    this.materialID = null ;

    // The texture ID.
    this.textureID = null ;

    this.selectable = selectable;


    this.transformMatrix = mat4.create();
    mat4.identity(this.transformMatrix);

    this.animationRefs = new Array();
    this.animationMatrix = mat4.create();
    mat4.identity(this.animationMatrix);
    this.time = 0;
    this.currAnimation = 0;
    this.combIte = 0;
    this.currentSection = 0;//Used in Linear and Combo Animations

}

function MyGraphNode(node){
  if (node instanceof MyGraphNode){
    this.graph = node.graph;

    this.nodeID = node.nodeID;

    // IDs of child nodes.
    this.children = node.children.slice(0);

    // IDs of child nodes.
    this.leaves = node.leaves.slice(0);

    // The material ID.
    this.materialID = node.materialID;

    // The texture ID.
    this.textureID =  node.materialID;

    this.selectable =  node.selectable;

    mat4.copy(this.transformMatrix, node.transformMatrix);

    this.animationRefs = node.animationRefs.slice(0);

    mat4.copy(this.animationMatrix, node.animationMatrix);

    this.time = node.time;
    this.currAnimation = node.currAnimation;
    this.combIte = node.combIte;
    this.currentSection = node.currentSection;//Used in Linear and Combo Animations
  }
}

/**
 * Adds the reference (ID) of another node to this node's children array.
 */
MyGraphNode.prototype.addChild = function(nodeID) {
    this.children.push(nodeID);
}

/**
 * Adds a leaf to this node's leaves array.
 */
MyGraphNode.prototype.addLeaf = function(leaf) {
    this.leaves.push(leaf);
}

/**
 * Updates the Animation Matrix for the Node
 * @param dt Time between interrupts in miliseconds
 */
MyGraphNode.prototype.updateAnimationMatrix = function(dt){
  this.time += dt/1000; // to seconds
  let secTime = this.time;
  for(let i = 0; i < this.currentSection; i++){
    secTime -= this.graph.scene.animations[this.animationRefs[this.currAnimation]].secTimes[i];
  }
  if (this.currAnimation < this.animationRefs.length){
    this.animationMatrix =  this.graph.scene.animations[this.animationRefs[this.currAnimation]].getTransformMatrix(this, this.time, this.currentSection);
    if(this.time >= this.graph.scene.animations[this.animationRefs[this.currAnimation]].getTotalTime()){
      this.time = 0;
      this.currentSection = 0;
      this.combIte = 0;
      this.currAnimation++;
      }
     else if (secTime >= this.graph.scene.animations[this.animationRefs[this.currAnimation]].secTimes[this.currentSection]){
        if(!(this.graph.scene.animations[this.animationRefs[this.currAnimation]] instanceof ComboAnimation))
          this.currentSection++;
        }
    }
}
