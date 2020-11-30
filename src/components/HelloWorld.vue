<template>
  <!-- Top Bar -->
  <div class="topbar bar">
    <div id="logo"> Mechanics Playground </div>
    <div class="menu">Menu 1</div>
    <div class="menu">Menu 2</div>
    <div class="menu">Menu 3</div>
    <div class="menu">Help</div>
  </div>

  <!-- Drawing Canvas -->
  <div id="container">

    <CanvasWrapper  class = "wrapper" :currentTool = "selectedTool"/>
    <Toolbar        class = "toolbar" @tool-clicked = 'toolbarHandler($event)' />

  </div>

</template>

<script>
import CanvasWrapper from './CanvasWrapper.vue'
import Toolbar from './UI/Toolbar.vue'
export default {
  data() {
    return {
      container: null,
      selectedTool: "cursor123"
    }
  },
  methods : {
    toolbarHandler(id){
      this.selectedTool = id;
      console.log("Received " + id)
    }
  },
  components: {
    CanvasWrapper,
    Toolbar
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.bar {
  width: 100%;
  height: 2em;
}
.topbar {
  position: relative;
  top:0px;
  background-color: red;
  display: flex;
}

#container {
  position: absolute; 
  height: calc(100% - 2em);
  width: 100%;
}

.menu {
  padding-left: 0.5em;
  padding-right:0.5em;
  margin: auto 0;
  background-color: seagreen;
  font-size:0.8em;
}

#logo {
  margin: auto 0;
  padding-left: 0.5em;
  padding-right: 3em;
  background-color: seashell;
}


.toolbar{
  display: inline-block;
  position:absolute;
  top:1em;
  left: 1em;
}
.wrapper {
  position:absolute;
}

</style>
