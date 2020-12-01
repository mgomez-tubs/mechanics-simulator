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
  
  <!-- Bottom Left Notifications -->
  <transition name="fade">
    <div v-if="showBottomLeftPopUp" class="bottompopup"> {{bottomLeftPopUpText}}</div>
  </transition>

</template>

<script>
import CanvasWrapper from './CanvasWrapper.vue'
import Toolbar from './UI/Toolbar.vue'
export default {
  data() {
    return {
      selectedTool: "cursor123",
      container: null,
      // Notifications
      showBottomLeftPopUp: false,
      bottomLeftPopUpText : null

    }
  },
  methods : {
    toolbarHandler(id){
      this.selectedTool = id;
      console.log("Selected " + id);

      switch(id){   // this is only for demo purpouses, remove
        case "stab":
          this.displayBottomLeftNotification("Stab selected");
          break;
        case "loslager":
          this.displayBottomLeftNotification("Loslager selected");
          break;
        case "festlager":
          this.displayBottomLeftNotification("Festlager selected");
          break;
        case "feder":
          this.displayBottomLeftNotification("Feder selected");
          break;
      }

    },
    displayBottomLeftNotification(msg){
      // Create a self varaiable to allow changing this from encapsulated function
      let self = this;  // . . . 

      // Set text variable
      this.bottomLeftPopUpText = msg;

      // Display bottom left div
      this.showBottomLeftPopUp = true;

      // Set timer to hide it again in 1.5s
      window.setTimeout( function(){
        console.log("hide bottom txt");
        self.showBottomLeftPopUp = false;
      } , 1500 )

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

.bottompopup {
  position: absolute;
  bottom:0.4em;
  left: 0.4em;
  background-color: green;
  display: flex;
  transition: opacity 2s;
  border-radius: 1em;
  padding-top: 0.2em;
  padding-bottom: 0.2em;
  padding-left: 0.6em;
  padding-right: 0.6em;
  color: white;
  font-style: italic;
  font-size: 0.9em;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
} 
</style>
