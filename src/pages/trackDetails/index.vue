<template>
  <Page :label="$route.meta.title || ''" class="detail-page">
    <div class="track-details">
      <MapContent
        :markers="markers" 
        :zoom="10" 
        :showPlayFunction="true" />

      <van-popup 
        class="track-details-popup"
        v-model="show"
        position="bottom"
        :overlay="false"
        :lock-scroll="false"
        :style="{ height: showDetails ? 'calc(100% - 100px)' : '80px' }" >
        <Arrow 
          @change="changeShowDetails" 
          :showContent="showDetails"
          tip="人员档案信息" />
        <div class="person-details" v-show="showDetails">
          <div class="photo">
            <img :src="detailData.facePhoto" alt="">
          </div>
          <div class="details">
            <div 
              v-for="item in detailList" 
              :key="item.key"
              class="item"
              >
              <span class="label">{{item.label}}</span>
              <span class="value" v-if="item.key !== 'tagStr'" :class="{number: item.font}">
                {{detailData[item.key] || '暂无数据'}}
              </span>
              <div v-if="item.key === 'tagStr'" class="value">
                <span v-if="detailData.tagArr && !detailData.tagArr.length">暂无数据</span>
                <template v-else>
                  <span v-for="tag in detailData.tagArr" :key="tag" class="type">{{tag}}</span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </van-popup>
        
    </div>
  </Page>
</template>

<script>
import {mapState} from 'vuex'
import {sexMap} from '@/config/index.js'
import Page from '@/components/page.vue'
import Arrow from "@/components/arrow.vue"
import MapContent from '../mapContent'
export default {
  name: 'trackDetails',
  components:{
    Page,
    Arrow,
    MapContent
  },
  data(){
    return {
      userImsi: null,
      show: true,
      showDetails: true,
      detailList: [
        {label: '人员标签', value: '', key: 'tagStr'},
        {label: '姓名', value: '', key: 'name'},
        {label: '性别', value: '', key: 'sexName'},
        {label: 'IMSI', value: '', key: 'imsi', font: 'number'},
        {label: '身份证', value: '', key: 'idCard', font: 'number'},
        {label: '手机号', value: '', key: 'phone', font: 'number'},
        {label: '车牌号', value: '', key: 'plateNumber'},
        {label: '民族', value: '', key: 'nation'},
        {label: '出生日期', value: '', key: 'birthday'},
        {label: '职业', value: '', key: 'occupation'},
        {label: '户籍地', value: '', key: 'registeredResidence'},
        {label: '现居地', value: '', key: 'currentResidence'}
      ]
    }
  },
  computed:{
    ...mapState({
      imsiResponse: state => state.Trajectory.imsiResponse,
      imsiTrajectoryList: state => state.Trajectory.imsiTrajectoryList,
    }),
    detailData(){
      const detail = this.imsiResponse || {}
      detail.sexName = sexMap[detail.sex]
      detail.tagArr = detail.tagStr ? detail.tagStr.split(',') : []
      return detail
    },
    markers(){
      const list = (this.imsiTrajectoryList || []).map(n => {
        n.id = n.positionId
        n.name = n.positionName
        n.lng = n.lon
        n.showFlag = false // 是否展示label信息
        return n
      })
      console.log(list, 'detail-makers')
      return list
    },
  },
  created(){
    this.userImsi = this.$route.params.imsi
  },
  methods:{
    changeShowDetails(){
      this.showDetails = !this.showDetails
      // this.$router.go(-1)
    },
  }
}
</script>

<style lang="less" scoped>
.track-details-popup {
  transition: height 0.5s;
  box-sizing: border-box;
  padding: 10px 20px;
}
.person-details {
  box-sizing: border-box;
  padding: 2px 0 20px;
  height: calc(100% - 66px);
  overflow-y: scroll;
  .photo {
    width: 105px;
    height: 135px;
    margin: 0 auto;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .details {
    margin-top: 2px;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f1f1;
    }
    .label {
      width: 60px;
      margin-right: 10px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-size: 14px;
      color: #616163;
      line-height: 20px;
    }
    .value {
      flex: 1;
      text-align: right;
      font-family: PingFangSC, PingFangSC-Semibold;
      font-size: 14px;
      font-weight: 600;
      color: #23243f;
      line-height: 20px;
      &.number {
        font-family: Arial, Arial-Regular;
        font-weight: 400;
        line-height: 16px;
      }
      .type {
        padding: 2px 8px 2px;
        background: #2d4bba;
        border-radius: 2px;
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        line-height: 17px;
      }
      .type:not(:last-child) {
        margin-right: 8px;
      }
    }
  }
}
</style>
<style lang="less">
.detail-page .page-content {
  padding: 0;
}
.track-details {
  height: 100%;
  .map-content {
    height: calc(100% - 80px);
    .bm-view {
      height: 100%;
    }
  }
}
</style>