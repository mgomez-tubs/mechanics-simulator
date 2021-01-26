<template>
    <div unselectable ="true"       v-bind:id="toolbarId"               v-bind:class="passedClass"  class="prompt-background">
        <div unselectable ="true"   v-bind:id="toolbarId+'_handle'"     class = "prompt-handler">
            {{toolbarName}}</div>
            <slot>
            </slot>
    </div>
</template>
<script>
export default {
    data (){
        return{
            toolbarId : this.generateID(this.toolbarName)
        }
    },
    props : {
        toolbarName: String,
        passedClass: String,
        promptPosition: Number
    },
    mounted() {
        var Draggable = require('draggable')
        var options = {
            handle: document.getElementById(this.toolbarId + '_handle'),
            limit: document.getElementById("container")
        }
        var element = document.getElementById(this.toolbarId);
        new Draggable(element, options)

        // Set up position of the Prompt
        this.setPromptPosition(element, event)
    },
    methods : {
        generateID(string){
            return string.replace(/\s+/g, '')
        },
        setPromptPosition(element, event){
            var offset = 20
            var x_position = event.clientX + offset + "px";
            var y_position = event.clientY + offset + "px";
            element.style.position = "fixed";
            element.style.top = y_position;
            element.style.left = x_position;
        }
    }
}
</script>