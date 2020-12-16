export default {
    data () {
        return {
            componentManager: null,
            magic_number:3,
        }
    },
    created () {
        console.log("Created")
    },
    methods: {
       getComponentManager() {
          console.log("Now printing from a mixin function")
          return this.componentManager
       }
    }
 }