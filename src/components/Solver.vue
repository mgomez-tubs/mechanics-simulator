<template>
    <button @click="solve">Calculate!</button>
</template>

<script>
import EmsModule from './emscripten_output/index.js'
let moduleInstance = null;

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
			var ptr_from_get_array = get_array();
			var js_array2 = moduleInstance.HEAPU32.subarray(ptr_from_get_array, ptr_from_get_array + 5);
            console.log(js_array2)
            console.log("finisched")
        }
    },
    mounted() {
        
    }
}
</script>