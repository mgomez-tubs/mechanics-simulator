<template>
    <div id="main_toolbar">
        <div class="toolgroup">
            <div id="select"            class="button"  @click="$emit('tool-clicked','select')"/> 
            <div id="drawFachwerk"      class="button"  @click="$emit('tool-clicked','stab')"/> 
            <div id="drawFeder"         class="button"  @click="$emit('tool-clicked','feder')"/>
            <div id="placeFestLager"    class="button"  @click="$emit('tool-clicked','festlager')"/>
            <div id="placeLosLager"     class="button"  @click="$emit('tool-clicked','loslager')"/>
            <div id="drawBoden"         class="button"  @click="$emit('tool-clicked','boden')"/>
        </div>
    </div>
</template>
<script>
export default {
    methods : {
    } 
}
</script>