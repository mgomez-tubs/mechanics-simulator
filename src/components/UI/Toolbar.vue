<template>
    <div id="main_toolbar">
        <div class="toolgroup">
            <div id="drawStab" class="button" @click="toolClicked('stab')"/> 
            <div id="drawBalken" class="button" @click="toolClicked('balken')"/>
            <div id="tempdraw1" class="button"/>
            <div id="tempdraw2" class="button"/>
        </div>
    </div>
</template>
<script>
export default {
    methods : {
        toolClicked(id){
            console.log("Hellow from Toolbar.vue, the Line button has been clicked.")
            this.$emit('tool-clicked',id);
        }
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
#drawBalken{
    background-color: green;
}

#tempdraw1{
    background-color: yellow;
}
#tempdraw2{
    background-color: red;
}

.button {
    display: block;
    width: 2em;
    height: 2em;
}
</style>