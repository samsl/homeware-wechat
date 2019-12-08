import Vue from 'vue'
import request from './http'
Vue.http = request

export default {
    list() {
        const path = 'productCategories';
        const data = {           
        }
        return Vue.http.get(path, data);
    },
    create(name) {
        const path = 'productCategories';
        const data = {
            name: name
        }
        return Vue.http.post(path, data);
    }
};