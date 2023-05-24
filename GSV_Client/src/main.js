import App from "@/App";
import VueGoogleMaps from '@fawmi/vue-google-maps'
import router from './router'
import { createApp } from 'vue'
import { store } from '@/store'
import { SuiVue } from "semantic-ui-vue"
import 'semantic-ui-css/semantic.min.css';

// Vuetify
// import 'vuetify/styles'
// import { createVuetify } from 'vuetify'
// import * as components from 'vuetify/components'
// import * as directives from 'vuetify/directives'

// const vuetify = createVuetify({
//     components,
//     directives,
// });


createApp(App)
    .use(router)
    .use(store)
    .use(SuiVue)
    .use(VueGoogleMaps, {
        load: {
            key: store.state.apiKey,
            libraries: ['places']
        },
}).mount('#app')