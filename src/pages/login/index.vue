<template>
  <div class="login-form">
    <div class="login-field">
      <van-field
        :value="username"
        required
        clearable
        placeholder="请输入用户名"
        @change="typeUsername($event)"
      />
    </div>
    <div class="login-field">
      <van-field
        :value="password"
        required
        type="password"
        clearable
        placeholder="请输入密码"
        @change="typePassword($event)"
      />
    </div>
    <div class="login-field">
      <van-button type="primary" size="large" :loading="loading" @click="login">登录</van-button>
    </div>
    <div class="login-field">
      <van-button type="primary" size="large" :disabled="loading" @click="register">注册新账号</van-button>
    </div>
    <div class="login-field">
      <van-button type="primary" @click="wxLogin" size="large" :disabled="loading" >微信登录</van-button>
    </div>
  </div>
</template>
<script>
import LoginService from "@/api/loginService";
export default {
  data() {
    return {
      loading: false,
      username: "",
      password: ""
    };
  },
  methods: {
    wxLogin(e){
      wx.login({
        success: res=>{
          LoginService.wxLogin(res.code).then(response=>wx.navigateBack()).catch(err=>console.log(err));
        },
        fail: res=>{
          console.log("couldn't get response from wechat");
        }
      })
    },
    typeUsername(event) {
      this.username = event.mp.detail;
    },
    typePassword(event) {
      this.password = event.mp.detail;
    },
    login() {
      this.loading = true;
      LoginService.login(this.username, this.password)
        .then(response => {
          this.loading = false;
          wx.navigateBack();
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    register() {
      const url = "/pages/register/main";
      wx.navigateTo({ url });
    }
  }
};
</script>
<style>
.login-form {
  width: 80%;
  margin: 100rpx auto;
}
.login-field {
  margin-bottom: 20rpx;
  font-size: 30rpx;
}
</style>
