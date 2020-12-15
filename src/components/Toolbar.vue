<template>
    <div v-bind:id="toolbarId" class ="main_toolbar toolbar">
        <div v-bind:id="toolbarId+'_handle'" class = "toolbar-handler">Tools</div>
        <slot>
        </slot>
    </div>
</template>
<script>
export default {
    methods : {
    },
    props : {
        toolbarId: String
    },
    mounted() {
        /*
        var Draggable = require('draggable')
        var options = {
            handle: document.getElementById("toolbarhandle"),
            limit: document.getElementById("container")
        }
        var element = document.getElementById("main_toolbar");
        new Draggable(element, options)*/
    }
}
</script>