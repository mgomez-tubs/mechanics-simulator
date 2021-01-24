var paper = null;   // this is terrible and i admit it, but i want paper to be global

export default class ToolManager {
  constructor(paperInstance, componentManager, componentEditionEvents){
    paper = paperInstance;
    this._currentActiveTool = null;
    this.componentManager = componentManager;
    ToolManager.componentEditionEvents = componentEditionEvents;
    
    // Before creating anything, set up Tool static variables
    Tool.scope = paperInstance;
    Tool.gridMatrix = paperInstance.project.layers['grid-layer'].matrix
    //Tool.componentManager = componentManager
    // Create a Layer for the user content and deactivate it
    Tool.userContentLayer = new paper.Layer({
      name: "user-content-layer"
    });
    
    // Create a Layer for the Tools
    this.toolsLayer = new paper.Layer({
      name: "tools-layer"
    });

    // Activate toolsLayer
    this.toolsLayer.activate();

    // Define tools
    this._kraftTool         = new KraftTool(this.componentManager)
    this._drawFachwerkTool  = new FachwerkCreateTool(this.componentManager);
    this._drawLosLagerTool  = new LosLagerCreateTool(this.componentManager);
    this._drawFestLagerTool = new FestLagerCreateTool(this.componentManager);
    this._selectionTool     = new SelectionTool(this.componentManager);

    // Define starting Tool (skipping setter)
    this._currentActiveTool = this._selectionTool
  }

  set currentActiveTool(tool){
    this._currentActiveTool.disable()
    this._currentActiveTool = tool
    this._currentActiveTool.enable()
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
  get drawLosLagerTool(){
    return this._drawLosLagerTool;
  }
  get drawFestLagerTool(){
    return this._drawFestLagerTool;
  }
  get kraftTool(){
    return this._kraftTool;
  }
}

class Tool {   // scope and tool can be in the constrcutor. consider adding 
  constructor(){
    // Empty constructor
    this.gridSize = 1;
  }

  static _scope = null;
  static set scope(scope){
    this._scope = scope;
  }
  static get scope(){
    return this._scope;
  }

  static _gridMatrix = null;
  static set gridMatrix(gridMatrix){
    this._gridMatrix = gridMatrix;
  }
  static get gridMatrix(){
    return this._gridMatrix;
  }

  static _componentManager = null;
  static set componentManager(componentManager){
    this._componentManager = componentManager;
  }
  static get componentManager(){
    return this._componentManager;
  }

  static _userContentLayer = null;
  static set userContentLayer(userContentLayer){
    this._userContentLayer = userContentLayer;
  }
  static get userContentLayer(){
    return this._userContentLayer;
  }

  getPointInSimulationCoordinates(point){
    return Tool.gridMatrix.inverseTransform(point);
  }

  snapToGrid(point) {
    var translated_point = Tool.gridMatrix.inverseTransform(point)
    // Upscale
    var new_point = translated_point.multiply(this.gridSize)
    // Round
    new_point = new_point.round()
    // Downscale
    new_point = new_point.divide(this.gridSize)
    return Tool.gridMatrix.transform(new_point)
  }  

