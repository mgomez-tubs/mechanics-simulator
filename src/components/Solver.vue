<template>
    <strong>Lager 1:</strong> <br/> {{res1}} in x-Richtung, {{res2}} in y-Richtung
    <br/>
    <strong>Lager 2:</strong> <br/> {{res3}} in y-Richtung
    <br>
    <button @click="solve">Calculate!</button>
</template>

<script>
import EmsModule from '../../js/index.js'

const SIZE_OF_INT = 4;
const SIZE_OF_DOUBLE = 8;

// Emscripten global module
let moduleInstance = null;
// Emscripten global function
let calculateLagerKraefte = null;

// Shamelessly taken from SO
function roundTo(n, digits) {
    var negative = false;
    if (digits === undefined) {
        digits = 0;
    }
    if (n < 0) {
        negative = true;
        n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(digits);
    if (negative) {
        n = (n * -1).toFixed(digits);
    }
    return n;
}

export default {
    beforeCreate(){
        
        new EmsModule({
            locateFile: function(path){
                console.log("happends")
                console.log(process.env.NODE_ENV)
                console.log(process.env.VUE_APP_PUBLIC_PATH)
                console.log("happends2")
                return process.env.VUE_APP_PUBLIC_PATH + "data/wasm/"+ path
            }
        }).then(myModule =>{  // When the promise resolves, 
            
            // Assign the created module instance to our variable
            moduleInstance = myModule;
            // Assign the function to the variable
            calculateLagerKraefte = moduleInstance.cwrap('calculateLagerKraefte', 'number', [
                /* int*    */   'number', // elementMatrix
                /* int     */   'number', // anz_Elemente
                /* double* */   'number', // knotenMatrix
                /* int     */   'number', // anz_Knoten
                /* double* */   'number', // aussenKraefteVector
                /* int     */   'number', // lagerVector
                /* int     */   'number'])// anz_Lager
        });
    },
    data() {
        return {
            publicPath: process.env.BASE_URL,
            res1 : 0,
            res2 : 0,
            res3: 0
        }
    },
    
    methods : {
        solve(){
            // Helpers
            /*
            var elementMatrix           = [1,2,2,3,4,5,1,4,2,5,2,4,3,5];
            var knotenMatrix            = [0,0,270,468,540,0,810,468,1080,0];
            var aussenKraefteVector     = [0,0,4,-5,0,0,0,0,0,0];
            var lagerVector             = [1,2,10];*/

            var elementMatrix           = this.$reactiveGlobals.componentManager.SimulationData.elementListAsArray
            var knotenMatrix            = this.$reactiveGlobals.componentManager.SimulationData.knotenMatrixAsArray_viewport_coords
            var aussenKraefteVector     = this.$reactiveGlobals.componentManager.SimulationData.kraefteVectorAsArray
            var lagerVector             = this.$reactiveGlobals.componentManager.SimulationData.lagerVectorAsArray

            var elementMatrix_ptr       = this.allocateArrayInHEAP_int(elementMatrix);
            var knotenMatrix_ptr        = this.allocateArrayInHEAP_double(knotenMatrix);
            var aussenKraefteVector_ptr = this.allocateArrayInHEAP_double(aussenKraefteVector);
            var lagerVector_ptr         = this.allocateArrayInHEAP_int(lagerVector);

            var return_ptr_from_get_array = calculateLagerKraefte   (   elementMatrix_ptr, elementMatrix.length/2, 
                                                                        knotenMatrix_ptr , knotenMatrix.length/2,
                                                                        aussenKraefteVector_ptr,
                                                                        lagerVector_ptr, lagerVector.length) 
            
            // Remember: C++ Program reads 4 byte integers, independent of which emscripten HEAP is being used
            this.res1 = moduleInstance.getValue(return_ptr_from_get_array, 'double');
            this.res2 = moduleInstance.getValue(return_ptr_from_get_array+SIZE_OF_DOUBLE, 'double');
            this.res3 = moduleInstance.getValue(return_ptr_from_get_array+SIZE_OF_DOUBLE*2, 'double');

            // Truncate
            this.res1 = roundTo(this.res1,2)
            this.res2 = roundTo(this.res2,2)
            this.res3 = roundTo(this.res3,2)
        },
        allocateArrayInHEAP_int (array){
                let array_ptr = moduleInstance._malloc(SIZE_OF_INT*array.length);
                for(let i = 0; i < array.length; i++)
                    moduleInstance.setValue(array_ptr+i*SIZE_OF_INT, array[i], 'i32')
                return array_ptr;
        },
        allocateArrayInHEAP_double (array){
                let array_ptr = moduleInstance._malloc(SIZE_OF_DOUBLE*array.length);
                for(let i = 0; i < array.length; i++)
                    moduleInstance.setValue(array_ptr+i*SIZE_OF_DOUBLE, array[i], 'double')
                return array_ptr;
        },
        printKnotenArray(){
            console.log("knotenMatrixAsArray:")
            console.log(this.$reactiveGlobals.componentManager.SimulationData.knotenMatrixAsArray_viewport_coords)            //console.log("knotenMatrix as Array:")
            console.log("elementListAsArray:")
            console.log(this.$reactiveGlobals.componentManager.SimulationData.elementListAsArray)
            console.log("lagerVectorAsArray:")
            console.log(this.$reactiveGlobals.componentManager.SimulationData.lagerVectorAsArray)        
        },
    },
    mounted() {
        
    }
}
</script>