<template>
  <div class="arrow">
    <div class="icon-img" @click="changeShow">
      <img :src="require(`@/assets/svg/${showContent ? 'down' : 'top'}_arrow.svg`)" alt="">
    </div>
    <p v-if="tip" class="tip">{{tip}}</p>
  </div>
</template>

<script>
export default {
  name: 'arrow',
  props: {
    tip: {
      type: String,
      default: ''
    },
    showContent: {
      type: Boolean,
      default: false
    }
  },
  methods:{
    changeShow(){
      this.$emit('change')
    }
  }
}
</script>

<style lang="less" scoped>
.arrow {
  .icon-img {
    img {
      display: block;
      margin: 0 auto;
      width: 24px;
      height: 24px;
    }
  }
  .tip {
    margin: 5px 0 10px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-size: 12px;
    color: #616163;
    line-height: 17px;
    text-align: center;
  }
}
</style>