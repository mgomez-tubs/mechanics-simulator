<!-- TODO: Update content when canvas is resized -->
<template>
  <canvas id="canvasId" v-on:mousedown="mouseDown" v-on:click="printXYCoords($event)">
  </canvas>  
</template> 

<script>
  const paper = require('paper');

  export default{
    name: "Canvas",
    data() {
      return{
        line: null,
        scope: null,
        previewLine: null
      }
    },
    methods: {
      printXYCoords(event){
        console.log(event.pageX);
        console.log(event.pageY);
      },
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
      reset() {
        this.scope.project.activeLayer.removeChildren();
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
    },
    mounted() {
      console.log("Mounting canvas...")
      this.scope = new paper.PaperScope();  // Since we are working with JavaScript, the PaperScope needs to be manually created
                                            // Paper classes can only be accessed through PaperScope Objects
                                            // It is possible to access the global paper variable, but im not sure if it works with vue.
      
      this.scope.setup(document.getElementById("canvasId"));      // Sets up a empty project. A canvas ID can be passed, in this case, a View is created for it
    }
  }
</script>   
<style scoped>
  #canvasId{
  background-color: rgb(54, 54, 54);
  width: 100%;
  height: 100%;
}
</style>
