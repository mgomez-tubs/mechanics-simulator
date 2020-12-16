<!-- TODO: Update content when canvas is resized -->
<template>
  <canvas id="canvasId" hidpi="off"/>
  <MouseCoordinates v-bind:cx="mouseCoordinateX" v-bind:cy="mouseCoordinateY"/>
</template> 

<script>
import ToolManager from './tools/ToolManager'
import MouseCoordinates from './MouseCoordinates.vue'
import Grid from './grid'

/*
  Some PaperJS info
  paper.path.Line(from, to) does put the object in the layer, but since no stroke color is defined, noting is shown!
  but paper.path.Line(Object) does!
*/

export default{
  name: "Canvas",
  data() {
    return{
      //paperScope: null,
      mouseMovedText: null,
      mouseCoordinates: [1,2],
      mouseCoordinateX: 1,
      mouseCoordinateY: 1,
      componentCount: 0,
      paperScope: null
    }
  },
  methods: {
    reset() {
      this.paperScope.project.activeLayer.removeChildren();
    },
    updateCoords(){
      this.mouseCoordinates = [1 ,2];
    }
  },

  mounted() {
    // Set up PaperJS
    /***********************************************/
    // Create a reference to the canvas object
    this.canvasElement = document.getElementById("canvasId")

    // Create a new paperScope
    this.paperScope = require('paper')
                                                        // Since we are working with JavaScript, the PaperScope needs to be manually created
                                                        // Paper classes can only be accessed through PaperScope Objects
                                                        // It is possible to access the global paper variable, but im not sure if it works with vue.
    
    // Setup paperScope
    this.paperScope.setup(this.canvasElement);          // Sets up a empty project. A canvas ID can be passed, in this case, a View is created for it
                                                        // Remember: the paperScope is a reference to the paperJS Object
    this.paperScope.activate();
    /***********************************************/

    this.paperScope.project.currentStyle.strokeScaling = false;   // Disable scaling of strokes 

    /*
      TODO : SET UP LAYERS, WILL ALSO HELP TO IMPLEMETNT DarkMODE!!
    */

    // Configure coordinates
    // Set center of the canvas to coordinate point (0,0)
    this.paperScope.view.center = [0, 0];
    this.paperScope.view.scale(1,-1)
    //this.paperScope.view.applyMatrix = false;

    // Now that everything is positionated, lets shift 
    this.paperScope.view.matrix.tx += 0.5;
    //this.paperScope.view.matrix.ty -= 0.5;

    // Set up grid
    this.grid = new Grid(this.paperScope, this.canvasElement);

    // Second Layer: Objects
    this.objectsLayer = new this.paperScope.Layer();

    // Create new ToolManager
    this.toolManager = new ToolManager(this.paperScope, this.$reactiveGlobals.componentManager);

    // Set up default tool
    this.toolManager.currentActiveTool = this.toolManager.selectionTool;

    // Set up receivers for toolbar input
    this.toolbarEvents.on("userClickedOnTool", id => {
      switch(id){
        case "select":
          this.toolManager.currentActiveTool = this.toolManager.selectionTool;
          break;
        case "stab":
          this.toolManager.currentActiveTool = this.toolManager.drawFachwerkTool;
          break;
        case "loslager":
          this.toolManager.currentActiveTool = this.toolManager.drawLosLagerTool;
          break;
        case "festlager":
          this.toolManager.currentActiveTool = this.toolManager.drawFestLagerTool;
          break;
        case "feder":
          this.toolManager.currentActiveTool = this.toolManager.selectionTool;
          break;
        case "boden":
          this.toolManager.currentActiveTool = this.toolManager.selectionTool;
          break;
        case "remove-all":
          console.log("AYAYAY");
          this.$reactiveGlobals.componentManager.removeAllElements();
          break;
      }
    });
  },  
  components : {
    MouseCoordinates
  }
}
</script>

<style scoped>
  #canvasId{
  background-color:#f5edb1;
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>