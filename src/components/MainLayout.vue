<template>
  <MenuBar/>
  <!-- Drawing Canvas TO DO: Set up event bus-->
  <div id="container">
    <CanvasWrapper/>
    <Toolbar/>
  </div>
  
  <!-- Bottom Left Notifications, TO DO : find a better way of doing this-->
  <transition name="fade">
    <div v-if="showBottomLeftPopUp" class="bottompopup"> {{bottomLeftPopUpText}}</div>
  </transition>
</template>

<script>
import CanvasWrapper from './CanvasWrapper.vue'
import Toolbar from './UI/Toolbar'
import MenuBar from './MenuBar'
export default {
  data() {
    return {
      container: null,
      showBottomLeftPopUp: false,
      bottomLeftPopUpText : null
    }
  },
  methods : {
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
    MenuBar
  },
  mounted() {
    this.toolbarEvents.on("userClickedOnTool", id => {
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
  });
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
