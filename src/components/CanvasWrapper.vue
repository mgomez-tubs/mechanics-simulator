<!-- TODO: Update content when canvas is resized -->
<template>
  <canvas id="canvasId"/>
  <MouseCoordinates :cx="this.mouseCoordinates[0]" :cy="this.mouseCoordinates[1]"/>
</template> 

<script>
const paper = require('paper');

class ToolSwitcher{
  constructor(){
      this._tool = null;
  }
  set tool(tool){
      this._tool = tool
  }
  get tool(){
      return this._tool
  }
  exec() {
      this._tool.report();
  }
}

// Parent Tool class
import {Tool} from './tools/ToolCatalog'
import {FachwerkCreateTool} from './tools/ToolCatalog'
import {SelectionTool} from './tools/ToolCatalog'
import {ToolManager} from './tools/ToolCatalog'

// Fachwerk class
/*
class ToolB {
    report(){
        console.log("Tool B :)")
    }
}
*/

// Entering forbidden territory. . .
const th = new ToolSwitcher();
const fachwerkCreateTool = new FachwerkCreateTool;
const selectionTool = new SelectionTool;

//const balkenTool = new ToolB;

import MouseCoordinates from './MouseCoordinates.vue'

  export default{
    name: "Canvas",
    data() {
      return{
        line: null,
        scope: null,
        previewLine: null,
        mouseMovedText: null,
        mouseCoordinates: [null,null],
        canvasToolObject: null,
        paperInstance: require('paper')
      }
    },
    methods: {
      reset() {
        this.scope.project.activeLayer.removeChildren();
      },
      mouseEventHandler(){
        th.exec();
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

      // something someting
      this.canvasToolObject = new paper.Tool();

      Tool.tool = this.canvasToolObject;

      // Set up default tool
      th.tool = selectionTool;

      // Set up emitters
      this.toolbarEvents.on("userClickedOnTool", id => {
        Tool.detachToolHandlers();
          console.log(id)
          console.log("The value ofthe currentTool has been changed!, now is " + id);
        switch(id){
          case "select":
            th.tool = selectionTool;
            console.log("Selection tool");
            break;
          case "stab":
            console.log("Stab");
            th.tool = fachwerkCreateTool;
            break;
          case "loslager":
            console.log("Loslager");
            th.tool = selectionTool;
            break;
          case "festlager":
            console.log("Festlager");
            th.tool = selectionTool;
            break;
          case "feder":
            console.log("Feder");
            th.tool = selectionTool;
            break;
          case "boden":
            console.log("Boden");
            th.tool = selectionTool;
            break;
        }
        // Start mouse event handler
        this.mouseEventHandler();
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
