<template>
    <div id="main_toolbar">
        <div class="toolgroup">
            <div id="drawStab"          class="button"  @click="$emit('tool-clicked','stab')"/> 
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
#drawStab{
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

.button {
    display: block;
    width: 2em;
    height: 2em;
}
</style>