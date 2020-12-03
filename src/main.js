import { createApp } from 'vue'
import App from './App.vue'
import mitt from 'mitt'

// Mount app
let app = createApp(App)

// Global event bus
const toolbarEvents = mitt();                                   // Create an emitter object
app.config.globalProperties.toolbarEvents = toolbarEvents;      // Set emitter object as global property

app.mount('#app')


