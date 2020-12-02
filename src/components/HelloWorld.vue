<template>
  <!-- Top Bar -->
  <div class="topbarcontainer">
    <div class="topbar bar">
      <div id="logo"> Mechanics Playground </div>
      <div class="menu">Menu 1</div>
      <div class="menu">Menu 2</div>
      <div class="menu">Menu 3</div>
      <div class="menu">Help</div>
    </div>
    <ModeSelectionMenu class="menu modeselection"/>
  </div>
  

  <!-- Drawing Canvas -->
  <div id="container">
    <CanvasWrapper :currentTool = "selectedTool"/>
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
import ModeSelectionMenu from './ModeSelectionMenu.vue'
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

      switch(id){   // this is only for demo purpouses, remove
        case "select":
          this.displayBottomLeftNotification("Selection tool selected");
          break;
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
        case "boden":
          this.displayBottomLeftNotification("Boden selected");
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
        self.showBottomLeftPopUp = false;
      } , 1500 )

    }
  },
  components: {
    CanvasWrapper,
    Toolbar,
    ModeSelectionMenu
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
} 
</style>
