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

    set scope(scope){
        this._scope = scope
    } 

    get tool(){
        return this._tool
    }
    exec() {
        this._tool.report();
    }
}

// Stab Tool
class ToolA {
    constructor(){
      
    }
    report(){
        console.log("Tool A :)")
        this.mouseDown(this._scope);
    }

    set scope(scope){
        this._scope = scope
    } 

    createTool() {
        console.log("createTool() was called")
        this._scope.activate();
        return new paper.Tool();
    }

    linePathCreate(start, end){
        this._scope.activate();
        return new paper.Path.Line({
        from: start,
        to: end,
        strokeColor: "#FF4400",
        strokeJoin: 'round',
        strokeWidth: 1.5
        })
    }

    mouseDown(){
        console.log("mouseDown() was called");

        // Create Tool
        this.tool = this.createTool();

        this.tool.onMouseDown = (event) => {            // On mouse down      
        // init path
        this.previewLine = this.linePathCreate(event.point, event.point);
        };

        this.tool.onMouseDrag = (event) => {            // On mouse dragged
        // Replace the ending point of the line created at onMouseDown() with the current mouse location
        this.previewLine.segments[1].point = event.point;
        };

        this.tool.onMouseUp = (event) => {              // On mouse up
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
        console.log("The value ofthe currentTool has been changed!, now is " + val)
      }
    },
    mounted() {
      console.log("Mounting canvas...")
      this.scope = new paper.PaperScope();  // Since we are working with JavaScript, the PaperScope needs to be manually created
                                            // Paper classes can only be accessed through PaperScope Objects
                                            // It is possible to access the global paper variable, but im not sure if it works with vue.
      
      this.scope.setup(document.getElementById("canvasId"));      // Sets up a empty project. A canvas ID can be passed, in this case, a View is created for it
      console.log("Current tool is: " + this.currentTool)


      // Set up scope
      lineTool.scope = this.scope

      // Set up current tool
      th.tool = lineTool;
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
