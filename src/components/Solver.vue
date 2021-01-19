<template>
    <button @click="solve">Calculate!</button>
</template>

<script>
import EmsModule from '../../js/index.js'
let moduleInstance = null;
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
            var get_array = moduleInstance.cwrap('get_array')
            var return_ptr_from_get_array = get_array();
            console.log("Value 0 is: " + moduleInstance.getValue(return_ptr_from_get_array, 'double'));
            console.log("Value 1 is: " + moduleInstance.getValue(return_ptr_from_get_array+SIZE_OF_DOUBLE, 'double'));
            console.log("Value 2 is: " + moduleInstance.getValue(return_ptr_from_get_array+SIZE_OF_DOUBLE*2, 'double'));
        }
    },
    mounted() {
        
    }
}
</script>