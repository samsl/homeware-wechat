import Vue from 'vue'
import request from './http'
Vue.http = request

export default {
    list() {
        const path = 'products';
        const data = {           
        }
        return Vue.http.get(path, data)
    },
    parse(url) {
        const path = 'products/parse?url=' + url;
        const data = {}
        return Vue.http.get(path, data);
    },
    create(product, category, unit) {
        const path = 'products';
        const data = {
            imgUrl: product.imgUrl,
            ammount: product.ammount,
            name: product.name,
            brand: product.brand,
            capacity: product.capacity,
            unit: unit,
            productCategory: category
        }
        return Vue.http.post(path, data)
    }
};