<template>
    <button @click="solve">Calculate!</button>
    <button @click="printKnotenArray">Print Component Manager Data!</button>
</template>

<script>
import EmsModule from '../../js/index.js'
let moduleInstance = null;
const SIZE_OF_INT = 4
const SIZE_OF_DOUBLE = 8

export default {
    beforeCreate(){
        new EmsModule().then(myModule =>{  // When the promise resolves, assign the created module instance to our variable
            moduleInstance = myModule;
        });
    },
    data() {
        return {
            lösung : 123
        }
    },
    
    methods : {
        solve(){
            // Helpers
            var allocateArrayInHEAP_int = function(array){
                let array_ptr = moduleInstance._malloc(SIZE_OF_INT*array.length);
                for(let i = 0; i < array.length; i++)
                    moduleInstance.setValue(array_ptr+i*SIZE_OF_INT, array[i], 'i32')
                return array_ptr;
            }

            var allocateArrayInHEAP_double = function(array){
                let array_ptr = moduleInstance._malloc(SIZE_OF_DOUBLE*array.length);
                for(let i = 0; i < array.length; i++)
                    moduleInstance.setValue(array_ptr+i*SIZE_OF_DOUBLE, array[i], 'double')
                return array_ptr;
            }

            var elementMatrix = [1,2,2,3,4,5,1,4,2,5,2,4,3,5];
            var elementMatrix_ptr = allocateArrayInHEAP_int(elementMatrix);

            var knotenMatrix = [0,0,270,468,540,0,810,468,1080,0];
            var knotenMatrix_ptr  = allocateArrayInHEAP_double(knotenMatrix);
            var anz_Knoten = 5;

            var aussenKraefteVector = [0,0,4,-5,0,0,0,0,0,0];
            var aussenKraefteVector_ptr = allocateArrayInHEAP_double(aussenKraefteVector);

            var lagerVector = [1,2,10];
            var lagerVector_ptr   = allocateArrayInHEAP_int(lagerVector);
            var anz_Lager = 3;

            var calculateLagerKraefte = moduleInstance.cwrap('calculateLagerKraefte', 'number', [
                /* int*    */   'number', // elementMatrix
                /* int     */   'number', // anz_Elemente
                /* double* */   'number', // knotenMatrix
                /* int     */   'number', // anz_Knoten
                /* double* */   'number', // aussenKraefteVector
                /* int     */   'number', // lagerVector
                /* int     */   'number'])// anz_Lager

            var return_ptr_from_get_array = calculateLagerKraefte   (   elementMatrix_ptr, 7, 
                                                                        knotenMatrix_ptr , 5,
                                                                        aussenKraefteVector_ptr,
                                                                        lagerVector_ptr, 3) 
            // Remember: C++ Program reads 4 byte integers, independent of which emscripten HEAP is being used
            
            console.log("Value 0 is: " + moduleInstance.getValue(return_ptr_from_get_array, 'double'));
            console.log("Value 1 is: " + moduleInstance.getValue(return_ptr_from_get_array+SIZE_OF_DOUBLE, 'double'));
            console.log("Value 2 is: " + moduleInstance.getValue(return_ptr_from_get_array+SIZE_OF_DOUBLE*2, 'double'));
        },
        printKnotenArray(){
            //console.log(this.$reactiveGlobals.componentManager.getSimulationData());
            console.log(this.$reactiveGlobals.componentManager.knoten.knotenMatrix)
            console.log("LagerVector :")
            console.log(this.$reactiveGlobals.componentManager.lagerHandler.lagerVector)
        },
    },
    mounted() {
        
    }
}
</script>