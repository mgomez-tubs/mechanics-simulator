import { createApp } from 'vue'
import App from './App.vue'
import mitt from 'mitt'

import ComponentManager from './components/tools/ComponentManager'

// Mount app
let app = createApp(App)

/*
    GLOBAL VARIABLES
*/

// Global event bus
const toolbarEvents = mitt();                                   // Create an emitter object
app.config.globalProperties.toolbarEvents = toolbarEvents;      // Set emitter object as global property

// Make ComponentManager global
const componentManager = new ComponentManager();
app.config.globalProperties.COMPONENT_MANAGER = componentManager;

app.mount('#app')


