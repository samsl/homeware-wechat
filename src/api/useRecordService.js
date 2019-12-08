import Vue from 'vue'
import request from './http'
Vue.http = request

export default {
    getUseRecord(id, category) {
        let path = "useRecords";
        if (id !== null) {
            if (category === 'book') {
                path = `${path}?bookId=${id}`;
            } else {
                path = `${path}?productId=${id}`;
            }
        }
        const data = {}
        return Vue.http.get(path, data);
    },
    addUseRecord(productId, startDate, endDate, purpose, bookId) {
        const path = `useRecords`;
        const data = {
            product: productId,
            startDate: startDate,
            purpose: purpose,
            endDate: endDate,
            book: bookId
        }
        return Vue.http.post(path, data);
    },
    updateUseRecord(productId, startDate, endDate, id, category) {
        const path = `useRecords/${id}`;
        let data;
        if (category === undefined) {
            data = {
                id: id,
                product: productId,
                startDate: startDate,
                endDate: endDate
            }
        } else {
            data = {
                id: id,
                book: productId,
                startDate: startDate,
                endDate: endDate
            }
        }
        return Vue.http.update(path, data);
    }
};