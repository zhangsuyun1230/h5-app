<template>
  <div>
    <Page :label="$route.meta.title || ''">
      <div class="details">
        <div 
          class="item"
          v-for="item in list"
          :key="item.key">
          <div class="label">{{item.label}}</div>
          <div v-if="item.key !== 'alarmType'" class="value">{{detailData[item.key] || '--'}}</div>
          <div v-if="item.key === 'alarmType'" class="value">
            <TypeLabel :type="detailData[item.key]" />
          </div>
        </div>
      </div>
    </Page>
  </div>
</template>

<script>
import {alarmTypeMap} from '@/config/index.js'
import Page from '@/components/page.vue'
import TypeLabel from '@/components/typeLabel.vue'
export default {
  name: 'warningDetail',
  components:{
    Page,
    TypeLabel
  },
  data(){
    return {
      detailId: null,
      detailData: {},
      list: [
        {label: '预警名称', key: 'deployName'},
        {label: '预警类型', key: 'alarmType'},
        {label: '预警内容', key: 'alarmContent'},
        {label: '预警点位', key: 'positionName'},
        {label: '预警时间', key: 'alarmTime'},
      ]
    }
  },
  filters:{
    formatType(type) {
      return alarmTypeMap[type] || '--'
    }
  },
  created(){
    this.detailId = this.$route.params.id
    this.getDetailData()
  },
  methods: {
    async getDetailData(){
      try {
        const res = await this.$axios.post('/app/alarm/get/id', {id: this.detailId})
        const {success, data, info} = res
        if (success) {
          this.detailData = data
        } else {
          this.$toast(info || '获取详情失败')
        }
      } catch (error) {
        this.$toast(error || '获取详情失败')
        console.log('alarm/get/id_' + error)
      }
    }
  },
}
</script>

<style lang="less" scoped>
.details {
  box-sizing: border-box;
  padding: 15px;
  height: calc(100vh - 44px - 30px);
  height: calc(var(--vh, 1vh) * 100 - 44px - 30px);
  background-color: #fff;
  border-radius: 2px;
}
.label {
  margin-bottom: 10px;
  font-family: PingFangHK, PingFangHK-Semibold;
  font-size: 16px;
  font-weight: 600;
  color: #21213b;
  line-height: 22px;
}
.value {
  margin-bottom: 15px;
  font-family: PingFangHK, PingFangHK-Regular;
  font-size: 14px;
  font-weight: 400;
  color: #747484;
  line-height: 21px;
}
</style>