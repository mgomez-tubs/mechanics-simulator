<template>
<div class="debug-content">
    KnotenMatrix :<br/> {{knotenMatrix}} <br/>
    ElementMatrix :<br/> {{elementMatrix}}<br/>
    LagerListe :<br/> {{lagerListe}}<br/>
</div>
</template>

<script>
export default { 
    computed : {
            knotenMatrix : function(){
                return this.$reactiveGlobals.componentManager.SimulationData.knotenMatrixAsArray_viewport_coords
            },
            elementMatrix : function(){
                return this.$reactiveGlobals.componentManager.SimulationData.elementListAsArray
            },
            lagerListe : function(){
                return this.$reactiveGlobals.componentManager.SimulationData.lagerVectorAsArray
            }
    }
}
</script>