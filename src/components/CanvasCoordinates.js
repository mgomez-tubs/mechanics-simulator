export default class CanvasCoordinates{
    constructor(paperInstance, gridTrafoMtrx){
        this.paper= paperInstance
        this.gridTrafoMtrx = gridTrafoMtrx
        
        // Set up layer
        this.coordinateLayer = this.paper.project.layers['coordinate-layer']
        this.coordinateLayer.applyMatrix = false;

        // Get reference to user content Layer
        var userContentLayer = this.paper.project.layers['user-content-layer']

        // Build an object
        var axis = {
            gridTrafoMtrx: null,
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
                this.gridTrafoMtrx.tx = point.x
                this.gridTrafoMtrx.ty = point.y
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
        axis.gridTrafoMtrx = this.gridTrafoMtrx;
        
        // Pass the handle in a Group to the user content Layer so it becomes selectable
        userContentLayer.addChild(axis.handle_group)
    }
}