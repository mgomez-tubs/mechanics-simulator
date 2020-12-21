export default class ComponentManager {
    constructor(){      
      this._components = []
      this._componentCount = 0;
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
  }

  class MechanicComponent {
    constructor(name, vectorGroup){
      this._name = name;
      this.vectorGroup = vectorGroup
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
  }

  class Fachwerk extends MechanicComponent{
    constructor(vectorGroup){
      super("Fachwerk", vectorGroup);
      // Receive Values
      this.vectorGroup = vectorGroup;
      console.log(this.vectorGroup.children['handle0'])
      this.vectorGroup.children['handle1'].data.parentComponent = this
      this.vectorGroup.children['handle0'].data.parentComponent = this
      this.vectorGroup.data.parentComponent = this;
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
  }

  class Loslager extends MechanicComponent{
    constructor(vectorGroup){
      super("Loslager", vectorGroup);
      this.vectorGroup = vectorGroup
      this.vectorGroup.data.parentComponent = this;
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
