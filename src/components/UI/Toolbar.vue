<template>
    <div id="main_toolbar">
        <div class="toolgroup">
            <div id="select"            class="button"  @click='userClickedOn("select")'/> 
            <div id="drawFachwerk"      class="button"  @click='userClickedOn("stab")'/> 
            <div id="drawFeder"         class="button"  @click='userClickedOn("feder")'/>
            <div id="placeFestLager"    class="button"  @click='userClickedOn("festlager")'/>
            <div id="placeLosLager"     class="button"  @click='userClickedOn("loslager")'/>
            <div id="drawBoden"         class="button"  @click='userClickedOn("boden")'/>
        </div>
    </div>
</template>
<script>
export default {
    methods : {
        userClickedOn(id){
            this.toolbarEvents.emit("userClickedOnTool", id);
        }
    } 
}
</script>