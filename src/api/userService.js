import Vue from 'vue'
import request from './http'
Vue.http = request

export default {
    
    validate(username) {
        const path = `users/isExisting?username=${username}`;
        const data = {         
        }
        return Vue.http.get(path, data)
    }
};