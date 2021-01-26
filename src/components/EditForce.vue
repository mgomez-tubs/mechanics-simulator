<template>
    F_x : <input type="number" v-model.number="F_x">
    F_y : <input type="number" v-model.number="F_y">

    <button type="button" @click="processChanges">Create Force </button>
</template>

<script>
export default {
    data(){
        return {
            force: this.forceToBeEdited,
            F_x : this.startingFX,
            F_y : this.startingFY
        }
    },
    props: {
      forceToBeEdited: Object,
      startingFX: Number,
      startingFY: Number
    },
    methods:{
        processChanges(){
            // Mutate Force object
            this.force.xComponent = this.F_x;
            this.force.yComponent = this.F_y;

            // Close Prompt
            this.componentEditionEvents.emit("EndComponentEdition", "Force")
        }
    }
}
</script>