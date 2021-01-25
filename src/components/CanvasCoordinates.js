export default class CanvasCoordinates{
    constructor(paperInstance){
        this.paper= paperInstance
        
        // Set up layer
        this.coordinateLayer = new this.paper.Layer();
        this.coordinateLayer.name = "coordinate-layer"
        this.coordinateLayer.applyMatrix = false;
        this.coordinateLayer.matrix = new this.paper.Matrix(1,0,0,1,0,0);

        // Get reference to user content Layer
        var userContentLayer = this.paper.project.layers['user-content-layer']

        // Build an object

        var axis = {
            transformationMatrix  : new this.paper.Matrix(1,0,0,1,0,0),
            setup(){
                this.handle_group.addChild(axis.handle)
                this.handle_group.data.parentComponent = this
            },
            reposition(point){
                console.log("Moooving")
                this.x_axis.position = point
                this.y_axis.position = point
                this.handle_group.position = point

                // After moving the point, update the transformation matrix
                this.transformationMatrix.tx = point.x
                this.transformationMatrix.ty = point.y
                
                console.log(this.transformationMatrix)
                console.log(point)
            },
            x_axis : new this.paper.Path.Line({
                from : [0,0],
                to   : [0,50],
                strokeColor : "red",
                strokeWidth : "2",
                pivot : [0,0]
            }),
            y_axis : new this.paper.Path.Line({
                from : [0,0],
                to   : [50,0],
                strokeColor : "red",
                strokeWidth : "2",
                pivot : [0,0]
            }),
            handle : new this.paper.Path.Circle ({
                center : [0, 0],
                radius : 5,
                strokeColor : "black",
                fillColor   : "orange"
            }),
            handle_group : new this.paper.Group()
        }
        axis.setup();

        // For the object to be moved around the group needs to have some data

        
        // Pass the handle in a Group to the user content Layer so it becomes selectable
        userContentLayer.addChild(axis.handle_group)
    }
}