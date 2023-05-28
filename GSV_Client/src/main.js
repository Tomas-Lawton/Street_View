import App from "@/App";
import VueGoogleMaps from '@fawmi/vue-google-maps'
import router from './router'
import PrimeVue from 'primevue/config';

import { createApp } from 'vue'
import { store } from '@/store'

import "primevue/resources/primevue.min.css"; //core CSS
import "primeicons/primeicons.css"; //icons

import 'semantic-ui-css/semantic.min.css'; // to do remove redundent styles

import SelectButton from 'primevue/selectbutton';



const app = createApp(App)
    .use(router)
    .use(store)
    .use(PrimeVue)
    .use(VueGoogleMaps, {
        load: {
            key: store.state.apiKey,
            libraries: ['places']
        },
    });

app.component('SelectButton', SelectButton);

app.mount('#app')