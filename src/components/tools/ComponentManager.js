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
    
    // Static Methods
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
    constructor(name){
      this._name = name;
    }
    get name(){
      return this._name;
    }
    set name(name){
      this._name = name;
    }
  }

  class Fachwerk extends MechanicComponent{
    constructor(vectorGroup){
      super("Fachwerk");
      // Receive Values
      this.vectorGroup = vectorGroup;
      this.vectorGroup.data.parentComponent = this;
    }
    remove(){
        console.log("Removed raster of Fachwerk")
        this.vectorGroup.remove();
    }   
  }

  class Loslager extends MechanicComponent{
    constructor(vectorGroup){
      super("Loslager");
      this.vectorGroup = vectorGroup
      this.vectorGroup.data.parentComponent = this;
      this.position = this.vectorGroup.position;
      this.raster = this.vectorGroup.rasterize();
      this.raster.visible = false
      console.log("Loslager created")
    }
    remove(){
        // Remove Raster
        console.log("Remove Raster of Loslager")
        this.raster.remove();
    } 
  }

  class Festlager extends MechanicComponent {                             // Raster group + vector group?
    constructor(vectorGroup){
      super("Festlager");
      this.vectorGroup = vectorGroup
      this.vectorGroup.data.parentComponent = this;
      this.position = this.vectorGroup.position;
      this.raster = this.vectorGroup.rasterize();
      this.raster.visible = false   // Lets work with the vectors only, for now!
      console.log("Festlager created")
    }
    remove(){
        // Remove Raster
        console.log("Removed raster of Festlager")
        this.raster.remove();
    }  
  }
