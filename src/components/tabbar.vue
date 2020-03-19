<template>
  <van-tabbar :active="active" @change="tabbarChange">
    <van-tabbar-item icon="cart-o">商品</van-tabbar-item>
    <van-tabbar-item icon="video-o">电影</van-tabbar-item>
  </van-tabbar>
</template>
<script>
export default {
  props: ["active"],
  methods: {
    tabbarChange(e) {     
      this.active = e.mp.detail;
      const tabBar = {
        0: "/pages/index/main",
        1: "/pages/movie/main"
      };
      const url = tabBar[this.active];
      wx.redirectTo({
        url
      });
    }
  }
};
</script>