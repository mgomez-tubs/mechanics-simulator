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
            componentManager: this.$reactiveGlobals.componentManager,
            opened: [1,2,3],
            rows: [
                { id: 1, componentName: 'Fachwerke',  children: []},
                { id: 2, componentName: 'Festlager',  children: []},
                { id: 3, componentName: 'Loslager',   children: []}
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
        },
        componentWasAdded(id) {
            try {
                console.log("Component added is " + id.constructor.name)
                switch(id.constructor.name){
                    case "Fachwerk":
                        this.rows[0].children.push('Fachwerk' + this.rows[0].children.length)
                        break;
                    case "Festlager":
                        this.rows[1].children.push('Festlager' + this.rows[1].children.length)
                        break;
                    case "Loslager" :
                        this.rows[2].children.push('Loslager' + this.rows[2].children.length)              
                        break;
                }
            } catch (err) {     // Catch signal for object creation, which sends an undefined object 
                console.log("Component was just created!")
            }
        }
    },
    computed : {
        componentCounter : function(){
            return this.$reactiveGlobals.componentManager.componentCount
        }
    },
    watch : {
        componentCounter(){
            this.componentWasAdded(this.$reactiveGlobals.componentManager.components[this.$reactiveGlobals.componentManager.components.length-1])
        }
    }
}
</script>