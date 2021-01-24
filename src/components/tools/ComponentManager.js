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
		return [this.paperJSpoint._owner.position.x, this.paperJSpoint._owner.position.y]
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
			
			this.lagerHandler = {
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
			this.lagerHandler.components = this._components

			// Simulation Data Object. Careful: some dark magic arts are to be found here
			this.SimulationData = {
				transformationMatrix: null,
				addKnoten(point){
					var new_knoten
					adder:{
						for(const element of this.knotenList){
							if(element.position[0] == point.x && element.position[1] == point.y){
								console.log("Knoten does already exist!")
								new_knoten = element
								break adder
							}
						}
						this.counter++;
						// Build Knoten
						new_knoten = new Knoten(point,this.counter)
						this.knotenList.push(new_knoten)

						// Also add an empty force array to the kraefteVectir
						//this.kraefteVector.push([0,0])
					}
					return new_knoten
				},
				addElement(startKnoten, endKnoten){
					// Assuming you can not place a Fachwerk exactly above another one
					this.elementList.push(startKnoten)
					this.elementList.push(endKnoten)

					// Since forces can only be applied to knots of truces, add empty element to forces array
				},
				addLager(type, knoten){
					if(type == "Festlager"){
						this.lagerVector.push([2,knoten])
					} else if(type == "Loslager"){
						this.lagerVector.push([1,knoten])
					} else {
						console.log("LAGER VALIDATION ERROR")
					}
				},
				addKraft(forceObject){
					this.kraefteVector.push(forceObject)
					//this.kraefteVector[knoten.knotenNummer-1] = [forceObject.comps.F_x, forceObject.comps.F_y]
					//return 0
				},
				/* KNOTEN LISTE */
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
					for(let i = 0; i < this.knotenList.length; i++){
						array[j]   =  this.transformationMatrix.inverseTransform(this.knotenList[i].position[0]).x
						array[j+1] =  this.transformationMatrix.inverseTransform(this.knotenList[i].position[1]).y
						j+=2
					}
					return array
				},

				/* ELEMENT LISTE */
				elementList: [],
				get elementListAsArray(){
					var array = Array(this.elementList.length)
					for(let i = 0; i < this.elementList.length; i++){
						array[i]   =  this.elementList[i].knotenNummer
					}
					return array
				},

				/* LAGER LISTE */
				lagerVector: [],
				get lagerVectorAsArray(){
					var array = []
					for(let i = 0; i < this.lagerVector.length; i++){
						if(this.lagerVector[i][0]== 1)		// Loslager
							array.push(this.lagerVector[i][1].knotenNummer+1*2) 
						if(this.lagerVector[i][0]== 2){		// Festlager
							array.push(this.lagerVector[i][1].knotenNummer*2) 	
							array.push(this.lagerVector[i][1].knotenNummer+1*2) 
						}		
					}
					return array
				},

				/* KRÄFTE LISTE */
				kraefteVector: [],
				get kraefteVectorAsArray(){
					var array = makeRec(this.knotenList.length*2)

					for(let i = 0; i < this.kraefteVector.length; i++){
						let position = this.kraefteVector[i].targetKnoten.knotenNummer -1
						array[position*2]   =  this.kraefteVector[i].forceVector.F_x
						array[position*2+1]   =  this.kraefteVector[i].forceVector.F_y
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
			this.SimulationData.transformationMatrix = transformationMatrix 
		}

		get transformationMatrix() {
			return this._transformationMatrix;
		}
		
		addFachwerk(vectorGroup){
			let fachwerk =  new Fachwerk(vectorGroup, this.SimulationData)
			this.components.push(fachwerk)			
		}
		addFestlager(vectorGroup){
			let festlager = new Festlager(vectorGroup)
			this.components.push(festlager)

			let knoten 		= this.SimulationData.addKnoten(festlager.position)
			this.SimulationData.addLager("Festlager", knoten)
		}
		addLoslager(vectorGroup){
			let loslager = new Loslager(vectorGroup)
			this.components.push(loslager)

			let knoten 		= this.SimulationData.addKnoten(loslager.position)
			this.SimulationData.addLager("Loslager", knoten)
		}

		addKraft(vectorGroup, targetKnoten){
			let force = new Force(vectorGroup, targetKnoten);
			this.SimulationData.addKraft(force, targetKnoten)
			return force
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
				element.vectorGroup.data.parentComponent  	= element.parentComponent
				element.vectorGroup.data.type             	= element.type
				element.vectorGroup.data.assignedKnoten		= element.assignedKnoten
			})
		} else {
			properties.vectorGroup.data.parentComponent 	= properties.parentComponent
			properties.vectorGroup.data.type            	= properties.type
			properties.vectorGroup.data.assignedKnoten		= properties.assignedKnoten
		}
	}

	get hitboxes(){
		return this._properties
	}
}

class Fachwerk extends MechanicComponent{
	constructor(vectorGroup, simulationDataObject){
		super("Fachwerk", vectorGroup);
		// Receive Values
		this.vectorGroup = vectorGroup;

		// Set Up Knoten Object
		this.startKnotenObject = simulationDataObject.addKnoten(this.startKnotenPosition)
		this.endKnotenObject   = simulationDataObject.addKnoten(this.endKnotenPosition)
		simulationDataObject.addElement(this.startKnotenObject, this.endKnotenObject)

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
					type: "handle",
					assignedKnoten: this.startKnotenObject
				},
				{
					vectorGroup: vectorGroup.children['handle1'],
					parentComponent: this,
					type: "handle",
					assignedKnoten: this.endKnotenObject
				}
			]
		
		this.reposition = this.repositionComponent
	}

	set startKnotenPosition(point){
		this.vectorGroup.children['handle0'].position = point;
	}

	get startKnotenPosition(){
		return this.vectorGroup.children['handle0'].position;
	}

	set endKnotenPosition(point){
		this.vectorGroup.children['handle1'].position = point;
	}

	get endKnotenPosition(){
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
		this.startKnotenPosition = point
		this.vectorGroup.children['line'].segments[0].point = point
	}

	repositionHandle1(point){
		this.endKnotenPosition = point
		this.vectorGroup.children['line'].segments[1].point = point
	}

	remove(){
			console.log("Removed raster of Fachwerk")
			this.vectorGroup.remove();
	}
}

class Loslager extends MechanicComponent{
	constructor(vectorGroup, knoten){
		super("Loslager", vectorGroup);
		this.vectorGroup = vectorGroup;
		this.position = this.vectorGroup.position;

		super.hitboxes = {
			vectorGroup: this.vectorGroup,
			parentComponent: this,
			type: "center"
		}

		//this.raster = this.vectorGroup.rasterize();
		//this.raster.visible = false
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
		
		//this.raster = this.vectorGroup.rasterize();
		//this.raster.visible = false   // Lets work with the vectors only, for now!
		console.log("Festlager created")
	}

	set knotenPosition(point){
		this.vectorGroup.position = point;
	}

	get knotenPosition(){
		return this.vectorGroup.position
	}

	remove(){
		// Remove Raster
		console.log("Removed Festlager")
		this.vectorGroup.remove();
	}  
}

class Force {
	constructor(vectorGroup, targetKnoten){
		this.vectorGroup = vectorGroup
		this.targetKnoten = targetKnoten;
		this.forceVector = {
			F_x : 10,
			F_y : 20
		}
	}
}