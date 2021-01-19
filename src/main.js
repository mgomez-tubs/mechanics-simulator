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
app.config.globalProperties.toolbarEvents = toolbarEvents;      // Set emitter object as global property

// Make ComponentManager global and reactive
var _componentManager = new ComponentManager();

const $reactiveGlobals = reactive({
    componentManager : _componentManager,
    magico: 567
})

app.config.globalProperties.$reactiveGlobals = $reactiveGlobals
app.mount('#app')


