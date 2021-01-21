// According to SO this is supposed to be fast
function makeRec(len, acc) {
  if (acc == null) acc = [];
  if (len <= 1) return acc;
  var b = makeRec(len >> 1, [0]);
  b = b.concat(b);
  if (len & 1) b = b.concat([0]);
  return b;
}

export default class ComponentManager {
    constructor(){      
      this._components = {
        all: [],
        get lager(){
          let lager = [];
          this.all.forEach((element, index) => {
            if(element.name == 'Festlager' || element.name == 'Loslager')
              lager.push(element)
          });
          return lager
        }
      }

      this._componentCount = 0;
      this._transformationMatrix = null;
      this.knoten = {
        array : [],
        transformationMatrix : null,
        add : function(vector){
          this.array.push(vector)
        },
        get knotenMatrix(){
          let array = new Array(this.array.length*2);        
          var j = 0;
          for(let i = 0; i < this.array.length; i++){
            let new_point = this.transformationMatrix.inverseTransform(this.array[i].position) 
            array[j]   =  new_point.x  
            array[j+1] =  new_point.y
            j+=2
          }
          return array
        }
      }
      this.lagerHandler = {
        knotenMatrix : null,       //ugly
        components: null,
        get lagerVector(){
          var array = [];
          //let array = makeRec(this.components.lager.length)
          this.components.lager.forEach( (element, index) => {
            array.push(index)
          });
          return array
        }
      }
      // Bindings
      this.lagerHandler.knotenMatrix = this.knoten.knotenMatrix
      this.lagerHandler.components = this._components
    }

    set components(components){
      this._components.all = components;
    }
    
    get components(){
      return this._components.all
    }

    set lager(lager){
      this._components.lager = lager
    }

    get lager(){
      return this._components.lager
    }

    set componentCount(componentCount){
      this._componentCount = componentCount;
    }

    get componentCount(){     // For vue to detect changes, make a getter functon!!!
      return this.components.length
    }

    set transformationMatrix(transformationMatrix){
      this._transformationMatrix = transformationMatrix;
      this.knoten.transformationMatrix=transformationMatrix
    }

    get transformationMatrix() {
      return this._transformationMatrix;
    }
    
    addFachwerk(vectorGroup, startPoint, endPoint){
      let fachwerk =  new Fachwerk(vectorGroup)
      this.components.push(fachwerk)
      this.knoten.add(fachwerk.vectorGroup.children['handle0'])
      this.knoten.add(fachwerk.vectorGroup.children['handle1'])

      console.log(this.knoten.knotenMatrix)
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
      // DONT FORGET TO DESTROY INCOMING GROUP
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
      var knoten = [this.vectorGroup.children['handle0'].position.x, 
                    this.vectorGroup.children['handle0'].position.y,
                    this.vectorGroup.children['handle1'].position.x,
                    this.vectorGroup.children['handle1'].position.y];
      return knoten
    }

    getElementKnoten_viewport_coords(){
      var knoten = [this.vectorGroup.children['handle0'].position.x, 
                    this.vectorGroup.children['handle0'].position.y,
                    this.vectorGroup.children['handle1'].position.x,
                    this.vectorGroup.children['handle1'].position.y];
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
