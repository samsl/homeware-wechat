import Vue from 'vue'
import request from './http'
Vue.http = request

export default {
    list() {
        const path = 'books';
        const data = {           
        }
        return Vue.http.get(path, data);
    },
    create(book) {
        const path = 'books';
        const data = {
            imgUrl: book.imgUrl,            
            name: book.name,
            pages: book.capacity,
            isbn: book.isbn,
            press: book.press,
            publishDate: book.publishDate
        }
        return Vue.http.post(path, data);
    }
};