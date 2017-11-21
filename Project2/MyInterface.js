 /**
 * MyInterface class, creating a GUI interface.
 * @constructor
 */
function MyInterface() {
    //call CGFinterface constructor
    CGFinterface.call(this);
}
;

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * Initializes the interface.
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
    // call CGFinterface init
    CGFinterface.prototype.init.call(this, application);

    // init GUI. For more information on the methods, check:
    //  http://workshop.chromeexperiments.com/examples/gui

    this.gui = new dat.GUI();

    // add a group of controls (and open/expand by defult)


    return true;
};

/**
 * Adds a folder containing the IDs of the lights passed as parameter.
 */
MyInterface.prototype.addLightsGroup = function(lights) {

    var group = this.gui.addFolder("Lights");
    group.open();

    // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
    // e.g. this.option1=true; this.option2=false;

    for (var key in lights) {
        if (lights.hasOwnProperty(key)) {
            this.scene.lightValues[key] = lights[key][0];
            group.add(this.scene.lightValues, key);
        }
    }

MyInterface.prototype.addNodesDropDown = function(nodes) {

  /*for (let i = 0; i < nodes.size(); i++)
    if (nodes[i].selectable){
        this.guy.add(this.scene, 'SelectableNodes'), {nodes[i].nodeID: i,
            }).name('Selected Node');
    }

    gui.add(text, 'speed', {
      for (let i = 0; i < nodes.size(); i++)
        if (nodes[i].selectable){
          node[i].nodeID: i
        }
      } );

  /*  for (var node in nodes) {
      if (node.selectable){
            this.guy.add(this.scene, 'SelectableNodes'), {node.nodeID: }
        }
    }

  this.gui.add(this.scene, 'SelectableNodes', {
       'Flat Shading': 0,
       'Passing a scale as uniform': 1,
       'Passing a varying parameter from VS -> FS': 2,
       'Simple texturing': 3,
       'Multiple textures in the FS': 4,
       'Multiple textures in VS and FS': 5,
       'Sepia': 6,
       'Convolution': 7

  /*   */


  obj=this;
  this.gui.add(this.scene, 'wireframe').onChange(function(v)
    { obj.scene.updateWireframe(v)	});


}
