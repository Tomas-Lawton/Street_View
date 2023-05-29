import Vuex from "vuex";
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
    storage: window.localStorage
  })

export const store = new Vuex.Store({
    plugins: [vuexLocal.plugin],
    state: {
        isLoggedIn: false,
        apiKey: String,
        user: {
            position: {
                lat: -33.8985415, 
                lng: 151.169633
            },
        }
    },
    mutations: {
        setGlobalError (state, error) {
            state.globalError = error
        },
        login (state, string) {
            state.isLoggedIn = true
            state.apiKey = string
        },
        updateUserPosition(state, data) {
            if (state.user.position !== data) {
                state.user.position = data
            }
        }
    },
    actions: {} //these commit the mutations to the state and handle business logic
});