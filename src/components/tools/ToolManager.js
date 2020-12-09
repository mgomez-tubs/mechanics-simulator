var paper = null;   // this is terrible and i admit it, but i want paper to be global

export default class ToolManager {
  constructor(paperInstance){
    paper = paperInstance;
    this._currentActiveTool = null;

    // Define Tools
    this._selectionTool = new SelectionTool;
    this._drawFachwerkTool = new FachwerkCreateTool;
  }

  set currentActiveTool(tool){
    this._currentActiveTool = tool
    this._currentActiveTool.enable()
    //this._currentActiveTool.report();
  }

  // Tool getters
  get currentActiveTool(){
      return this._currentActiveTool
  }
  
  get selectionTool(){
    return this._selectionTool;
  }

  get drawFachwerkTool(){
    return this._drawFachwerkTool;
  }
}

class Tool {   // scope and tool can be in the constrcutor. consider adding 
  constructor(){
    // Empty constructor
  }
  static scope = null;

  static set scope(scope){
    this.scope = scope;
  }
/*
  static detachToolHandlers(){    // there has to be a prettier way . . .
    console.log("Detaching previous event handlers")
    console.log(['mouseDown','mouseDrag','mouseUp'])
    this.tool.off("mousedown");   
    this.tool.off("mousedrag");
    this.tool.off("mouseup");
    this.tool.off("mousemove");
  }*/                                               // Keeping this cause ive got an idea
}

// Selection Tool
class SelectionTool extends Tool{
  constructor(){
    super();
    this.tool = new paper.Tool();
    //this.selectSquare = null;
    this.selectSquare = null
    this.setUpPaperJSObjects();
    this.configurePaperJSToolMouseEvents();
  }
  report(){
    console.log("selectionTool: report() called")
  }
  enable(){
    console.log("selectionTool: enable() called");
    this.tool.activate();
  }
  setUpPaperJSObjects(){
    // Selection Square
    this.selectSquare = new paper.Path.Rectangle({
      from: new paper.Point(-1,-1),
      to: new paper.Point(-1,-1),
      strokeColor: "#1a42cc",
      fillColor: new paper.Color(0.4,0.8,1,0.8)
  })
  }

  configurePaperJSToolMouseEvents(){  
    
    this.tool.onMouseDown = (event) => { 
      this.selectSquare.visible = true;
      this.selectSquare.segments[0].point = event.point 
      this.selectSquare.segments[1].point = event.point 
      this.selectSquare.segments[2].point = event.point 
      this.selectSquare.segments[3].point = event.point } 
      // Point 0 (arriba izquierda)

    // Point 3
    this.tool.onMouseDrag = (event) => {
      // Relcalculate Path
      // Point 2 (abajo derecha)
      this.selectSquare.segments[2].point = event.point
      // Point 1
      this.selectSquare.segments[1].point.x = this.selectSquare.segments[0].point.x
      this.selectSquare.segments[1].point.y = this.selectSquare.segments[2].point.y
      
      // Point 3
      this.selectSquare.segments[3].point.x = this.selectSquare.segments[2].point.x
      this.selectSquare.segments[3].point.y = this.selectSquare.segments[0].point.y
    }
    this.tool.onMouseUp = () => {
      this.selectSquare.visible = false
    } 
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
    this.tool = new paper.Tool();
    this.setUpPaperJSObjects();
    this.configurePaperJSToolMouseEvents();
  }

  setUpPaperJSObjects(){
      // Create PaperJS Objects
      this.cursor                 =   this.fachwerkCircleCreate([0,0]);
      this.fachwerkStart_preview  =   this.fachwerkCircleCreate([0,0]);     // Preview of the starting circle
      this.fachwerkEnd_preview    =   this.fachwerkCircleCreate([0,0]);     // Preview of the ending circle
      this.line_preview           =   this.linePathCreate([0,0],[0,0]);

      // Set dotted lines for preview graphics
      this.line_preview.dashArray = [10,12];
      this.fachwerkStart_preview.dashArray = [5,5];
      this.fachwerkEnd_preview.dashArray = [5,5]; 

      // Hide previews
      this.fachwerkStart_preview.visible = false;
      this.fachwerkEnd_preview.visible = false;
      this.line_preview.visible = false;
  }
  linePathCreate(start, end){
      return new paper.Path.Line({
      from: start,
      to: end,
      strokeColor: "brown",
      strokeJoin: 'round',
      strokeWidth: 1.5})
  }
  fachwerkCircleCreate(p){
      return new paper.Path.Circle({            
        center: p,
        radius: 0.1,
        strokeWidth: 1,
        strokeColor: 'brown'})
  }
  configurePaperJSToolMouseEvents(){
      this.tool.onMouseMove = (event) => {              // On mouse move
      this.cursor.position = event.point;
      }

      this.tool.onMouseDown = (event) => {              // On mouse down
        // Set the preview start circle to the mouse position
        this.fachwerkStart_preview.position = event.point;
        this.fachwerkEnd_preview.position = event.point;
        // Reset the preview line
        this.line_preview.segments[0].point = event.point;
        this.line_preview.segments[1].point = event.point;
      };

      this.tool.onMouseDrag = (event) => {              // On mouse dragged
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

      this.tool.onMouseUp = (event) => {                // On mouse up
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
  enable(){
    console.log("FachwerkTool: enable() called")
    this.tool.activate();
  }
}

class Fachwerk{
  constructor(startPosition, endPosition){
    this.startPosition = startPosition;
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
      radius: 0.1
    });
    this.startCircle.strokeWidth = 1.5;
    this.startCircle.fillColor = "white";

    // End Circle
    this.endCircle = new paper.Path.Circle({
      strokeColor: 'black',
      center: this.endPosition,
      radius: 0.1
    });
    this.endCircle.strokeWidth = 1.5;
    this.endCircle.fillColor = "white";
  }
}