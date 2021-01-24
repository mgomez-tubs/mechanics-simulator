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
            F_x : 0,
            F_y : 0
        }
    },
    props: {
      forceToBeEdited: Object,
    },
    methods:{
        processChanges(){
            // Mutate Force object
            this.force.forceVector.F_x = this.F_x;
            this.force.forceVector.F_y = this.F_y;

            // Close Prompt
            this.componentEditionEvents.emit("EndComponentEdition", "Force")
        }
    }
}
</script>