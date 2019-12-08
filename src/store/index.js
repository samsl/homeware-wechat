import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vue.Store({
    state: {
        accessToken: ''
    },
    mutations: {
        setAccessToken(state, accessToken) {
            state.accessToken = accessToken;
        }
    },
    action: {
        
    }
})