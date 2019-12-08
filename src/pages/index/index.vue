<template>
  <div>
    <van-search
      :value="keyword"
      placeholder="请输入关键词"
      shape="round"
      @search="search($event)"
      use-action-slot
    >
      <div slot="action" @click="addProduct">
        <van-icon name="plus" />
      </div>
    </van-search>
    <div v-show="products.length===0 && books.length===0" class="default-products">
      <van-icon name="shopping-cart-o" size="3em" />
      <span>暂无商品</span>
    </div>
    <div
      v-for="product in products"
      :key="product.id"
      @click="gotoUseRecord(product.id, product.name, product.unit.name)"
      class="product"
    >
      <product :product="product" />
    </div>
    <div
      v-for="book in books"
      :key="book.id"
      @click="gotoUseRecord(book.id, book.name, '页', 'book')"
      class="product"
    >
      <book :book="book" />
    </div>
  </div>
</template>
<script>
import Constant from "@/utils/constant";
import ProductService from "@/api/productService";
import Product from "@/components/product";
import Book from "@/components/book";
import BookService from "@/api/bookService";
export default {
  data() {
    return {
      keyword: "",
      products: [],
      books: []
    };
  },
  onShow() {
    let token = wx.getStorageSync(Constant.AUTHENTICATION);
    if (!token) {
      const url = "/pages/login/main";
      wx.navigateTo({ url });
    } else {
      this.getProducts();
      this.getBooks();
    }
  },
  methods: {
    getProducts() {
      ProductService.list()
        .then(response => {
          this.products = response.data.data;
        })
        .catch(error => {
          this.products = [];
          console.log(error);
        });
    },
    getBooks() {
      BookService.list()
        .then(response => {
          this.books = response.data.data;
        })
        .catch(error => {
          this.books = [];
          console.log(error);
        });
    },
    search(event) {
      console.log(event.mp.detail);
    },
    addProduct() {
      const url = "/pages/upload/main";
      wx.navigateTo({ url });
    },
    gotoUseRecord(id, name, unit, category) {
      const url = `/pages/records/main?id=${id}&name=${name}&unit=${unit}&category=${category}`;
      wx.navigateTo({ url });
    }
  },
  components: {
    Product,
    Book
  }
};
</script>
<style>
.default-products {
  color: #ababab;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 30rpx 0rpx;
}
.product {
  margin-bottom: 10rpx;
}
</style>