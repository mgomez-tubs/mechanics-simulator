import { createApp } from 'vue'
import App from './App.vue'
import mitt from 'mitt'

// Mount app
let app = createApp(App)

/*
    GLOBAL VARIABLES
*/

// Global event bus
const toolbarEvents = mitt();                                   // Create an emitter object
app.config.globalProperties.toolbarEvents = toolbarEvents;      // Set emitter object as global property

// Set up global PaperJS Object
//app.config.globalProperties.paper

app.mount('#app')


