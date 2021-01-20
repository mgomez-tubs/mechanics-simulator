export default class ComponentManager {
    constructor(){      
      this._components = []
      this._componentCount = 0;
      this._transformationMatrix = null;
    }

    set components(components){
      this._components = components;
    }
    
    get components(){
      return this._components
    }

    set componentCount(componentCount){
      this._componentCount = componentCount;
    }

    get componentCount(){     // For vue to detect changes, make a getter functon!!!
      return this.components.length
    }

    set transformationMatrix(transformationMatrix){
      console.log("This was set")
      this._transformationMatrix = transformationMatrix;
    }

    get transformationMatrix() {
      return this._transformationMatrix;
    }
    
    addFachwerk(startPosition, endPosition){
      this.components.push(new Fachwerk(startPosition, endPosition))
    }
    addFestlager(position, raster){
      this.components.push(new Festlager(position, raster))
    }
    addLoslager(position, raster){
      this.components.push(new Loslager(position, raster))
    }
    
    removeAllElements(){
      for(let i = this.components.length; i>0; i--){
        this.components[i-1].remove();
        this.components.pop();
        console.log(this.components)  
      }
    }

    getSimulationData(){
      // Build Knoten Matrix
      var data = [];
        for(let i = 0; i < this.componentCount; i++)
          var transformedKnoten = this.components[i].getElementKnoten();
          data.push(this.transformationMatrix.inverseTransform(transformedKnoten))
      return data;
    }
  }

  class MechanicComponent {
    constructor(name, vectorGroup){
      this._name = name;
      this.parentVectorGroup = vectorGroup
      this._hitboxProperties = null
    }
    get name(){
      return this._name;
    }
    set name(name){
      this._name = name;
    }

    reposition(point){
      this.vectorGroup.position = point
    }

    set hitboxes(properties){

      if(Array.isArray(properties)){
        console.log(properties)
        properties.forEach(element => {
          element.vectorGroup.data.parentComponent  = element.parentComponent
          element.vectorGroup.data.type             = element.type
        })
      } else {
        properties.vectorGroup.data.parentComponent = properties.parentComponent
        properties.vectorGroup.data.type            = properties.type
      }
    }

    get hitboxes(){
      return this._properties
    }
  }

  class Fachwerk extends MechanicComponent{
    constructor(vectorGroup){
      super("Fachwerk", vectorGroup);
      // Receive Values
      this.vectorGroup = vectorGroup;

      super.hitboxes = 
        [
          {
            vectorGroup: this.vectorGroup,
            parentComponent: this,
            type: "center"
          },
          {
            vectorGroup: vectorGroup.children['handle0'],
            parentComponent: this,
            type: "handle"
          },
          {
            vectorGroup: vectorGroup.children['handle1'],
            parentComponent: this,
            type: "handle"
          }
        ]

      this._reposition = this.repositionComponent
    }

    set reposition(pivot){
      if(pivot == "handle0"){
        console.log("Reposition handle 0")
        this._reposition = this.repositionHandle0
      } else if(pivot == "handle1"){
        console.log("Reposition handle 1")
        this._reposition = this.repositionHandle1
      } else {
        console.log("This message should not appear!")
        this._reposition = this.repositionComponent
      }
    }
    get reposition(){
      return this._reposition
    }

    repositionComponent(point){
      //console.log("Helow loe low")
    }
    
    repositionHandle0(point){
      this.vectorGroup.children['handle0'].position = point
      this.vectorGroup.children['line'].segments[0].point = point
    }

    repositionHandle1(point){
      this.vectorGroup.children['handle1'].position = point
      this.vectorGroup.children['line'].segments[1].point = point
    }

    remove(){
        console.log("Removed raster of Fachwerk")
        this.vectorGroup.remove();
    }   

    // Simulation related properties
    getElementKnoten(){
      var knoten = [this.vectorGroup.children['handle0'].position.x, this.vectorGroup.children['handle1'].position.y];
      return knoten
    }
  }

  class Loslager extends MechanicComponent{
    constructor(vectorGroup){
      super("Loslager", vectorGroup);
      this.vectorGroup = vectorGroup

      super.hitboxes = {
        vectorGroup: this.vectorGroup,
        parentComponent: this,
        type: "center"
      }

      this.position = this.vectorGroup.position;
      this.raster = this.vectorGroup.rasterize();
      this.raster.visible = false
      console.log("Loslager created")
    }
    remove(){
        // Remove Raster
        console.log("Removed Loslager")
        this.vectorGroup.remove();
    } 
  }

  class Festlager extends MechanicComponent {                             // Raster group + vector group?
    constructor(vectorGroup){
      super("Festlager", vectorGroup);
      this.vectorGroup = vectorGroup
      this.vectorGroup.data.parentComponent = this;
      this.position = this.vectorGroup.position;
      this.raster = this.vectorGroup.rasterize();
      this.raster.visible = false   // Lets work with the vectors only, for now!
      console.log("Festlager created")
    }
    remove(){
        // Remove Raster
        console.log("Removed Festlager")
        this.vectorGroup.remove();
    }  
  }
