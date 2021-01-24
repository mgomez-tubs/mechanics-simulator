<template>
    F_x : <input type="number" name="F_x">
    F_y : <input type="number" name="F_y">

    <button type="button" @click="processChanges">Create Force </button>
</template>

<script>
export default {
    props: {
      forceToBeEdited: Object,
    },
    methods:{
        processChanges(){
            console.log("DONE")
            console.log(this.forceToBeEdited)
            this.componentEditionEvents.emit("EndComponentEdition", "Force")
        }
    }
}
</script>