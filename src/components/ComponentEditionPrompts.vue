<template>
<Prompt   :toolbarName = "'Edit Force'" 
          :passedClass = "'table-container'"  v-if = "displayForceEditionPrompt"
          :promptPosition = "promptPosition">
          <EditForce :forceToBeEdited = "forceToBeEdited" :startingFX = "startingFX" :startingFY = "startingFY"/>
</Prompt>
</template>

<script>
import EditForce from './EditForce'
import Prompt from './Prompt'
export default {
    data(){
        return{
            displayForceEditionPrompt : false,
            forceToBeEdited: null,
            promptPosition: 123,
            startingFX: 0,
            startingFY: 0
        }
    },
    mounted(){
    this.componentEditionEvents.on("StartComponentEdition", (bundle) => {
      switch(bundle.component){
        case "Force":
          // Show Edit Force window
          this.displayForceEditionPrompt  = true
          this.forceToBeEdited            = bundle.object
          this.startingFX                 = bundle.startingFX
          this.startingFY                 = bundle.startingFY
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
      Prompt
    }
}
</script>