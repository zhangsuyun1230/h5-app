<template>
  <div class="page">
    <div v-if="haveReturn" class="detail-label">
      <van-icon name="arrow-left" class="left-arrow" @click="jumpReturn" />
      <span>{{label}}</span>
    </div>
    <div v-else class="page-label">
      {{label}}
    </div>
    <div class="page-content" id="pageContent">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'page',
  props: {
    label: {
      type: String,
      default: ''
    },
    haveReturn: {
      type: Boolean,
      default: true
    },
    backFun: {
      type: Function,
      default: null
    }
  },
  mounted(){
    // console.log(this.$slots,this.$scopedSlots)
  },
  methods: {
    jumpReturn() {
      if (this.backFun) {
        this.backFun()
        return
      }
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
.page {
  width: 100%;
}
.page-label, .detail-label {
  box-sizing: border-box;
  position: fixed;
  top: 0;
  width: 100%;
  height: 44px;
  line-height: 44px;
  padding: 0 15px;
  background: #2D4BBA;
  font-family: PingFangSC, PingFangSC-Semibold;
  font-weight: 600;
  color: #ffffff;
}
.page-label {
  font-size: 22px;
}
.detail-label {
  text-align: center;
  font-size: 17px;
}
.left-arrow {
  position: absolute;
  top: 10px;
  left: 10px;
  font-weight: 600;
  padding: 5px;
}
.page-content {
  box-sizing: border-box;
  margin-top: 44px;
  padding: 10px 15px;
  height: calc(100vh - 44px);
  height: calc(var(--vh, 1vh) * 100 - 44px);
  overflow: scroll;
  background-color: #F3F5F8;
}
</style>