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
        //this.componentCount+=1
      }
     addFestlager(position, raster){
        this.components.push(new Festlager(position, raster))
        console.log(this.components.length)
        //this.componentCount+=1
    }
     addLoslager(position, raster){
        this.components.push(new Loslager(position, raster))
        //this.componentCount+=1
      }
    
    removeAllElements(){
        for(let i = this.components.length; i>0; i--){
          this.components[i-1].remove();
          this.components.pop();
          console.log(this.components)  
        }
    }
  }

  class Fachwerk{
    constructor(vectorGroup){
      // Receive Values
      this.vectorGroup = vectorGroup;
    }

    remove(){
        console.log("Remove Fachwerk")
        this.vectorGroup.remove();
    }   
  }

  class Festlager {                             // Raster group + vector group?
    constructor(position, raster){
      this.position = position;
      this.raster = raster.clone();
      console.log("Loslager created")
    }
    remove(){
        // Remove Raster
        console.log("Remove Raster of Festlager")
        this.raster.remove();
    }  
  }

  class Loslager {
    constructor(position, raster){
      this.position = position;
      this.raster = raster.clone();
      console.log("Loslager created")
    }
    remove(){
        // Remove Raster
        console.log("Remove Raster of Loslager")
        this.raster.remove();
    } 
  }