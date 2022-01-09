<template>
  <div class="login">
    <div class="logo">
      <img class="img" src="@/assets/img/logo.png" alt="">
    </div>
    <div class="title">登录</div>
    <div class="title">实战平台</div>
    <div class="tip">请输入账号密码进行登录</div>

    <div class="form">
      <div class="field">
        <div class="top">
          <input 
            v-model="form.username"
            type="text" 
            placeholder="请输入账号" 
            autocomplete="off" />
          <van-icon v-show="form.username" name="clear" @click="clearField('username')" />
        </div>
        <p class="error-msg">{{nameErrorMsg}}</p>
      </div>
      <div class="field">
        <div class="top">
          <input 
            v-model="form.password"
            type="password" 
            placeholder="请输入密码"
            autocomplete="off"
            />
          <van-icon v-show="form.password" name="clear" @click="clearField('password')" />
        </div>
        <p class="error-msg">{{passwordErrorMsg}}</p>
      </div>

      <div class="submit-btn" :class="{disabled}" @click="submitLogin">登录</div>
    </div>

    <div class="bottom">杭州神探电子科技有限公司技术支持</div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'login',
  data(){
    return {
      form: {
        username: '',
        password: ''
      },
      nameErrorMsg: '',
      passwordErrorMsg: ''
    }
  },
  computed: {
    disabled() {
      return !this.form.username || !this.form.password
    }
  },
  methods:{
    ...mapMutations(['set_user']),
    clearField(field){
      this.form[field] = ''
    },
    async submitLogin(){
      if (this.disabled) {
        return
      }
      try {
        const res = await this.$axios.post('/app/login', this.form)
        const {success, data, message, info} = res
        if (success) {
          this.set_user(data)
          this.$router.push({path: '/userPage'})
        } else {
          this.$toast(message || info || '登录失败')
        }
      } catch (error) {
        this.$toast(error || '登录失败')
        console.log('login_' + error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  position: relative;
  box-sizing: border-box;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  width: 100%;
  background: #2d4bba;
  padding: 54px 36px 0;
  font-family: PingFangSC, PingFangSC-Regular;
  font-size: 12px;
  color: #ffffff;
  line-height: 17px;
}
.logo {
  margin-bottom: 24px;
  width: 89px;
  height: 92px;
  .img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
.title {
  font-family: PingFangSC, PingFangSC-Semibold;
  font-size: 28px;
  font-weight: 600;
  line-height: 40px;
}
.tip {
  margin: 8px 0 48px;
}
.bottom {
  position: absolute;
  white-space: nowrap;
  bottom: 43px;
  left: 50%;
  transform: translateX(-50%);
}
.form {
  .field {
    font-size: 20px;
    input {
      flex: 1;
      padding: 0;
      border: none;
      outline: none;
      background-color: transparent;
      line-height: 21px;
      font-size: 15px;
      &::-webkit-input-placeholder{
        font-family: PingFangSC, PingFangSC-Regular;
        color:#fff;
      }
    }
    .top {
      display: flex;
      justify-content: space-between;
      padding-bottom: 9px;
      border-bottom: 1px solid rgba(192,196,204, 0.4);
    }
    .error-msg {
      min-height: 17px;
      margin-top: 4px;
      color: #ff7676;
      font-size: 12px;
    }
  }
  .field:first-child{
    margin-bottom: 5px;
  }
  .submit-btn {
    margin-top: 18px;
    border-radius: 4px;
    line-height: 45px;
    font-family: PingFangSC, PingFangSC-Semibold;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 5px;
    text-align: center;
    color: #2d4bba;
    background: #ffffff;
    &.disabled {
      opacity: 0.7;
    }
  }
}
</style>