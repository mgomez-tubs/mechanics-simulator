<!-- TODO: Update content when canvas is resized -->
<template>
  <canvas id="canvasId" v-on:mousedown="mouseDownHandler">
  </canvas>  
</template> 

<script>
//import { tool } from 'paper/dist/paper-core';
  const paper = require('paper');

  class ToolHandler{
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

class Tool {
  constructor(){
    // Empty constructor
  }
  static scope = null;
  static tool = null;

  static set scope(scope){
    this.scope = scope;
  }

  static set tool(tool){
    this.tool = tool;
  }

  /* 
    Static Functions
  */

  static createTool() {
      console.log("createTool() was called")
      this.scope.activate();
      this.tool = new paper.Tool();
  }

  static detachToolHandlers(){
    console.log("Detached event handlers")
    console.log(['mouseDown','mouseDrag','mouseUp'])
    this.tool.off("mousedown");   // there has to be a prettier way . . .
    this.tool.off("mousedrag");
    this.tool.off("mouseup");
  }
}

// Selection Tool
class SelectionTool{
    report(){
        console.log("Selection Tool, not ready :)")
    }
}
    

// Stab Tool
class ToolA extends Tool{
    constructor(){
      super();
    }
    report(){
        console.log("Tool A :)")
        this.mouseDown();
    }

    set scope(scope){
        this._scope = scope;
        Tool.scope = scope;
    }

    linePathCreate(start, end){
        Tool.scope.activate();
        return new paper.Path.Line({
        from: start,
        to: end,
        strokeColor: "#FF4400",
        strokeJoin: 'round',
        strokeWidth: 1.5
        })
    }

    mouseDown(){
        console.log("mouseDown() of Tool A was called");

        

        Tool.tool.onMouseDown = (event) => {            // On mouse down      
        // init path
        this.previewLine = this.linePathCreate(event.point, event.point);
        };

        Tool.tool.onMouseDrag = (event) => {            // On mouse dragged
        // Replace the ending point of the line created at onMouseDown() with the current mouse location
        this.previewLine.segments[1].point = event.point;
        };

        Tool.tool.onMouseUp = (event) => {              // On mouse up
        this.previewLine.segments[1].point = event.point;
        };
    }
}
/*
class ToolB {
    report(){
        console.log("Tool B :)")
    }
}
*/

// Entering forbidden territory. . .
const th = new ToolHandler();
const lineTool = new ToolA;
const selectionTool = new SelectionTool;
//const balkenTool = new ToolB;

  export default{
    name: "Canvas",
    data() {
      return{
        line: null,
        scope: null,
        previewLine: null
      }
    },
    props : {
        currentTool: String
    },
    methods: {
      reset() {
        this.scope.project.activeLayer.removeChildren();
      },
      mouseDownHandler(){
        console.log("Handle Mouse Down")
        th.exec();
      },
    },
    watch: {
      // Watch for changes of the current tool
      currentTool : function(val){
        Tool.detachToolHandlers();
        console.log("The value ofthe currentTool has been changed!, now is " + val);
        switch(val){
          case "select":
            th.tool = selectionTool;
            console.log("Selection tool");
            break;
          case "stab":
            console.log("Stab");
            th.tool = lineTool;
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
        }
      }
    },
    mounted() {
      console.log("Mounting canvas...")
      this.scope = new paper.PaperScope();  // Since we are working with JavaScript, the PaperScope needs to be manually created
                                            // Paper classes can only be accessed through PaperScope Objects
                                            // It is possible to access the global paper variable, but im not sure if it works with vue.
      
      this.scope.setup(document.getElementById("canvasId"));      // Sets up a empty project. A canvas ID can be passed, in this case, a View is created for it
      console.log("Current tool is: " + this.currentTool)

      /* TODO: Hierarchy system for tools */
      // Set up scopes
      Tool.scope = this.scope
      //lineTool.scope = this.scope

      // Create PaperJS Tool
      Tool.createTool();

      // Set up default tool
      th.tool = selectionTool;
      
    }
  }
</script>   
<style scoped>
  #canvasId{
  background-color: rgb(54, 54, 54);
  width: 100%;
  height: 100%;
}
</style>
