import Vue from 'vue'
import request from './http'
Vue.http = request

export default {
    login(username, password) {
        const path = 'login';
        const data = {
            "username": username,
            "password": password
        }
        return Vue.http.post(path, data)
    },
    register(username, password) {
        const path = 'register';
        const data = {
            "username": username,
            "password": password
        }
        return Vue.http.post(path, data)
    },
    wxLogin(code){
        const path='wxLogin';
        const data = {
            "loginCode": code
        }
        return Vue.http.post(path, data);
    }
};