  disable(){
    console.log("Nothing to do for this tool.")
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
  constructor(componentManager){
    super();
    this.tool = new paper.Tool();
    this.componentManager = componentManager
    this.selectSquare = null
    this.setUpPaperJSObjects();
    this.configurePaperJSToolMouseEvents();

    this.singleClickSelection = true;

    this.selectedObjects = [];
    this.selectPointsArray = [];
    this.singleComponentHeldOnMousedown = false;

    // Dont touch this
    this.options = {
      class: paper.Group,
      position: true,
      tolerance: 10
    }
  }

  enable(){
    //console.log("selectionTool: enable() called");
    this.tool.activate();
  }

  disable(){
    this.deselectEverything();
  }

  setUpPaperJSObjects(){
    // Selection Square
    this.selectSquare = new paper.Path.Rectangle({
      from: new paper.Point(-1,-1),
      to: new paper.Point(-1,-1),
      strokeColor: "#1a42cc",
      fillColor: new paper.Color(0.4,0.8,1,0.8),
      visible: false
    })
  }
  configurePaperJSToolMouseEvents(){  
    this.tool.onMouseDown = (event) => {
      // Deselect everything
      this.deselectEverything();
      // Test if a hitbox is found
        let hitResult = Tool.userContentLayer.hitTest(event.point, this.options);
        // If something is found --> Drag
        if(hitResult !== null){
          this.singleComponentHeldOnMousedown = true;
          this.selectedObjects.push(hitResult)
          hitResult.item.selected = true;
          if(hitResult.item.name == 'handle0' || hitResult.item.name == 'handle1'){       /* Result is a Knoten */
            // If a In- or Out Handle are found, set up mechanic component accordingly
            hitResult.item.data.parentComponent.setActivePivot(hitResult.item.name)
          }
        } else {    // No element selected
          this.singleClickSelection = true;
          this.selectSquare.segments[0].point = event.point;      // Top Left
          this.selectSquare.segments[1].point = event.point;      // Bottom Left
          this.selectSquare.segments[2].point = event.point;      // Bottom Right
          this.selectSquare.segments[3].point = event.point;      // Top Right
          this.selectSquare.visible = true;
      }
    }
    this.tool.onMouseDrag = (event) => {
      // Since we are dragging, this isnt a single click selection anymore
      this.singleClickSelection = false

      if(this.singleComponentHeldOnMousedown){      // Component was held on mousedown
        // Reposition the component or handle
        if(this.selectedObjects[0].item.data.parentComponent!==undefined){
          this.selectedObjects[0].item.data.parentComponent.reposition(super.snapToGrid(event.point))
        } else {
          console.log("The correspoding Mechanic Component of this group couldn't be found!")
        }
      } else {                                      // No Component held on mousedown           
        // Relcalculate Path of the selection rectangle
        // Point 2
        this.selectSquare.segments[2].point   = event.point
        // Point 1
        this.selectSquare.segments[1].point.x = this.selectSquare.segments[0].point.x
        this.selectSquare.segments[1].point.y = this.selectSquare.segments[2].point.y
        // Point 3
        this.selectSquare.segments[3].point.x = this.selectSquare.segments[2].point.x
        this.selectSquare.segments[3].point.y = this.selectSquare.segments[0].point.y
      }

      /*
          Double click selection: Retrieve points
      */

      /*
      // Sides to test will be Bottom and Right      
      // Get array of points

      // Calculate change in direction

      var transformed_point_bottomleft  = super.snapToGrid(this.selectSquare.segments[1].point)
      var transformed_point_bottomright = super.snapToGrid(this.selectSquare.segments[2].point)
      var transformed_point_topright    = super.snapToGrid(this.selectSquare.segments[3].point)
      

      var arraytoprove = {
        x: [],
        y: []
      }     

      if(transformed_point_bottomright.x - transformed_point_bottomleft.x >0){
        let l = transformed_point_bottomleft.x;
        do{
          arraytoprove.x.push(l)
          arraytoprove.y.push(transformed_point_bottomright.y)
          l+=40
        }while(l<=transformed_point_bottomright.x)
      } else {
        let l = transformed_point_bottomright.x;
        do{
          arraytoprove.x.push(l)
          arraytoprove.y.push(transformed_point_bottomright.y)
          l+=40
        }while(l<=transformed_point_bottomleft.x)
      }

      if(transformed_point_topright.y - transformed_point_bottomright.y >0){
        let l = transformed_point_bottomright.y;
        do{
          arraytoprove.x.push(transformed_point_topright.x)
          arraytoprove.y.push(l)
          l+=40
        }while(l<=transformed_point_topright.y)
      } else {
        let l = transformed_point_topright.y;
        do{
          arraytoprove.x.push(transformed_point_topright.x)
          arraytoprove.y.push(l)
          l+=40
        }while(l<=transformed_point_bottomright.y)
      }

      console.log(arraytoprove)
      */


    }
    this.tool.onMouseUp   = (event) => {
      /*
          Single click selection:   mouse up
      */
     this.singleComponentHeldOnMousedown = false
      if(this.singleClickSelection){
        // Don't do anything at mouseup ... for now
      } 
      /*
          Double click selection:   mouse up
      */
      else {
        //this.deselectEverything();
      }
      //console.log("Selected objects after mouse up: " + this.selectedObjects.length)
      //console.log(this.selectedObjects)

      // Hide the selection square
      this.selectSquare.visible = false
    } 
  }

  deselectEverything(){
    this.selectedObjects.forEach(hitResult => {
      hitResult.item.selected = false;
      this.selectedObjects = []
    })
  }
}

// Fachwerk creation tool
class FachwerkCreateTool extends Tool{
  constructor(componentManager){
    super();
    this.componentManager = componentManager;
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
      this.cursor.visible = false;
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
        radius: 5,
        strokeWidth: 1,
        strokeColor: 'brown'})
  }
  configurePaperJSToolMouseEvents(){

      this.tool.onMouseMove = (event) => {
        this.cursor.position = super.snapToGrid(event.point);
      }

      this.tool.onMouseDown = (event) => {              // On mouse down
        var point = super.snapToGrid(event.point)
        // Set the preview start circle to the mouse position
        this.fachwerkStart_preview.position =   point;
        this.fachwerkEnd_preview.position   =   point;
        // Reset the preview line
        this.line_preview.segments[0].point =   point;
        this.line_preview.segments[1].point =   point;
      };

      this.tool.onMouseDrag = (event) => {              // On mouse dragged
        var point = super.snapToGrid(event.point)
        this.mouseWasDragged = true;
        // While the mouse is dragging, hide the cursor
        this.cursor.visible = false

        // Only show previews, while the mouse is down
        this.fachwerkStart_preview.visible = true;
        this.fachwerkEnd_preview.visible = true;
        this.line_preview.visible = true;

        // Replace the ending point of the line created at onMouseDown() with the current mouse location
        this.line_preview.segments[1].point = point;
        this.fachwerkEnd_preview.position = point;
      };

      this.tool.onMouseUp = (event) => {                // On mouse up
        // Move the cursor to the new position
        //this.cursor.position = event.point;

        // Show the cursor again
        this.cursor.visible = true;

        // Hide the previews
        this.fachwerkStart_preview.visible = false;
        this.fachwerkEnd_preview.visible = false;
        this.line_preview.visible = false;

        // Create a new Fachwerk object
        if(this.mouseWasDragged === true){
          //console.log("Created a new fachwerk object")

          // Create a PaperJS group
          // First create groups for the handles
          var handle0 = new paper.Group(
            new paper.Path.Circle({
              strokeColor: 'black',
              center:this.fachwerkStart_preview.position,
              radius: 5,
              fillColor: "white",
              strokeWidth: 1.5
            }),
          )
          handle0.name = 'handle0'

          var handle1 = new paper.Group(
            new paper.Path.Circle({
              strokeColor: 'black',
              center:this.fachwerkEnd_preview.position,
              radius: 5,
              fillColor: "white",
              strokeWidth: 1.5
            }),
          )
          handle1.name = 'handle1'

          var group = new paper.Group([
            new paper.Path.Line({
              name: "line",
              from: this.fachwerkStart_preview.position,
              to:   this.fachwerkEnd_preview.position,
              strokeColor: 'black',
              strokeWidth: 3.5
            }),
            handle0,
            handle1
          ])
          
          this.componentManager.addFachwerk(Tool.userContentLayer.addChild(group))
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
    //console.log("FachwerkTool: enable() called")
    this.cursor.visible = true;
    this.tool.activate();
  }
  disable(){
    this.cursor.visible = false
  }
}

// Loslager creation Tool
class LosLagerCreateTool extends Tool{
  constructor(componentManager){
    super();
    this.componentManager = componentManager;
    this.tool = new paper.Tool();
    this.color = "blue"
    this.cursor = null

    // Create a group with the vectorized Festlager
    this.losLagerGroup = new paper.Group();

    // Middle Triangle
    this.midtriangle = new paper.Path.RegularPolygon({
      center: [0,-2.5],
      radius: 10,
      sides: 3,
      strokeColor: "black",
      strokeWidth: 1.5,
      fillColor: "white",
      rotation: 180
    })
    this.losLagerGroup.addChild(this.midtriangle);

    // Upper Circle
    this.uppercircle = new paper.Path.Circle({
      center: [0,0],
      radius : 5,
      strokeWidth: 1.5,
      strokeColor: "black",
      fillColor:"white"
    })
    this.losLagerGroup.addChild(this.uppercircle);

    // Lower line
    this.lowerline = new paper.Path.Line({
      from:[-10, -17.5],
      to: [10, -17.5],
      strokeWidth: 1.5,
      strokeColor: "black"
    })
    this.losLagerGroup.addChild(this.lowerline);

    //Lower Diagonal Line
    this.lowerline_diag = new paper.Path.Line({
      from:[-8.5, -22.5],
      to: [-5, -18.5],
      strokeWidth: 1,
      strokeColor: "black"
    })
    this.losLagerGroup.addChild(this.lowerline_diag);

    for(let i = 0; i < 5 ; i ++){
      let lowerline_copy = this.lowerline_diag.clone();
      lowerline_copy.position.x+=3.4*i
      this.losLagerGroup.addChild(lowerline_copy);
    }

    this.losLagerGroup.style = { // dark mode is in mind
      strokeColor : this.color
    };

    // Place a transparent rectangle in the group, so the middle is aliged
    this.losLagerGroup.addChild(
      new paper.Path.Rectangle({
        from: [-25,-25],
        to:   [ 25, 25]
      })
    )
    
    // Build the cursor from the vectorGroup
    this.cursor =  this.losLagerGroup.rasterize(95);

    // Hide raster until tool is enabled
    this.cursor.visible = false;
    // Remove the festLagerGroup from the project
    this.losLagerGroup.remove();

    // Configure Events
    this.configurePaperJSToolMouseEvents();
  }
  enable(){
    console.log("LoslagerCreateTool : enable() called")
    this.cursor.visible = true
    this.tool.activate();
  }
  disable(){
    this.tool.visible = false
  }
  configurePaperJSToolMouseEvents(){
    this.tool.onMouseMove = (event) => {
        var point = super.snapToGrid(event.point)
        this.cursor.position = point;
    }
    this.tool.onMouseDown = (event) => {
      var groupToExport = this.losLagerGroup.clone()
      groupToExport.position = super.snapToGrid(event.point)
      this.componentManager.addLoslager(Tool.userContentLayer.addChild(groupToExport))
    }
  }
}

// Festlager creation Tool
class FestLagerCreateTool extends Tool{
  constructor(componentManager){
    super();
    this.componentManager = componentManager
    this.tool   = new paper.Tool();
    this.color  = "black"
    this.cursor = null

    // Create a group with the vectorized Festlager
    this.festLagerGroup = new paper.Group();

    // Middle Triangle
    this.midtriangle = new paper.Path.RegularPolygon({
      center: [0,-2.5],
      radius: 10,
      sides: 3,
      strokeColor: "black",
      strokeWidth: 1.5,
      fillColor: "white",
      rotation: 180
    })
    this.festLagerGroup.addChild(this.midtriangle);

    // Upper Circle
    this.uppercircle = new paper.Path.Circle({
      center: [0,0],
      radius : 5,
      strokeWidth: 1.5,
      strokeColor: "black",
      fillColor:"white"
    })
    this.festLagerGroup.addChild(this.uppercircle);

    // Lower Diagonal Line
    this.lowerline_diag = new paper.Path.Line({
      from:[-8.5, -17,5],
      to: [-5, -12.5],
      strokeWidth: 1,
      strokeColor: "black"
    })
    this.festLagerGroup.addChild(this.lowerline_diag);

    // A Loop for the rest of the Lines
    for(let i = 0; i < 5 ; i ++){
      let lowerline_copy = this.lowerline_diag.clone();
      lowerline_copy.position.x+=3.4*i
      this.festLagerGroup.addChild(lowerline_copy);
    }

    this.festLagerGroup.style = { // dark mode is in mind
      strokeColor : this.color
    };

    // Place a transparent rectangle in the group, so the middle is aliged
    this.festLagerGroup.addChild(
      new paper.Path.Rectangle({
        from: [-25,-25],
        to:   [ 25, 25]
      })
    )
    
    // Build the cursor from the vectorGroup
    this.cursor =  this.festLagerGroup.rasterize(95);

    // Hide cursor until tool is enabled
    this.cursor.visible = false;
    // Remove the festLagerGroup from the project
    this.festLagerGroup.remove();   // This does only remove it from the project, but we can reuse it if we clone it!
    
    // Configure Events
    this.configurePaperJSToolMouseEvents();
  }

  enable(){
    console.log("FestlagerCreateTool : enable() called")
    // Display raster
    this.cursor.visible = true
    this.tool.activate();
  }

  disable(){
    // Hide raster
    this.cursor.visible = false
  }

  configurePaperJSToolMouseEvents(){
    this.tool.onMouseMove = (event) => {
      var point = super.snapToGrid(event.point)
      this.cursor.position = point;
    }
    this.tool.onMouseDown = (event) => {
      // Clone the template group, place it on the current mouse position and
      // send it to the component
      var groupToExport = this.festLagerGroup.clone()
      groupToExport.position = super.snapToGrid(event.point)
      this.componentManager.addFestlager(Tool.userContentLayer.addChild(groupToExport))
    }
  }
}

class KraftTool extends Tool{
  constructor(componentManager){
    super();
    this.componentManager = componentManager
    this.tool = new paper.Tool();
    this.color = "black"
    this.cursor = null;
    this.creatingByDragging = false;

    this.targetKnoten = null;
    
    this.options = {
      class: paper.Group,
      position: true,
      tolerance: 10
    }
    
    this.kraftGroup = new paper.Group(
      new paper.PointText({   //0
        point: [10, 10],
        content: 'F',
        fillColor: this.color,
        fontFamily: 'Heuristica-Regular',
        fontWeight: 'bold',
        fontSize: 15
      }),
      new paper.Path.Line({        //1
        from: [0,0],
        to: [10,0],
        strokeWidth: 2,
        strokeColor: "black"
      })
      )

      this.vectorArrow = new paper.Path({
        strokeColor: "black",
        strokeWidth: 2
      });

      this.kraftGroup.addChild(this.vectorArrow)

      this.kraftGroup.scale(1,-1)
      this.kraftGroup.scale(2)
/*
    this.kraftGroup.addChild(
      new paper.Path.Rectangle({
        from: [-25,-25],
        to:   [ 25, 25]
      })
    )*/

    // Build the cursor
    this.cursor = null

    // Hide the tool
    this.kraftGroup.visible = false

    //

    // Remove the group
    //this.kraftGroup.remove();

    this.assignedKnoten = null;

    this.configurePaperJSToolMouseEvents();
  }

  enable(){
    console.log("KraftTool enabled")
    //this.cursor.visible = true
    this.tool.activate();
  }

  disable(){
    //this.cursor.visible = false
  }

  configurePaperJSToolMouseEvents(){
    this.tool.onMouseDown = (event) => {    // You can only add Forces at handlers of Fachwerke, which arent a Lager 
      //this.creatingByDragging = true;
      let hit = Tool.userContentLayer.hitTest(event.point, this.options)
      
      if(hit){
        if(hit.item.data.type == "handle"){ // TODO: Shouldnt be possible to place forces at lager
          console.log("Handle found")
          console.log(hit.item.data.assignedKnoten)
          this.assignedKnoten = hit.item.data.assignedKnoten
          this.kraftGroup.children[1].segments[0].point = super.snapToGrid(event.point);
          this.creatingByDragging = true;
        }
      }
    }

    this.tool.onMouseDrag = (event) => {
      if(this.creatingByDragging){
        // Enable the tool
        this.kraftGroup.visible = true
        
        this.kraftGroup.children[1].segments[1].point = super.snapToGrid(event.point);
        
        var originPoint =   this.kraftGroup.children[1].segments[0].point.clone();
        var endingPoint =   this.kraftGroup.children[1].segments[1].point.clone();
        var normalizedVector = originPoint.subtract(endingPoint).normalize(15)

        this.vectorArrow.segments = [
          originPoint.add(normalizedVector.rotate(-160)),
          originPoint,
          originPoint.add(normalizedVector.rotate(160)),
        ]        

        this.kraftGroup.children[0].position = super.snapToGrid(event.point)
        var newpos = this.kraftGroup.children[0].position.add(new paper.Point(-20,0))
        this.kraftGroup.children[0].position = newpos
      }
    }

    this.tool.onMouseUp = (event) => {
      if(this.creatingByDragging){
        // Clone the Force Group
        let groupToExport = this.kraftGroup.clone();
        // Reset the tool
        this.kraftGroup.visible = false
        this.creatingByDragging = false;


        
        let force = this.componentManager.addKraft(Tool.userContentLayer.addChild(groupToExport), this.assignedKnoten)
        
        console.log("force!")
        console.log(force)

        var editionBundle = {
          component: "Force",
          object: force
        }
        // Show Force Editor Screen
        ToolManager.componentEditionEvents.emit("StartComponentEdition", editionBundle)

        // Clear assigned knoten
        this.assignedKnoten = null
      }
    }
  }
}