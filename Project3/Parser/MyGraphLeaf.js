/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @param       graph  graph's reference
 * @param       leafID leaf's unique ID
 * @param       type   leaf  primitive type
 * @param       args   primitive's arguments array
 * @constructor
 */
function MyGraphLeaf(graph, leafID, type, args) {

	this.graph = graph;
	this.id = leafID;
	this.type = type;
	this.args = args;
	this.selected = false;
	this.obj = null;

	switch(this.type) {
            case 'rectangle':
             this.obj =  new MyRectangle(this.graph.scene, this.args);
            break;

            case 'sphere':
            this.obj = new MySphere(this.graph.scene, this.args);
            break;

            case 'cylinder':
             this.obj = new MyCylinder(this.graph.scene, this.args);
            break;

            case 'triangle':
             this.obj = new MyTriangle(this.graph.scene, this.args);
            break;

            case 'patch':
             this.obj = new MyPatch(this.graph.scene, this.args);
            break;

						case 'halfsphere':
             this.obj = new MyHalfSphere(this.graph.scene, this.args);
            break;

						case 'boardcell':
             this.obj = new MyBoardCell(this.graph.scene, this.args);
            break;
        }
};
/**
 * Displays the object
 */
MyGraphLeaf.prototype.display = function() {
	this.obj.display();
};

/**
 * Updates the Texture Coordinates
 * @param sFactor The S Factor
 * @param tFactor The T Factor
 */
MyGraphLeaf.prototype.updateTexCoords = function(sFactor, tFactor) {
    this.obj.updateTexCoords(sFactor, tFactor);
};
