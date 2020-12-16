<template>
    <div unselectable ="true" v-bind:id="toolbarId" v-bind:class="passedClass"  class="window-background">
        <div unselectable ="true" v-bind:id="toolbarId+'_handle'"               class = "window-handler">{{toolbarName}}</div>
            <slot>
            </slot>
    </div>
</template>
<script>
export default {
    methods : {
    },
    props : {
        toolbarId: {
            type: String,
            required: true
            },
        toolbarName: String,
        passedClass: String
    },
    mounted() {
        var Draggable = require('draggable')
        var options = {
            handle: document.getElementById(this.toolbarId+'_handle'),
            limit: document.getElementById("container")
        }
        var element = document.getElementById(this.toolbarId);
        new Draggable(element, options)
    }
}
</script>