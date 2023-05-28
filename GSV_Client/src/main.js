import App from "@/App";
import VueGoogleMaps from '@fawmi/vue-google-maps'
import router from './router'
import PrimeVue from 'primevue/config';

import { createApp } from 'vue'
import { store } from '@/store'

import "primevue/resources/themes/md-dark-indigo/theme.css"
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

import 'semantic-ui-css/semantic.min.css'; // to do remove redundent styles

import SelectButton from 'primevue/selectbutton';

const app = createApp(App);
app.use(router);
app.use(store);
app.use(PrimeVue);
app.use(VueGoogleMaps, {
    load: {
        key: store.state.apiKey,
        libraries: ['places']
    },
});
app.component('SelectButton', SelectButton);
app.mount('#app')