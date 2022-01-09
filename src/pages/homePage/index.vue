<template>
  <div class="home-page">
    <p class="title">常用应用</p>
    <div class="content">
      <div 
        v-for="(item) in list"
        :key="item.path"
        class="item"
        :class="item.colorClass"
        @click="jumpToPage(item.path)">
        <img class="img-icon" :src="item.icon" alt="">
        <span class="name">{{item.label}}</span>
      </div>
    </div>
  </div>
</template>

<script>
const icon2 = require('@/assets/svg/icon1.svg')
const icon3 = require('@/assets/svg/icon2.svg')

export default {
  name: 'homePage',
  components:{
  },
  data(){
    return {
      list: [
        {label: '轨迹分析', path: '/trackQuery', icon: icon2, colorClass: 'yellow'},
        {label: '预警结果', path: '/warningList', icon: icon3, colorClass: 'red'}
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
.home-page {
  font-family: PingFangHK, PingFangHK-Semibold;
  font-size: 16px;
}
.title {
  margin: 15px 0 10px;
  height: 22px;
  line-height: 22px;
  font-weight: 600;
  color: #23243f;
}
.content {
  display: flex;
}
.item {
  margin-right: 16px;
  box-sizing: border-box;
  padding: 20px 0;
  text-align: center;
  width: 105px;
  height: 105px;
  &.blue {
    background: linear-gradient(138deg,#3c9ffd 7%, #2062f9 97%);
  }
  &.yellow {
    background: linear-gradient(136deg,#f4b14f 1%, #ff8737 96%);
  }
  &.red {
    background: linear-gradient(135deg,#f76987, #e13e50);
  }
}
.img-icon {
  display: block;
  width: 35px;
  height: 35px;
  margin: 0 auto 10px;
}
.name {
  height: 20px;
  line-height: 20px;
  font-family: PingFangHK, PingFangHK-Regular;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
}
</style>