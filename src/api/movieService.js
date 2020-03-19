import Vue from 'vue'
import request from './http'
Vue.http = request

export default {
    list(from=0, size=10, data) {
        const path = `movies?from=${from}&size=${size}`;
        return Vue.http.post(path, data);
    }
  
};