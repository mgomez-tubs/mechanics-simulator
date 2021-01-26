import { createApp } from 'vue'
import { reactive } from 'vue'
import App from './App.vue'
import mitt from 'mitt'

// Local imports
import ComponentManager from './components/tools/ComponentManager'

// Mount app
let app = createApp(App)

/*
    GLOBAL VARIABLES
*/

// Global event buses
const toolbarEvents = mitt();                                   
const componentEditionEvents = mitt();

// Set emitter objects as global properties
app.config.globalProperties.toolbarEvents = toolbarEvents;      
app.config.globalProperties.componentEditionEvents = componentEditionEvents;

// Make the ComponentManager object global and reactive
var _componentManager = new ComponentManager();
const $reactiveGlobals = reactive({
    componentManager : _componentManager
})
app.config.globalProperties.$reactiveGlobals = $reactiveGlobals

app.mount('#app')


