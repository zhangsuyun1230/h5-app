<template>
  <div class="start-page">
    <div class="logo">
      <img class="img" src="@/assets/img/logo.png" alt="">
    </div>
    <p class="name">实战平台</p>
    <p class="text">杭州神探信息科技有限公司技术支持</p>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'startPage',
  computed:{
    ...mapState({
      userData: state => state.UserPage.userData
    })
  },
  mounted(){
    this.$nextTick(() => {
      setTimeout(() => {
        if (this.userData.name) {
          this.$router.push({path: '/userPage'})
        } else {
          this.$router.push({path: '/login'})
        }
      }, 2000)
    })
  }
}
</script>

<style lang="less" scoped>
.start-page {
  position: relative;
  width: 100%;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  box-sizing: border-box;
  background: #2d4bba;
  text-align: center;
  color: #ffffff;
  padding-top: 152px;
}
.logo {
  margin: 0 auto;
  width: 127px;
  .img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
.name {
  margin-top: 10px;
  font-size: 26px;
  font-family: serif;
}
.text {
  position: absolute;
  bottom: 60px;
  width: 100%;
  text-align: center;
  font-size: 12px;
  font-family: PingFangSC, PingFangSC-Regular;
  line-height: 17px;
}
</style>