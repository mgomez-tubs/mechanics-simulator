// Make paper a global variable
var paper = null;

export default class ComponentManager {
    constructor(paperInstance){
      // empty constructor
      paper = paperInstance;

      this._components = {
        fachwerke:  [],
        festlager:  [],
        loslager:   []
      };
    }

    set components(components){
      components = this._components
    }
    
    get components(){
      return this._components
    }
    
    // Static Methods
    
     addFachwerk(startPosition, endPosition){
        this.components.fachwerke.push(new Fachwerk(startPosition, endPosition))
    }
     addFestlager(position, raster){
        this.components.festlager.push(new Festlager(position, raster))
    }
     addLoslager(position, raster){
        this.components.loslager.push(new LosLager(position, raster))
    }
    
    removeAllElements(){
      // First remove from canvas
        for(let i = this.components.fachwerke.length; i>0; i--){
          this.components.fachwerke[i-1].remove();
          this.components.fachwerke.pop();
        }

        for(let i = this.components.festlager.length; i>0; i--){
          this.components.festlager[i-1].remove();
          this.components.festlager.pop();
        }

        for(let i = this.components.loslager.length; i>0; i--){
          this.components.loslager[i-1].remove();
          this.components.loslager.pop();
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
      console.log("LosLager created")
    }
    remove(){
        // Remove Raster
        console.log("Remove Raster of Festlager")
        this.raster.remove();
    }  
  }

  class LosLager {
    constructor(position, raster){
      this.position = position;
      this.raster = raster.clone();
      console.log("LosLager created")
    }
    remove(){
        // Remove Raster
        console.log("Remove Raster of Loslager")
        this.raster.remove();
    } 
  }