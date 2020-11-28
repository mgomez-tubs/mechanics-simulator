<template>
  <canvas id="canvasId" class="canvas" v-on:mousedown="mouseDown" v-on:click="printXYCoords($event)"></canvas>  
</template> 

<script>
  const paper = require('paper');

  export default{
    name: "Canvas",
    data: () => ({
        path: null,
        path2: null,
        line: null,
        scope: null,
        previewStartEvent: null,
        previewStartPoint: null
    }),
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
      pathCreate(scope) {
        scope.activate();
        return new paper.Path({
            strokeColor: "#FF00FF",
            strokeJoin: 'round',
            strokeWidth: 1.5
        })
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

        this.tool.onMouseDown = (event) => {        // On mouse down
          console.log("Mouse was held down");
          this.previewStartPoint = new paper.Point();
          this.previewStartPoint = event.point.clone();
        
          // init path
          self.path = this.pathCreate(self.scope);
          self.path.add(event.point);
        };

        this.tool.onMouseDrag = (event) => {
          this.linePathCreate(self.scope, this.previewStartPoint, event.point)
        }
        
        this.tool.onMouseUp = (event) => {              // On mouse Up
            console.log("Mouse was lifted");
            // line completed
            self.path.add(event.point);
        }
      }
    },
    mounted() {
      console.log("Mounting...")
      this.scope = new paper.PaperScope();  // Since we are working with JavaScript, the PaperScope needs to be manually created
                                            // Paper classes can only be accessed through PaperScope Objects
                                            // It is possible to access the global paper variable, but im not sure if it works with vue.
      
      this.scope.setup(document.getElementById("canvasId"));      // Sets up a empty project. A canvas ID can be passed, in this case, a View is created for it
    }
  }
</script>   
<style scoped>
  .canvas{
  background-color: black;
  width: 100%;
}
</style>
