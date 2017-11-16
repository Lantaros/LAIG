/**
 * MyGraphNode class, representing an intermediate node in the scene graph.
 * @constructor
**/

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

    this.animationRefs = new Array();
    this.currAnimation = 0;
    this.animationMatix = mat4.create();
    mat4.identity(this.animationMatix);
    this.time = 0;

    this.transformMatrix = mat4.create();
    mat4.identity(this.transformMatrix);
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

MyGraphNode.prototype.updateAnimationMatrix = function(dt){
  this.time += dt/1000;
    if (this.currAnimation < this.animationRefs.length){
      this.animationMatix =  this.graph.scene.animations[this.animationRefs[this.currAnimation]].getTransformMatrix(this.time);
      if(this.time >= this.graph.scene.animations[this.animationRefs[this.currAnimation]].getTotalTime()){
        this.time = 0;
        this.currAnimation++;
      }
    }
}
