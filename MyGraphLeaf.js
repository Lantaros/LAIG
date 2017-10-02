/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
**/

function MyGraphLeaf(graph, leafInfo) {

	this.graph = graph;

	if (leafInfo.attributes.length == 3){ //id, type and args
		this.id = leafInfo.attributes.item(0).value;		
		this.type = leafInfo.attributes.item(1).value;	
		this.args = leafInfo.attributes.item(2).value;	
	}
	else {
		this.type = leafInfo.attributes.item(0).value;	
		this.args = leafInfo.attributes.item(1).value;	
	}


	switch(this.type) {
        case 'rectangle':
		graph.scene.primitives[nodeID + " " + type] = new MyRectangle(graph.scene, args);
        break;

        case 'sphere':
        graph.scene.primitives[nodeID + " " + type] = new MyLamp(graph.scene, args);
        break;  

        case 'cylinder':
        graph.scene.primitives[nodeID + " " + type] = new MyCylinder(graph.scene, args);
        break;

        case 'triangle':
        graph.scene.primitives[nodeID + " " + type] = new MyTriangle(graph.scene, args);
        break;  
    }


}

