<template>
  <div class="record-container">
    <div class="cell">
      <img :src="productImg" mode="aspectFit" class="product-img">
    </div>
    <div class="cell">
      <van-cell :title="productName" :value="productId"/>
    </div>
    <div class="cell">
    <van-cell-group>
      <van-field
        :value="formattedStartDate"
        required
        placeholder="请输入日期"
        :error="error"
        label="开始日期"
        readonly="true"
        @click="show=true;active='start'"
      ></van-field>
      <van-field :value="formattedEndDate" label="结束日期" placeholder="请输入日期" readonly="true" @click="show=true;active='end'"></van-field>
      <van-field :value="purpose" label="用途"  placeholder="请输入用途" @change="updatePurpose"/>
    </van-cell-group>
    </div>
    <van-popup :show="show" position="bottom" @close="show=false" custom-style="width:100%">
      <van-datetime-picker :value="defaultDate" title="选择日期" type="date" @cancel="show=false" @confirm="chooseDate"/>
    </van-popup>
    <div class="cell">
    <van-button type="primary" size="large" @click="submit">提交</van-button>
    </div>
  </div>
</template>
<script>
import UseRecordService from "@/api/useRecordService";
import Utils from "@/utils/index";
export default {
  data() {
    return {
      productId: null,
      productImg: "",
      productName: "",
      startDate: "",
      endDate: "",
      defaultDate: new Date().getTime(),
      active: "start",
      error: false,
      show: false,
      bookId: null
    };
  },
  onShow() {
    Object.assign(this.$data, this.$options.data());
    this.loadProduct();
  },
  computed: {
    formattedStartDate() {
      if (this.startDate !== "") {
      return Utils.formatDate(this.startDate);
      }
      return ""
    },
    formattedEndDate() {
      if (this.endDate) {
      return Utils.formatDate(this.endDate);
    }
    return ""
    }
  },
  methods: {
    loadProduct() {
      if (this.$root.$mp.query.category!==null && this.$root.$mp.query.category === 'book') {
        this.bookId = parseInt(this.$root.$mp.query.id);
      } else {
      this.productId = parseInt(this.$root.$mp.query.id);
      }
      this.productName = this.$root.$mp.query.name;
      this.productImg = this.$root.$mp.query.img;
    },
    chooseDate(event) {
      if (this.active === "start") {
        this.error = false;
        this.startDate = event.mp.detail;
      } else {
        this.endDate = event.mp.detail;
      }
      this.show = false;
    },
    submit() {
      if (this.startDate === "") {
        this.error = true;
        return
      }
      UseRecordService.addUseRecord(this.productId, this.startDate, this.endDate, this.purpose, this.bookId).then(response=>{
        const url = "/pages/index/main";
        wx.redirectTo({url});
      }).catch(err=>{
        console.log(err);
      })
    },
    updatePurpose(event) {     
      this.purpose = event.mp.detail;
    }
  }
};
</script>
<style>
/* page {
  background: #f2f2f2;
} */
.cell {
  width: 100%;
  margin-bottom: 10rpx;
  background: white;
}
.product-img {
  width: 100%;
  padding: 10rpx;
}
</style>