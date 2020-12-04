<!-- TODO: Update content when canvas is resized -->
<template>
  <canvas id="canvasId"/>
  <MouseCoordinates :cx="this.mouseCoordinates[0]" :cy="this.mouseCoordinates[1]"/>
</template> 

<script>
import ToolManager from './tools/ToolManager'
import MouseCoordinates from './MouseCoordinates.vue'

export default{
  name: "Canvas",
  data() {
    return{
      scope: null,
      previewLine: null,
      mouseMovedText: null,
      mouseCoordinates: [null,null],
      canvasToolObject: null,
      paperInstance: require('paper'),
      toolManager: null
    }
  },
  methods: {
    reset() {
      this.scope.project.activeLayer.removeChildren();
    },
    updateCoords(){
      this.mouseCoordinates = [event.pageX ,event.pageY];
    }
  },
  mounted() {
    // Create a new scope
    this.scope = new this.paperInstance.PaperScope();   // Since we are working with JavaScript, the PaperScope needs to be manually created
                                                        // Paper classes can only be accessed through PaperScope Objects
                                                        // It is possible to access the global paper variable, but im not sure if it works with vue.
    
    // Setup scope
    this.scope.setup(document.getElementById("canvasId"));      // Sets up a empty project. A canvas ID can be passed, in this case, a View is created for it
    this.scope.activate();

    // Create new ToolManager
    this.toolManager = new ToolManager(this.paperInstance);

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
          this.toolManager.currentActiveTool = this.toolManager.selectionTool;
          break;
        case "festlager":
          this.toolManager.currentActiveTool = this.toolManager.selectionTool;
          break;
        case "feder":
          this.toolManager.currentActiveTool = this.toolManager.selectionTool;
          break;
        case "boden":
          this.toolManager.currentActiveTool = this.toolManager.selectionTool;
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
  background-color: rgb(255, 255, 255);
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>