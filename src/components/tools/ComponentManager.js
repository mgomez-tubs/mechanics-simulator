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

			// Build Knoten Prototype
				
			this.KnotenFactory = {
				Knoten(x,y,knotenNummer){
					this.position = [x,y],
					this.knotenNummer = knotenNummer;
				},
				addKnoten(x,y){
					adder:{
						for(const element of this.knotenList){
							if(element.position[0] == x && element.position[1]== y){
								console.log("WONT BE ADDING THIS ONE!")
								break adder
							}
						}
						this.counter++;
						this.knotenList.push(new this.Knoten(x,y,this.counter))
					}
				},
				knotenList : [],
				get knotenMatrixAsArray(){
					console.log(this.knotenList.length)
					var array = []
					var j = 0;
					for(let i = 0; i < this.knotenList.length; i++){
						console.log(this.transformationMatrix)
						let new_point = this.transformationMatrix.inverseTransform(this.knotenList[i]) 
						array[j]   =  new_point.x  
						array[j+1] =  new_point.y
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
			this.knoten.transformationMatrix=transformationMatrix
		}

		get transformationMatrix() {
			return this._transformationMatrix;
		}
		
		addFachwerk(vectorGroup){
			let fachwerk =  new Fachwerk(vectorGroup)
			this.components.push(fachwerk)

			let startPoint = vectorGroup.children['handle0'].position;
			let endPoint = vectorGroup.children['handle1'].position;

			this.KnotenFactory.addKnoten(startPoint.x, startPoint.y)
			this.KnotenFactory.addKnoten(endPoint.x, endPoint.y)
		}
		addFestlager(vectorGroup){
			this.components.push(new Festlager(vectorGroup))
			this.KnotenFactory.addKnoten(vectorGroup.position.x,vectorGroup.position.y)
		}
		addLoslager(vectorGroup){
			this.components.push(new Loslager(vectorGroup))
			this.KnotenFactory.addKnoten(vectorGroup.position.x,vectorGroup.position.y)
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
		return this.vectorGroup.children['handle0'].position;
	}

	set endKnoten(point){
		this.vectorGroup.children['handle1'].position = point;
	}

	get endKnoten(){
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
