/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
**/

function MyGraphLeaf(graph, leafInfo) {

	this.graph = graph;
	this.obj = null;

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
        }

	
}

MyGraphLeaf.prototype.display = function() {  
    
	this.obj.display();
}

