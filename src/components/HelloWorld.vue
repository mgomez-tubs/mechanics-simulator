<template>
  <!-- Top Bar -->
  <div class="bar">
    <div id="logo"> Mechanics Playground </div>
    <div class="menu">Menu 1</div>
    <div class="menu">Menu 2</div>
    <div class="menu">Menu 3</div>
    <div class="menu">Help</div>
  </div>

  <!-- Drawing Canvas -->
  <CanvasWrapper/>

  <div id="id1">Das ist ein statischer Text.</div>
  <div id="id2"> {{ dynText }} </div>
  <div id="id3"> {{ dynText2 }} </div>
</template>

<script>
import CanvasWrapper from './CanvasWrapper.vue'
export default {
  data() {
    return {
      dynText : "Este es un texto dinámico. Si.",
      dynText2: "Hola2"
    }
  },
  components: {
    CanvasWrapper
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
  background-color: red;
  width: 100%;
  height: 2em;
  display: flex;
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


</style>
