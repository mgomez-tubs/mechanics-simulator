<script>
/*
    Needed to pass: scope
*/
//const paper = require('paper');



export default {
    name: 'Line-comp',
    data() {
      return{
        line: null,
        scope: null,
        previewLine: null,
        tool: null,
        number:4
      }
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

        mouseDown(canvas_scope){
            console.log("mouseDown() was called");

            // Create Tool
            this.tool = this.createTool(canvas_scope);

            this.tool.onMouseDown = (event) => {            // On mouse down      
            // init path
            this.previewLine = this.linePathCreate(canvas_scope, event.point, event.point);
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