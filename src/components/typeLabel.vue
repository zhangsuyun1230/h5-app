<template>
  <span class="type-label">
    {{typeName}}
  </span>
</template>

<script>
import {alarmTypeMap} from '@/config/index.js'
export default {
  name: 'typeLabel',
  props: {
    type: {
      type: Number,
      default: null
    }
  },
  data(){
    return {
      alarmTypeMap
    }
  },
  computed:{
    typeName(){
      return this.alarmTypeMap[this.type] || '--'
    }
  }
}
</script>

<style lang="less" scoped>
.type-label {
  box-sizing: border-box;
  padding: 2px 9px 1px;
  line-height: 20px;
  border-radius: 2px;
  font-family: PingFangHK, PingFangHK-Semibold;
  font-size: 12px;
  font-weight: 600;
  background: #e6eaff;
  color: #6d82ff;
}
</style>