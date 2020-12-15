<template>
    <div id="main_toolbar" class = "toolbar">
        <div id="toolbarhandle">Tools</div>
        <div class="toolgroup">
            <div id="select"            class="button"  @click='this.toolbarEvents.emit("userClickedOnTool", "select")'/> 
            <div id="drawFachwerk"      class="button"  @click='this.toolbarEvents.emit("userClickedOnTool", "stab")'/> 
            <div id="drawFeder"         class="button"  @click='this.toolbarEvents.emit("userClickedOnTool", "feder")'/>
            <div id="placeFestLager"    class="button"  @click='this.toolbarEvents.emit("userClickedOnTool", "festlager")'/>
            <div id="placeLosLager"     class="button"  @click='this.toolbarEvents.emit("userClickedOnTool", "loslager")'/>
            <div id="drawBoden"         class="button"  @click='this.toolbarEvents.emit("userClickedOnTool", "boden")'/>
            <div id="removeAll"         @click='this.toolbarEvents.emit("userClickedOnTool", "remove-all")' > Remove all!    </div>
        </div>
    </div>
</template>
<script>
export default {
    methods : {
        userClickedOn(id){
            this.toolbarEvents.emit("userClickedOnTool", id);
        }
    },
    mounted() {
        var Draggable = require('draggable')
        var options = {
            handle: document.getElementById("toolbarhandle"),
            limit: document.getElementById("container")
        }
        var element = document.getElementById("main_toolbar");
        new Draggable(element, options)
    }
}
</script>