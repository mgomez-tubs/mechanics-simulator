// Make paper a global variable
var paper = null;

export default class ComponentManager {
    constructor(paperInstance){
      // empty constructor
      paper = paperInstance;
      console.log("this happeeds")
      this._fachwerke_arr = [];
      this._festlager_arr = [];
      this._loslager_arr = [];
    }
    // Static Fields 
    
    // Static Methods
    
     addFachwerk(startPosition, endPosition){
        this._fachwerke_arr.push(new Fachwerk(startPosition, endPosition))
    }
     addFestlager(position, raster){
        this._festlager_arr.push(new Festlager(position, raster))
    }
     addLoslager(position, raster){
        this._loslager_arr.push(new LosLager(position, raster))
    }
    
    removeAllElements(){
      // First remove from canvas
        this._fachwerke_arr.forEach(function(value, index, array){
            value.remove();
        })
        this._festlager_arr.forEach(function(value, index, array){
            value.remove();
        })
        this._loslager_arr.forEach(function(value, index, array){
            value.remove();
        })
      // Then empty array
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