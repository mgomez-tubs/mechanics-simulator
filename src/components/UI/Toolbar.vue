<template>
    <div id="main_toolbar">
        <div class="toolgroup">
            <div id="select"            class="button"  @click="$emit('tool-clicked','select')"/> 
            <div id="drawFachwerk"      class="button"  @click="$emit('tool-clicked','stab')"/> 
            <div id="drawFeder"         class="button"  @click="$emit('tool-clicked','feder')"/>
            <div id="placeFestLager"    class="button"  @click="$emit('tool-clicked','festlager')"/>
            <div id="placeLosLager"     class="button"  @click="$emit('tool-clicked','loslager')"/>
        </div>
    </div>
</template>
<script>
export default {
    methods : {
    } 
}
</script>

<style scoped>
#main_toolbar {
  background-color: blue;
  width:5em;
  height:15em;
  
}
.toolgroup {
    height:50%;
    width:100%;
    background-color: darkmagenta;
    display: flex;
    flex-flow: column wrap;
    justify-content: space-between;
    align-items: center;
    margin: 0;
}
/*  
    Tools buttons
*/

.button {
    display: block;
    width: 2em;
    height: 2em;
}
#select {
    background: url("../../assets/select.png") center no-repeat;
    background-size: contain;
}
#drawFachwerk{
    background: url("../../assets/Stab.png") center no-repeat;
    background-size: contain;
} 
#drawFeder{
    background: url("../../assets/feder.png") center no-repeat;
    background-size: contain;
}
#placeFestLager{
    background: url("../../assets/festlager.png") center no-repeat;
    background-size: contain;
}
#placeLosLager{
    background: url("../../assets/loslager.png") center no-repeat;
    background-size: contain;
}


</style>