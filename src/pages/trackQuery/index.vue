<template>
  <Page :label="$route.meta.title || ''" class="page-query">
    <div class="track-query">
      <MapContent 
        :markers="markers" 
        :zoom="12"
        @clickMarker="checkMap" />

      <div 
        class="track-query-popup"
        :class="{'min-height': !showSearch}"
      >
        <Arrow 
          @change="changeShowSearch" 
          :showContent="showSearch" 
          :tip="'输入查询条件'" />
        <div class="form" v-show="showSearch">
          <TimeRange ref="timeRef" />
          <SelectPersonnel 
            ref="personRef"
            @change="changePerson"
            />
          <CheckboxPointPosition 
            :checkedPonit="checkedPonit"
            @valueDelPonit="valueDelPonit"
            />
          <van-button 
            type="info" 
            :loading="loading" 
            @click="search" 
            class="btn" 
            :class="{disabled: !personVal}">
            点击搜索
          </van-button>
        </div>
      </div>
    </div>
  </Page>
</template>

<script>
import {getLocaleDateString} from '@/utils/public.js'
import {mapMutations} from 'vuex'
import MapContent from '../mapContent'
import Page from '@/components/page.vue'
import Arrow from "@/components/arrow.vue"
import TimeRange from './components/timeRange.vue'
import SelectPersonnel from './components/selectPersonnel.vue'
import CheckboxPointPosition from './components/checkboxPointPosition.vue'
export default {
  name: 'trackQuery',
  components:{
    MapContent,
    Page,
    Arrow,
    TimeRange,
    SelectPersonnel,
    CheckboxPointPosition
  },
  data(){
    return {
      showForm: true,
      showSearch: true,
      personVal: '',
      checkedPonit: [],
      markers: [],
      resultPerson: {},
      loading: false,
    }
  },
  created(){
  },
  mounted(){
    this.getAllPoint()
  },
  methods:{
    ...mapMutations(['set_imsiResponse', 'set_trajectoryQuery', 'set_allPoint']),
    changeShowSearch(){
      this.showSearch = !this.showSearch
    },
    changePerson(value){
      this.personVal = value
    },
    getStringByTime(time){
      const pre = getLocaleDateString(time).split('/').join('-')
      const suffix = time.toTimeString().split(' ')[0]
      return pre + ' ' + suffix
    },
    async getByImsi(imsi){
      try {
        const res = await this.$axios.post('/app/personnelFiles/get/getByImsi', {imsi: imsi})
         const {success, data, info} = res
        if (success) {
          if (data.personnelFiles && data.personnelFiles.length) {
            this.set_imsiResponse(data.personnelFiles[0])
            this.resultPerson = data.personnelFiles[0] || {}
          } else if (data.personnelFiles && data.personnelFiles.length === 0) {
            this.$toast('没有搜索到结果')
          }
        } else {
          this.$toast(info || '接口失败')
        }
      } catch (error) {
        this.$toast(error || '接口失败')
        console.log('/getByImsi_' + error)
      }
    },
    // async getTrajectory(param){
    //   try {
    //     const res = await this.$axios.post('/app/trajectory/get/search', param)
    //     const {success, data, info} = res
    //     if (success) {
    //     } else {
    //       this.$toast(info || '接口失败')
    //     }
    //   } catch (error) {
    //     this.$toast(error || '接口失败')
    //     console.log('/app/trajectory/get/search_' + error)
    //   }
    // },
    async search(){
      if (!this.personVal) {
        return
      }
      try {
        const timeRange = this.$refs.timeRef.getData()
        const person = this.$refs.personRef.getData()
        const imsi = person.includes('（') ? person.split('（')[1].slice(0, -1) : person
        const positionIdList = (this.checkedPonit || []).map(n => n.id)
        const param = {
          imsi: imsi,
          positionIdList: positionIdList,
          startTime: this.getStringByTime(timeRange.start),
          endTime: this.getStringByTime(timeRange.end)
        }
        this.loading = true
        await this.getByImsi(imsi)
        // await this.getTrajectory(param)
        this.set_trajectoryQuery(param)
        const detailImsi = this.resultPerson.imsi
        // if (!this.resultPerson.name || !this.resultPerson.imsi) {
        //   this.$toast('没有搜索到结果')
        // } else {
          this.$router.push({path: `/trackResults/${detailImsi}`})
        // }

        this.loading = false
      } catch (error) {
        console.log(error)
      }
    },
    async getAllPoint(){
      try {
        const res = await this.$axios.post('/app/position/get/search', {})
        const {success, data, info} = res
        if (success) {
          this.markers = (data.positionList || []).map(n => {
            n.lng = n.lnt
            n.isChecked = false // 是否选中
            n.showFlag = false // 是否展示label信息
            return n
          })
          this.set_allPoint(this.markers)
        } else {
          this.$toast(info || '接口失败')
        }
      } catch (error) {
        this.$toast(error || '接口失败')
        console.log('/app/position/get/search_' + error)
      }
    },
    checkMap(point){
      if (point.isChecked) {
        this.addPonit(point)
      } else {
        this.delPoint(point)
      }
    },
    addPonit(point){
      this.checkedPonit.push(point)
    },
    delPoint(point){
      const index = this.checkedPonit.findIndex(n => n.id === point.id)
      index !== -1 && this.checkedPonit.splice(index, 1)
    },
    valueDelPonit(point){
      this.delPoint(point)
      point.isChecked = false
    },
  }
}
</script>

<style lang="less" scoped>
.track-query-popup {
  background: #fff;
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 20px;
  height: auto;
  transition: height 1.5s ease;
  &.min-height {
    height: 83px;
  }
}
.track-query {
  position: relative;
}
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
.btn {
  width: 100%;
  margin-top: 10px;
  font-size: 17px;
  font-family: PingFangSC, PingFangSC-Semibold;
  font-weight: 600;
  color: #ffffff;
  line-height: 42px;
  text-align: center;
  background: #2d4bba;
  border-radius: 4px;
  &.disabled {
    opacity: 0.4;
  }
}
</style>
<style lang="less">
.page-query .page-content {
  padding: 0;
}
.track-query {
  height: 100%;
  .map-content {
    height: calc(100% - 83px);
    .bm-view {
      height: 100%;
    }
  }
}
</style>