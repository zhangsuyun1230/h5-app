<template>
  <div>
    <Page :label="$route.meta.title || ''" class="page-height" :haveReturn="false">
      <router-view />
      <div class="bottom-btns">
        <div class="bottom-item" 
          v-for="item in pageList" 
          :key="item.path" 
          :class="{active: $route.path === item.path}"
          @click="jumpToPage(item.path)">
          <img class="img-icon" :src="$route.path === item.path ? item.activeIcon : item.icon" alt="">
          <span class="name">{{item.label}}</span>
        </div>
      </div>
    </Page>
  </div>
</template>

<script>
import Page from '@/components/page.vue'
const homeIcon = require('@/assets/svg/home_icon.svg')
const homeIconActive = require('@/assets/svg/home_icon_active.svg')
const noticeIcon = require('@/assets/svg/notice_icon.svg')
const noticeIconActive = require('@/assets/svg/notice_icon_active.svg')
const userIcon = require('@/assets/svg/user_icon.svg')
const userIconActive = require('@/assets/svg/user_icon_active.svg')
export default {
  name: 'frame',
  components: {
    Page
  },
  data(){
    return {
      pageList: [
        {path: '/homePage', label: '应用', icon: homeIcon, activeIcon: homeIconActive},
        {path: '/dynamicPage', label: '最新动态', icon: noticeIcon, activeIcon: noticeIconActive},
        {path: '/userPage', label: '我的', icon: userIcon, activeIcon: userIconActive}
      ]
    }
  },
  methods: {
    jumpToPage(path){
      this.$router.push({path: path})
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .page-height .page-content  {
  height: calc(100vh - 44px - 67px);
  height: calc(var(--vh, 1vh) * 100 - 44px - 67px);
}
.bottom-btns {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  padding: 8px 40px 15px;
  background-color: #fff;
}
.bottom-item {
  display: flex;
  flex-direction: column;
  &.active .name {
    color: #0081ff;
  }
  .img-icon {
    display: block;
    width: 22px;
    height: 22px;
    margin: 0 auto 5px;
  }
  .name {
    line-height: 17px;
    font-family: PingFangHK, PingFangHK-Regular;
    font-size: 12px;
    font-weight: 400;
    color: #a5a7a9;
  }
}
</style>