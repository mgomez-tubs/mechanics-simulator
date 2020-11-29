<script>
export default {
    data: {

    },
    methods: {
        createTool(scope) {
        console.log("createTool() was called")
        scope.activate();
        return new paper.Tool();
        },

        linePathCreate(scope, start, end){
            scope.activate();
            return new paper.Path.Line({
            from: start,
            to: end,
            strokeColor: "#FF4400",
            strokeJoin: 'round',
            strokeWidth: 1.5
            })
        },

        mouseDown(){
            console.log("mouseDown() was called");
            // To access functions in nested tool
            let self = this;
            // Create Tool
            this.tool = this.createTool(this.scope);

            this.tool.onMouseDown = (event) => {            // On mouse down      
            // init path
            this.previewLine = this.linePathCreate(self.scope,event.point, event.point);
            };

            this.tool.onMouseDrag = (event) => {            // On mouse dragged
            // Replace the ending point of the line created at onMouseDown() with the current mouse location
            this.previewLine.segments[1].point = event.point;
            };

            this.tool.onMouseUp = (event) => {              // On mouse up
            this.previewLine.segments[1].point = event.point;
            };
        }
    }
}
</script>