<template>
  <div class="page">
    <div class="top">
      <img class="img" src="@/assets/img/photo.png" alt="">
      <div class="right">
        <div class="name">{{userData.name || ''}}</div>
        <div class="role">{{userData.realname || ''}}</div>
      </div>
    </div>

    <div class="btn" @click="confirmDialog">退出登录</div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { Dialog } from 'vant';
export default {
  name: 'userPage',
  components:{
    [Dialog.Component.name]: Dialog.Component,
  },
  data(){
    return {

    }
  },
  computed:{
    ...mapState({
      userData: state => state.UserPage.userData
    })
  },
  created(){
  },
  methods: {
    ...mapMutations(['set_user']),
    confirmDialog(){
      Dialog.confirm({
        message: '是否确认退出登录？',
      })
        .then(() => {
          this.signOut()
        })
        .catch(() => {
          // on cancel
        });
    },
    async signOut(){
      try {
        const res = await this.$axios.post('/app/logout')
        const {success, message} = res
        if (success) {
          this.set_user({})
          this.$router.push({path: '/login'})
        } else {
          this.$toast(message || '退出登录失败')
        }
      } catch (error) {
        this.$toast(error || '退出登录失败')
        console.log('logout_' + error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.page {
  height: 100%;
  position: relative;
}
.top {
  box-sizing: border-box;
  padding: 24px 15px;
  background: #ffffff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  .img {
    display: block;
    margin-right: 10px;
    width: 50px;
    height: 50px;
  }
  .right {
    flex: 1;
  }
  .name {
    font-family: PingFangSC, PingFangSC-Semibold;
    font-size: 16px;
    font-weight: 600;
    color: #1c1a32;
    line-height: 22px;
  }
  .role {
    margin-top: 4px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-size: 13px;
    color: #808080;
    line-height: 18px;
  }
}
.btn {
  position: absolute;
  bottom: 10px;
  box-sizing: border-box;
  width: calc(100% - 10px);
  margin: 0 5px;
  background: #2d4bba;
  border-radius: 4px;
  font-family: PingFangSC, PingFangSC-Semibold;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: #ffffff;
  line-height: 42px;
}
</style>