<template>
  <div class="list-item" @click="toDetail">
    <div class="top">
      <span class="name">{{itemData.deployName || '--'}}</span>
      <TypeLabel class="type" :type="itemData.alarmType" />
    </div>
    <div class="msg">{{itemData.alarmContent || '--'}}</div>
    <div class="bottom">
      <span class="time">{{itemData.alarmTime || '--'}}</span>
      <span class="read" :class="{not: itemData.notRead}"></span>
    </div>
  </div>
</template>

<script>
import TypeLabel from '@/components/typeLabel.vue'
export default {
  name: 'listItem',
  components:{
    TypeLabel
  },
  props: {
    itemData: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    toDetail(){
      this.$router.push({path: `/warningDetail/${this.itemData.alarmId}`})
    },
  }
}
</script>

<style lang="less" scoped>
.list-item {
  box-sizing: border-box;
  padding: 0 0 16px;
  margin-bottom: 17px;
  border-bottom: 1px solid #eeeff4;
  .top, .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .name, .type {
    font-family: PingFangHK, PingFangHK-Semibold;
    font-weight: 600;
  }
  .name {
    flex: 1;
    font-size: 16px;
    color: #21213b;
    line-height: 22px;
    height: 22px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .type {
    line-height: 17px;
  }
  .msg, .time {
    font-family: PingFangHK, PingFangHK-Regular;
    font-size: 14px;
    color: #747484;
    line-height: 21px;
  }
  .msg {
    margin: 8px 0 6px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .read {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    &.not {
      background: #e44357;
    }
  }
}
</style>