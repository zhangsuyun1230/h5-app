<template>
  <div class="time-range">
    <div class="wrap">
      <div class="times">
        <div class="time" @click="showStart = true">
          <div class="date">{{getTimeStr(startTime)}}</div>
          <div class="tip">开始时间</div>
        </div>
        <div class="time" @click="showEnd = true">
          <div class="date">{{getTimeStr(endTime)}}</div>
          <div class="tip">结束时间</div>
        </div>
      </div>
      <van-icon class="icon" name="arrow" />
    </div>

    <van-popup 
      v-model="showStart" 
      position="bottom">
      <van-datetime-picker
        v-model="startTime"
        type="datetime"
        title="选择开始时间"
        @cancel="cancel('showStart')"
        @confirm="value => confirm(value, 'showStart')"
      />
    </van-popup>
    <van-popup 
      v-model="showEnd" 
      position="bottom">
        <van-datetime-picker
          v-model="endTime"
          type="datetime"
          title="选择结束时间"
          @cancel="cancel('showEnd')"
          @confirm="value => confirm(value, 'showEnd')"
        />
    </van-popup>
  </div>
</template>

<script>
import {getLocaleDateString} from '@/utils/public.js'
export default {
  name: 'timeRange',
  data(){
    return {
      showStart: false,
      showEnd: false,
      startTime: null,
      endTime: null,
    }
  },
  computed: {
  },
  created(){
    const initTime = getLocaleDateString()
    this.startTime = new Date(initTime + ' 00:00:00')
    this.endTime = new Date(initTime + ' 23:59:59')
  },
  mounted(){
  },
  methods: {
    getTimeStr(time){
      if (!time) {
        return
      }
      const before = getLocaleDateString(time) // '2021-12-13'
      const after = new Date(time).toTimeString() // '18:31:48 GMT+0800 (中国标准时间)'
      const befores = before.split('/')
      const afters = after.split(' ')[0].split(':')
      return `${befores[1]}月${befores[2]}日 ${afters[0]}:${afters[1]}`
    },
    cancel(attr){
      this[attr] = false
    },
    confirm(value, attr){
      this[attr] = false
    },
    getData(){
      return {
        start: this.startTime,
        end: this.endTime
      }
    }
  }
}
</script>

<style lang="less" scoped>
.time-range {
  border-bottom: 1px solid #f0f1f1;
  .wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .times {
      flex: 1;
      display: flex;
      justify-content: space-between;
    }
    .date {
      font-family: Arial, Arial-Regular;
      font-size: 20px;
      font-weight: 600;
      color: #23243f;
      line-height: 28px;
    }
    .tip {
      margin-top: 4px;
      margin-bottom: 9px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-size: 12px;
      color: #616163;
      line-height: 17px;
    }
    .icon {
      margin-left: 10px;
      color: #a1a1a4;
      font-size: 16px;
    }
  }
}
</style>