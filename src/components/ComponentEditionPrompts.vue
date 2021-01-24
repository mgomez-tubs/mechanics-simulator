<template>
<Toolbar    :toolbarId="'editForce'"            :toolbarName = "'Edit Force'" 
            :passedClass = "'table-container'"  v-if = "displayForceEditionPrompt">
        <EditForce :test = "'HOLA'"/>
</Toolbar>
</template>

<script>
import EditForce from './EditForce'
import Toolbar from './Toolbar'
export default {
    data(){
        return{
            displayForceEditionPrompt : false,
            forceToBeEdited: null
        }
    },
    mounted(){
    this.componentEditionEvents.on("StartComponentEdition", (bundle) => {
      switch(bundle.component){
        case "Force":
          // Show Edit Force window
          this.displayForceEditionPrompt  = true
          this.forceToBeEdited            = bundle.object
          break;
      }
    })

    this.componentEditionEvents.on("EndComponentEdition", (id) => {
      switch(id){
        case "Force":
          // Hide edit Force window
          this.displayForceEditionPrompt = false
          break;
      }
    })
    },
    components : {
      EditForce,
      Toolbar
    }
}
</script>