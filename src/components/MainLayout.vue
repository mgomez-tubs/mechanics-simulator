<template>
  <MenuBar/>
  <div id="container">
    <CanvasWrapper/>
    <Toolbar :toolbarName = "'Tools'" :passedClass = "'tools-container'">
      <div class="tool-background">
            <div id="select"            class="button"  @click='toolbarEvents.emit("userClickedOnTool", "select")'/> 
            <div id="drawFachwerk"      class="button"  @click='toolbarEvents.emit("userClickedOnTool", "stab")'/> 
            <div id="placeKraft"        class="button"  @click='toolbarEvents.emit("userClickedOnTool", "kraft")'/>
            <div id="placeFestLager"    class="button"  @click='toolbarEvents.emit("userClickedOnTool", "festlager")'/>
            <div id="placeLosLager"     class="button"  @click='toolbarEvents.emit("userClickedOnTool", "loslager")'/>
            <div id="drawBoden"         class="button"  @click='toolbarEvents.emit("userClickedOnTool", "boden")'/>
            <div id="removeAll"         @click='toolbarEvents.emit("userClickedOnTool", "remove-all")' > Remove all! </div>
            <div id="svgDownload"       class="button">Download SVG</div>
      </div>
    </Toolbar>
    
    <!--Toolbars-->
    <Toolbar :toolbarName = "'Components'"  :passedClass = "'table-container'">
      <ComponentTable/>
    </Toolbar>

    <Toolbar :toolbarName = "'Solution'"    :passedClass = "'solution-container'">
      <SolutionTable/>
    </Toolbar>

    <Toolbar :toolbarName = "'Debug'"       :passedClass = "'debug-container'">
      <DebugInfo/>
    </Toolbar>

    <!-- Component edition prompts -->
    <ComponentEditionPrompts/>
  </div> 
  
  <!-- Bottom Left Notifications-->
  <transition name="fade">
    <div v-if="showBottomLeftPopUp" class="bottompopup"> {{bottomLeftPopUpText}}</div>
  </transition>
</template>

<script>
import CanvasWrapper  from './CanvasWrapper.vue'
import ComponentTable from './ComponentTable'
import SolutionTable  from './SolutionTable'
import DebugInfo      from './DebugInfo'
import Toolbar        from './Toolbar'
import MenuBar        from './MenuBar'
import ComponentEditionPrompts  from './ComponentEditionPrompts'

export default {
  data() {
    return {
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
    MenuBar,
    ComponentTable,
    SolutionTable,
    DebugInfo,
    ComponentEditionPrompts
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
