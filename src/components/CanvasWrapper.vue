<!-- TODO: Update content when canvas is resized -->
<template>
  <canvas id="canvasId"/>
  <MouseCoordinates :cx="this.mouseCoordinates[0]" :cy="this.mouseCoordinates[1]"/>
</template> 

<script>
const paper = require('paper');
class ToolSwitcher{
  constructor(){
      this._currentActiveTool = null;
  }
  set currentActiveTool(tool){
      this._currentActiveTool = tool
      this._currentActiveTool.enable()
      //this._currentActiveTool.report();
  }

  get currentActiveTool(){
      return this._currentActiveTool
  }
}

// Parent Tool class
import {Tool} from './tools/ToolCatalog'
import {ToolManager} from './tools/ToolCatalog'

// Entering forbidden territory. . .
const toolSwitcher = new ToolSwitcher();

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
      this.scope = new paper.PaperScope();  // Since we are working with JavaScript, the PaperScope needs to be manually created
                                            // Paper classes can only be accessed through PaperScope Objects
                                            // It is possible to access the global paper variable, but im not sure if it works with vue.
      
      // Setup scope
      this.scope.setup(document.getElementById("canvasId"));      // Sets up a empty project. A canvas ID can be passed, in this case, a View is created for it
      this.scope.activate();

      // Create new ToolManager
      this.toolManager = new ToolManager(this.paperInstance, this.scope);

      // Set up scopes
      Tool.scope = this.scope

      // Set up default tool
      toolSwitcher.currentActiveTool = this.toolManager.selectionTool;

      // Set up emitters
      this.toolbarEvents.on("userClickedOnTool", id => {
        switch(id){
          case "select":
            toolSwitcher.currentActiveTool = this.toolManager.selectionTool;
            break;
          case "stab":
            toolSwitcher.currentActiveTool = this.toolManager.drawFachwerkTool;
            break;
          case "loslager":
            toolSwitcher.currentActiveTool = this.toolManager.selectionTool;
            break;
          case "festlager":
            toolSwitcher.currentActiveTool = this.toolManager.selectionTool;
            break;
          case "feder":
            toolSwitcher.currentActiveTool = this.toolManager.selectionTool;
            break;
          case "boden":
            toolSwitcher.currentActiveTool = this.toolManager.selectionTool;
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