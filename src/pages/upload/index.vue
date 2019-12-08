<template>
  <div class="container">
    <div class="wizard">
      <van-steps :steps="steps" :active="active" />
    </div>
    <div v-show="!parsed" class="form">
      <van-cell-group>
        <van-field
          :value="url"
          clearable
          placeholder="请在这里粘贴商品链接"
          border="false"
          @change="setUrl($event)"
        ></van-field>
      </van-cell-group>
      <div class="center">
        <van-button type="primary" round :loading="loading" loading-text="加载中..." @click="getProduct">获取商品信息</van-button>
      </div>
    </div>
    <div v-show="parsed" class="form">
      <van-cell-group v-if="product.category!='书'">
        <van-field
          :value="product.brand"
          required
          clearable
          label="品牌"
          @change="setField('brand', $event)"
        ></van-field>
        <van-field
          :value="product.name"
          required
          clearable
          label="商品名称"
          @change="setField('name', $event)"
        ></van-field>
        <van-field
          :value="product.category"
          required
          clearable
          label="分类"
          @click="categoryAction=!categoryAction"
        ></van-field>
        <van-field
          :value="product.capacity"
          required
          clearable
          label="容量"
          @change="setField('capacity', $event)"
        ></van-field>
        <van-field :value="product.unit" required label="单位" @click="unitAction=!unitAction"></van-field>
        <van-field
          :value="product.ammount"
          required
          label="数量"
          type="number"
          @change="setField('ammount', $event)"
        ></van-field>
        <div class="product-img">
          <div class="image-title">商品图片</div>
          <div class="image">
            <img :src="product.imgUrl" style="height:100%" mode="aspectFit" />
          </div>
        </div>
        <div class="center">
          <van-button type="primary" round @click="createProduct">添加商品</van-button>
        </div>
      </van-cell-group>
      <van-cell-group v-if="product.category=='书'">
        <van-field :value="product.press" required disabled label="出版社"></van-field>
        <van-field :value="product.name" required disabled label="书名"></van-field>
        <van-field :value="product.capacity" required clearable label="页数"  @change="setField('capacity', $event)"></van-field>
        <van-field :value="product.isbn" required disabled label="ISBN"></van-field>
        <van-field :value="publishDate" required label="出版日期" disabled type="date"></van-field>
        <div class="product-img">
          <div class="image-title">商品图片</div>
          <div class="image">
            <img :src="product.imgUrl" style="height:100%" mode="aspectFit" />
          </div>
        </div>
        <div class="center">
          <van-button type="primary" round @click="createBook">添加图书</van-button>
        </div>
      </van-cell-group>
    </div>
    <van-action-sheet
      :show="unitAction"
      :actions="unit"
      close-on-click-overlay="true"
      @select="chooseUnit"
      @close="unitAction=false"
    />
    <van-action-sheet
      :show="categoryAction"
      close-on-click-overlay="true"
      @close="categoryAction=false"
      title="请选择商品分类"
    >
      <div class="category-action">
        <div v-for="c in category" :key="c" @click="chooseCategory(c)" class="option">{{c.name}}</div>
        <div class="option" @click="categoryDialog=true">创建新分类</div>
      </div>
    </van-action-sheet>
    <van-dialog
      use-slot
      title="创建新分类"
      :show="categoryDialog"
      show-cancel-button
      @close="categoryDialog=false"
      @confirm="createCategory"
    >
      <van-field
        :value="newCategory"
        placeholder="请填入新分类名称"
        required
        clearable
        label="新分类"
        @input="setNewCategory"
      ></van-field>
    </van-dialog>
  </div>
</template>
<script>
import Constant from "@/utils/constant";
import Utils from "@/utils/index"
import ProductService from "@/api/productService";
import BookService from "@/api/bookService";
import CategoryService from "@/api/categoryService";
import UnitService from "@/api/unitService";
export default {
  data() {
    return {
      loading: false,
      parsed: false,
      newCategory: '',
      categoryAction: false,
      categoryDialog: false,
      unitAction: false,
      unit: [],
      category: [],
      url: "",
      choosedUnit: {},
      choosedCategory: {},
      product: {},
      active: 0,
      steps: [
        {
          text: "贴入商品链接"
        },
        {
          text: "补充商品信息"
        },
        {
          text: "提交"
        }
      ]
    };
  },
  mounted() {
    Object.assign(this.$data, this.$options.data());
    this.getCategory();
    this.getUnit();
  },
  computed: {
    publishDate() {
      if (Object.entries(this.product).length !== 0 || this.product.constructor !== Object) {
      return Utils.formatDate(this.product.publishDate)
      }
    }
  },
  methods: {
    setUrl(event) {
      this.url = event.mp.detail;
    },
    getProduct() {
      this.loading=true;
      ProductService.parse(this.url)
        .then(response => {
          this.active = 1;
          this.product = response.data.data;
          if (this.product.category === "") {
            this.parsed = true;
            this.loading = false;
            return;
          }
          const result = this.findCategory(this.product.category);
          if (result === null) {
            CategoryService.create(this.product.category)
              .then(response => {
                this.choosedCategory = response.data.data;
                this.getCategory();
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            this.choosedCategory = result;
          }
          this.parsed = true;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },
    findCategory(name) {
      const result = this.category.filter(c => c.name == name);
      if (result.length > 0) {
        return result[0];
      }
      return null;
    },
    chooseUnit(event) {
      this.product.unit = event.mp.detail.name;
      this.choosedUnit = event.mp.detail;
      this.unitAction = false;
    },
    chooseCategory(category) {
      this.product.category = category.name;
      this.choosedCategory = category;
      this.categoryAction = false;
    },
    getCategory() {
      CategoryService.list()
        .then(response => {
          this.category = response.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    createCategory() {
      CategoryService.create(this.newCategory)
        .then(response => {
          this.categoryDialog = false;
          this.getCategory();
        })
        .catch(err => {
          console.log(err);
        });
    },
    setNewCategory(event) {
      this.newCategory = event.mp.detail;
    },
    getUnit() {
      UnitService.list()
        .then(response => {
          this.unit = response.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    createProduct() {
      ProductService.create(
        this.product,
        this.choosedCategory,
        this.choosedUnit
      )
        .then(response => {
          this.active = 2;
          const url = "/pages/index/main";
          wx.redirectTo({ url });
        })
        .catch(err => {
          console.log(err);
        });
    },
    createBook() {
      BookService.create(this.product)
        .then(response => {
          this.active = 2;
          const url = "/pages/index/main";
          wx.redirectTo({ url });
        })
        .catch(err => {
          console.log(err);
        });
    },
    setField(field, event) {
      this.product[field] = event.mp.detail;
    }
  }
};
</script>
<style>
page {
  background: #f2f2f2;
}
.form {
  width: 100%;
}
.container {
  padding: 30rpx;
}
.wizard {
  width: 100%;
  margin-bottom: 20rpx;
}
.center {
  margin-top: 30rpx;
  display: flex;
  justify-content: center;
}
.product-img {
  font-size: 28rpx;
  display: flex;
  flex-direction: column;
  background: white;
  margin-bottom: 30rpx;
}
.image {
  height: 250rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.image-title {
  padding: 20rpx 30rpx;
}
.category-action {
  display: flex;
  flex-direction: column;
}
.option {
  text-align: center;
  font-size: 32rpx;
  padding: 24rpx;
  border-bottom: 1px solid #f2f2f2;
}
</style>