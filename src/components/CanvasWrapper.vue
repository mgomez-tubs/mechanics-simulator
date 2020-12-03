<!-- TODO: Update content when canvas is resized -->
<template>
  <canvas id="canvasId"/>
  <MouseCoordinates :cx="this.mouseCoordinates[0]" :cy="this.mouseCoordinates[1]"/>
</template> 

<script>
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
      this.tool = new paper.Tool();
  }

  static detachToolHandlers(){    // there has to be a prettier way . . .
    console.log("Detaching previous event handlers")
    console.log(['mouseDown','mouseDrag','mouseUp'])
    this.tool.off("mousedown");   
    this.tool.off("mousedrag");
    this.tool.off("mouseup");
    this.tool.off("mousemove");
  }
}

// Selection Tool
class SelectionTool{
    report(){
        console.log("Selection Tool, not ready :)")
    }
}
  

// Fachwerk creation tool
class FachwerkCreateTool extends Tool{
    constructor(){
      super();
      this.cursor = null;
      this.fachwerkStart_preview  = null;
      this.fachwerkEnd_preview    = null;
      this.line_preview = null;
      this.mouseWasDragged = false;
    }

    report(){
        // Create PaperJS Objects
        this.cursor                 =   this.fachwerkCircleCreate([0,0]);
        this.fachwerkStart_preview  =   this.fachwerkCircleCreate([0,0]);     // Preview of the starting circle
        this.defaultPosition        =   [-1,-1]
        this.fachwerkEnd_preview    =   this.fachwerkCircleCreate(this.defaultPosition);     // Preview of the ending circle
        this.line_preview           =   this.linePathCreate([0,0],[0,0]);

        // Set dotted lines for preview graphics
        this.line_preview.dashArray = [10,12];
        this.fachwerkStart_preview.dashArray = [5,5];
        this.fachwerkEnd_preview.dashArray = [5,5]; 

        // Hide previews
        this.fachwerkStart_preview.visible = false;
        this.fachwerkEnd_preview.visible = false;
        this.line_preview.visible = false;

        // Start mouse event handler
        this.mouseEventsHandler();
    }

    linePathCreate(start, end){
        return new paper.Path.Line({
        from: start,
        to: end,
        strokeColor: "yellow",
        strokeJoin: 'round',
        strokeWidth: 1.5,
        })
    }

    fachwerkCircleCreate(p){
          return new paper.Path.Circle({            
            center: p,
            radius: 10,  
            strokeColor: 'yellow'})
    }

    mouseEventsHandler(){
        console.log("mouseDown() of Tool A was called");
        Tool.tool.onMouseMove = (event) => {            // On mouse move
        this.cursor.position = event.point;
        }

        Tool.tool.onMouseDown = (event) => {              // On mouse down
        // Set the preview start circle to the mouse position
        this.fachwerkStart_preview.position = event.point;
        this.fachwerkEnd_preview.position = event.point;
        // Reset the preview line
        this.line_preview.segments[0].point = event.point;
        this.line_preview.segments[1].point = event.point;
        };

        Tool.tool.onMouseDrag = (event) => {              // On mouse dragged
        this.mouseWasDragged = true;
        // While the mouse is dragging, hide the cursor
        this.cursor.visible = false

        // Only show previews, while the mouse is down
        
        this.fachwerkStart_preview.visible = true;
        this.fachwerkEnd_preview.visible = true;
        this.line_preview.visible = true;

        // Replace the ending point of the line created at onMouseDown() with the current mouse location
        this.line_preview.segments[1].point = event.point;
        this.fachwerkEnd_preview.position = event.point;
        };

        Tool.tool.onMouseUp = (event) => {                // On mouse up
        
        // Move the cursor to the new position
        this.cursor.position = event.point;

        // Show the cursor again
        this.cursor.visible = true;

        // Hide the previews
        this.fachwerkStart_preview.visible = false;
        this.fachwerkEnd_preview.visible = false;
        this.line_preview.visible = false;

        // Create a new Fachwerk object
        if(this.mouseWasDragged === true){
          this.fw = new Fachwerk(this.fachwerkStart_preview.position, this.fachwerkEnd_preview.position)
          this.resetTool();
        }
        };
    }
    resetTool(){
      this.fachwerkStart_preview.position = [-1,-1];
      this.fachwerkEnd_preview.position = [-1,-1];
      this.mouseWasDragged = false;
    }
}

// Fachwerk class

class Fachwerk{
  constructor(startPosition, endPosition){
    this.startPosition = startPosition
    ;
    this.endPosition = endPosition;
    this.draw();
  }

  draw(){    
    // Line
    this.line = new paper.Path.Line({
      from: this.startPosition,
      to: this.endPosition,
      strokeColor: 'black'
    });
    this.line.strokeWidth = 3.5;
    
    // Starting Circle
    this.startCircle = new paper.Path.Circle({
      strokeColor: 'black',
      center:this.startPosition,
      radius: 5
    });
    this.startCircle.strokeWidth = 1.5;
    this.startCircle.fillColor = "white";

    // End Circle
    this.endCircle = new paper.Path.Circle({
      strokeColor: 'black',
      center: this.endPosition,
      radius: 5
    });
    this.endCircle.strokeWidth = 1.5;
    this.endCircle.fillColor = "white";
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
const lineTool = new FachwerkCreateTool;
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
        mouseCoordinates: [null,null]
      }
    },
    props : {   // Dont forget to declare received Objects as props!!!
      currentTool: String
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
          case "boden":
            console.log("Boden");
            th.tool = selectionTool;
            break;
        }
        // Start mouse event handler
        this.mouseEventHandler();
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

      Tool.scope.activate();

      // Create PaperJS Tool
      Tool.createTool();

      // Set up default tool
      th.tool = selectionTool;
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
