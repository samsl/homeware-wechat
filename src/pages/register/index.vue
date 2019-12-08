<template>
  <div class="login-form">
    <div class="login-field">
      <van-field
        :value="username"
        required
        clearable
        placeholder="请输入用户名"
        :error-message="usernameErrorMessage"
        @change="typeField('username', $event)"
        @blur="validateUsername"
      />
    </div>
    <div class="login-field">
      <van-field
        :value="password"
        required
        type="password"
        clearable
        placeholder="密码"
        :error="error"
        :error-message="passwordErrorMessage"
        @change="typeField('password', $event)"
        @blur="validatePassword"
      />
    </div>
    <div class="login-field">
      <van-field
        :value="repassword"
        required
        type="password"
        clearable
        placeholder="确认密码"
        :error-message="repasswordErrorMessage"
        @change="typeField('repassword', $event)"
        @blur="validateRepassword"
      />
    </div>
    <div class="login-field">
      <van-button
        type="primary"
        size="large"
        :disabled="passwordErrorMessage!==''||repasswordErrorMessage!==''||usernameErrorMessage!=''"
        :loading="loading"
        @click="register"
      >注册</van-button>
    </div>
  </div>
</template>
<script>
import LoginService from "@/api/loginService";
import UserService from "@/api/userService";
export default {
  data() {
    return {
      loading: false,
      username: "",
      password: "",
      repassword: "",
      passwordErrorMessage: "",
      repasswordErrorMessage: "",
      usernameErrorMessage: ""
    };
  },

  methods: {
    validatePassword() {
      if (this.password === "") {
        this.passwordErrorMessage = "密码不能为空";
        return;
      }
      if (this.repassword!=="" && this.password !== this.repassword) {
        this.passwordErrorMessage = "两次输入密码不同";
        return;
      }
      this.passwordErrorMessage = "";
    },
    validateRepassword() {
      if (this.repassword === "") {
        this.repasswordErrorMessage = "确认密码不能为空";
        return;
      }
      if (this.password !== this.repassword) {
        this.repasswordErrorMessage = "两次输入密码不同";
        return;
      }
      this.repasswordErrorMessage = "";
    },
    validateUsername() {
      if (this.username === "") {
        this.usernameErrorMessage = "用户名不能为空";
        return;
      }
      UserService.validate(this.username)
        .then(response => {
          if (response.data.data !== null) {
            this.usernameErrorMessage = "用户名已存在";
            return;
          }
          this.usernameErrorMessage = "";
        })
        .catch(error => {
          console.log(error);
        });
    },
    typeField(field, event) {
      if (event.mp.type === "change") {
        this[field] = event.mp.detail;
      }
    },
    register() {
      this.loading = true;
      LoginService.register(this.username, this.password)
        .then(response => {
          this.loading = false;
          wx.navigateBack();
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
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
