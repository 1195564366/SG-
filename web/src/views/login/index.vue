<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginData" ref="loginData" label-position="left">
      <h3 class="title">SG管理系统</h3>
      <el-form-item prop="acount">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginData.account" autoComplete="on" placeholder="请输入账号" @keyup.enter.native="loginClick"/>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="loginClick" v-model="loginData.password" autoComplete="on"
          placeholder="请输入密码"></el-input>
          <span class="show-pwd" @click="pwdType == 'password' ? pwdType ='text' : pwdType ='password'"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <div class="captcha">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="captcha" />
        </span>
        <el-input name="captcha" type="text" v-model="loginData.captcha" autoComplete="on" placeholder="请输入验证码" @keyup.enter.native="loginClick"/>
        <span v-html="captcha" @click="getCaptcha" class="captcha-svg"></span>
      </div>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="loginClick">
          登陆
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { captcha, login } from '@/api/login'

export default {
  data() {
    return {
      captcha: '',
      loginData: {},
      loading: false,
      pwdType: 'password'
    }
  },
  methods: {
    getCaptcha() {
      captcha().then(res => {
        this.captcha = res.captcha
      })
    },
    loginClick() {
      if (!this.loginData.account || !this.loginData.password || !this.loginData.captcha) {
        this.$message.error('登录信息填写不完整')
      } else if (this.loginData.account.length === 0 || this.loginData.password.length === 0 || this.loginData.captcha.length === 0) {
        this.$message.error('登录信息填写不完整')
      } else {
        login({
          account: this.loginData.account,
          password: this.loginData.password,
          captcha: this.loginData.captcha
        }).then(res => {
          if (res.code) {
            localStorage.sg_token = res.token
            localStorage.sg_name = res.name
            localStorage.sg_state = res.state
            this.$message.success(`${res.name}，欢迎回来`)
            if (Number(res.state === 3)) {
              this.$router.push({ path: '/customer/customer' })
            } else {
              this.$router.push({ path: '/' })
            }
          } else {
            this.getCaptcha()
            this.$message.error(res.msg)
          }
        })
      }
    }
  },
  mounted() {
    this.getCaptcha()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

.captcha {
  line-height: 40px;
  position: relative;
  font-size: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  color: #454545;
  margin-bottom: 22px;
  .el-input {
    width: 58%;
  }
  .captcha-svg {
    background: #ffffff;
    display: inline-block;
    height: 50px;
    vertical-align: bottom;
    margin-bottom: 1px;
    cursor: pointer;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
