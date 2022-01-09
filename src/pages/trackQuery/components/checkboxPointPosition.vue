<template>
  <div class="point-position">
    <p class="tip" v-if="checkedPonit.length === 0">
      选择点位（点击地图中点位进行选择，可多选）
    </p>
    <div v-else class="points">
      <div class="item"
        v-for="point in checkedPonit" 
        :key="point.id">
        <span class="name">{{point.name}}</span>
        <img src="@/assets/svg/clear_icon.svg" alt="" @click="delPoint(point)">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'checkboxPointPosition',
  props: {
    checkedPonit: {
      type: Array,
      default: () => ([])
    }
  },
  data(){
    return {}
  },
  methods: {
    delPoint(point){
      this.$emit('valueDelPonit', point)
    }
  }
}
</script>

<style lang="less" scoped>
.point-position {
  padding: 12px 0;
  border-bottom: 1px solid #f0f1f1;
}
.tip {
  font-family: PingFangSC, PingFangSC-Regular;
  font-size: 14px;
  color: #a1a1a4;
  line-height: 20px;
}
.points {
  display: flex;
  flex-wrap: wrap;
  .item {
    margin-right: 10px;
    display: flex;
    align-items: center;
    font-family: PingFangSC, PingFangSC-Semibold;
    font-size: 14px;
    font-weight: 600;
    color: #23243f;
    line-height: 20px;
    img {
      margin-left: 5px;
      display: block;
      width: 14px;
      height: 14px;
    }
  }
}
</style>