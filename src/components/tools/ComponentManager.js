// According to SO this is supposed to be the fastest way of creating 0-filled arrays
function makeRec(len, acc) {
	if (acc == null) acc = [];
	if (len <= 1) return acc;
	var b = makeRec(len >> 1, [0]);
	b = b.concat(b);
	if (len & 1) b = b.concat([0]);
	return b;
}

function Knoten(paperJSpoint,knotenNummer){
	this.paperJSpoint = paperJSpoint
	this.knotenNummer = knotenNummer
}
Knoten.prototype = {
	get position(){
		return [this.paperJSpoint._owner.position.x,this.paperJSpoint._owner.position.y]
	},
	set position(point){
		this.position = point
	}
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

			// Build Knoten Prototype
			this.KnotenFactory = {
				transformationMatrix: null,
				addKnoten(point){
					adder:{
						for(const element of this.knotenList){
							if(element.position[0] == point.x && element.position[1] == point.y){
								console.log("WONT BE ADDING THIS ONE!")
								break adder
							}
						}
						this.counter++;
						this.knotenList.push(new Knoten(point,this.counter))
					}
				},
				knotenList : [],
				get knotenMatrixAsArray(){					
					var array = Array(this.knotenList.length)
					var j = 0;
					for(let i = 0; i < this.knotenList.length; i++){
						array[j]   =  this.knotenList[i].position[0]
						array[j+1] =  this.knotenList[i].position[1]
						j+=2
					}
					return array
				},
				get knotenMatrixAsArray_viewport_coords(){
					var array = Array(this.knotenList.length)
					var j = 0;

					console.log(this.transformationMatrix)
					for(let i = 0; i < this.knotenList.length; i++){
						array[j]   =  this.transformationMatrix.inverseTransform(this.knotenList[i].position[0]).x
						array[j+1] =  this.transformationMatrix.inverseTransform(this.knotenList[i].position[1]).y
						j+=2
					}
					return array
				},
				counter: 0
			}   
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
			this.knoten.transformationMatrix=transformationMatrix;
			this.KnotenFactory.transformationMatrix = transformationMatrix 
		}

		get transformationMatrix() {
			return this._transformationMatrix;
		}
		
		addFachwerk(vectorGroup){
			var fachwerk =  new Fachwerk(vectorGroup)
			this.components.push(fachwerk)

			this.KnotenFactory.addKnoten(fachwerk.startKnoten)
			this.KnotenFactory.addKnoten(fachwerk.endKnoten)
		}
		addFestlager(vectorGroup){
			var festlager = new Festlager(vectorGroup)
			this.components.push(festlager)
			this.KnotenFactory.addKnoten(festlager.position)
		}
		addLoslager(vectorGroup){
			var loslager = new Loslager(vectorGroup)
			this.components.push(loslager)
			this.KnotenFactory.addKnoten(loslager.position)
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
		
		this.reposition = this.repositionComponent
	}

	set startKnoten(point){
		this.vectorGroup.children['handle0'].position = point;
	}

	get startKnoten(){
		console.log("Called Startknoten")
		return this.vectorGroup.children['handle0'].position;
	}

	set endKnoten(point){
		this.vectorGroup.children['handle1'].position = point;
	}

	get endKnoten(){
		console.log("Called Endknoten")
		return this.vectorGroup.children['handle1'].position;
	}

	setActivePivot(pivot){
		if(pivot == "handle0"){
			this.reposition = this.repositionHandle0
		} else if(pivot == "handle1"){
			this.reposition = this.repositionHandle1
		} else {
			console.log("This message should not appear!")
			this.reposition = this.repositionComponent
		}
	}

	repositionComponent(point){
		//console.log("Helow loe low")
	}
	
	repositionHandle0(point){
		this.startKnoten = point
		this.vectorGroup.children['line'].segments[0].point = point
	}

	repositionHandle1(point){
		this.endKnoten = point
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
	constructor(vectorGroup, knoten){
		super("Loslager", vectorGroup);
		this.vectorGroup = vectorGroup;

		super.hitboxes = {
			vectorGroup: this.vectorGroup,
			parentComponent: this,
			type: "center"
		}

		this.raster = this.vectorGroup.rasterize();
		this.raster.visible = false
		console.log("Loslager created")
	}
	
	set knotenPosition(point){
		this.vectorGroup.position = point;
	}

	get knotenPosition(){
		return this.vectorGroup.position
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
