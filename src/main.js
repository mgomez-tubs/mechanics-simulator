import { createApp } from 'vue'
import { reactive } from 'vue'
import App from './App.vue'
import mitt from 'mitt'

// Emscripten imports


import ComponentManager from './components/tools/ComponentManager'

// Mount app
let app = createApp(App)

/*
    GLOBAL VARIABLES
*/

// Global event bus
const toolbarEvents = mitt();                                   // Create an emitter object
const componentEditionEvents = mitt();

app.config.globalProperties.toolbarEvents = toolbarEvents;                          // Set emitter object as global property
app.config.globalProperties.componentEditionEvents = componentEditionEvents;

// Make ComponentManager global and reactive
var _componentManager = new ComponentManager();

const $reactiveGlobals = reactive({
    componentManager : _componentManager,
    magico: 567
})

app.config.globalProperties.$reactiveGlobals = $reactiveGlobals
app.mount('#app')


