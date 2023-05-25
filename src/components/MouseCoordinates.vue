<template>
    <div class="container"> <!-- TODO: props for this -->
        <div class="coords">Coordinates:</div>
    </div>
</template>

<script>
export default {
    data() {
        return{
        }
    },
    props: {
        cx: Number,
        cy: Number
    },
    methods : {
    }
}
</script>

<style scoped>

    .container {
        position: absolute;
        right: 0px; 
        width:10em;
        height: 2em;
        bottom:0px;
        margin-bottom: 0.5em;
        margin-left:auto;
        margin-right:auto;
        display: block;
        background-color: black;
    }

    .coords {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        line-height: 1;
        width: inherit;
        height:inherit;
        text-align: center;
        font-size: 0.7em;
        color: yellow;
        font-family: 'Courier New', Courier, monospace;
    }
</style>