export default class ComponentManager {
    constructor(){
      // empty constructor
      this._fachwerke_arr = new Array();
      this._festlager_arr = new Array();
      this._loslager_arr = new Array();
    }
  
    addFachhwerk(o){
      this._fachwerke_arr.push(o)
    }
    addFestlager(o){
      this._festlager_arr.push(o)
    }
    addLoslager(o){
      this._loslager_arr.push(o)
    }
    removeAllElements(){
      // First remove from canvas
        this._fachwerke_arr.forEach(function(value, index, array){
          value.remove();
        })
      // Then empty array
    }
  }