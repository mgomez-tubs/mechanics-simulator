<template>
    <div class="table-background">
        <template v-for="row in rows" :key="row.id">
            <div> 
                <span style = "font-weight: bold" @click="toogle(row.id)"> {{row.componentName}}</span>
                <div v-if="opened.includes(row.id)">
                    <template v-for="child in row.children" :key="child">
                        <div style = "margin-left: 1em">{{child}}<br/></div>
                    </template>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    data(){
        return {
            opened: [],
            rows: [
                { id: 1, componentName: 'Fachwerke',  children: ['Fachwerk 1', 'Fachwerk 2']},
                { id: 2, componentName: 'Festlager',  children: ['Feslager 1', 'Festlager 2']},
                { id: 3, componentName: 'Loslager',   children: ['Loslager 1', 'Loslager 2']}
            ]
        }
    },
    methods : {
        toogle(id){
            const index = this.opened.indexOf(id);
            if (index > -1) {
                this.opened.splice(index, 1)
            } else {
                this.opened.push(id)
            }
        }
    }
}
</script>