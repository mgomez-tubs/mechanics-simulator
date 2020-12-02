<template>
    <div class="topbarcontainer">
    <div class="topbar bar">
      <div id="logo"> Mechanics Playground </div>
      <div class="menu">Menu 1</div>
      <div class="menu">Menu 2</div>
      <div class="menu">Menu 3</div>
      <div class="menu">Help</div>
    </div>
    <!--<ModeSelectionMenu class="menu modeselection"/>--> 
  </div>
</template>

<script>
import ModeSelectionMenu from './ModeSelectionMenu'
export default {
    components: {
        ModeSelectionMenu // eslint-disable-line vue/no-unused-components
    }
}
</script>