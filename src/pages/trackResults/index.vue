<template>
  <Page :label="$route.meta.title || ''" class="page-result">
    <div class="track-results">
      <MapContent 
        :markers="markers" 
        :zoom="10" 
        :showPlayFunction="true"
        />

      <van-popup 
        class="track-results-popup"
        v-model="showResult"
        position="bottom"
        :overlay="false"
        :lock-scroll="false"
        :style="{ height: showTimeAxis ? 'calc(100% - 100px)' : '142px' }" >
        <Arrow 
          @change="changeShowTimeAxis" 
          :showContent="showTimeAxis"
          :tip="showTimeAxis ? '采集时间轴' : '点击查看采集时间轴'" />
        <div class="person">
          <div class="top">
            <span>{{`${imsiResponse.name || '未知'}（${imsiResponse.imsi || '未知'}）`}}</span>
            <span class="icon" @click="viewDetail">i</span>
          </div>
          <p class="times">{{trajectoryQuery | showTime}}</p>
        </div>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="pull-scroll-wrap">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="true"
          >
          <div class="list">
            <div v-if="!(finished && list.length === 0) && showTimeAxis" class="time-axis">
              <div 
                v-for="(info, index) in list" 
                :key="index"
                class="item"
                :class="{'have-line': index !== listLength - 1}"
                >
                <div class="left">
                  <img class="img" src="@/assets/svg/point_icon.svg" alt="">
                </div>
                <div class="right">
                  <p class="name">{{`${info.address + (info.positionName ? `（${info.positionName}）` : '')}`}}</p>
                  <p class="time">{{info.lastCaptureDate}}</p>
                </div>
              </div>
            
            </div>
          </div>
          </van-list>
        </van-pull-refresh>
      </van-popup>
    </div>
  </Page>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import MapContent from '../mapContent'
import Page from '@/components/page.vue'
import Arrow from "@/components/arrow.vue"
export default {
  name: 'trackResults',
  components:{
    MapContent,
    Page,
    Arrow,
  },
  data(){
    return {
      showResult: true,
      showTimeAxis: true,
      list: [],
      pageIndex: 1,
      pageSize: 50,
      loading: false,
      finished: false,
      refreshing: false,
    }
  },
  computed:{
    ...mapState({
      imsiResponse: state => state.Trajectory.imsiResponse,
      trajectoryQuery: state => state.Trajectory.trajectoryQuery,
    }),
    listLength(){
      return this.list.length
    },
    markers(){
      const list = (this.list || []).map(n => {
        n.id = n.positionId
        n.name = n.positionName
        n.lng = n.lon
        n.showFlag = false // 是否展示label信息
        return n
      })
      console.log(list, 'result-makers')
      return list || []
    },
  },
  filters:{
    showTime(query){
      const start = query.startTime
      const end = query.endTime
      return `${start} - ${end}`
    }
  },
  created(){
  },
  methods: {
    ...mapMutations(['set_imsiTrajectoryList']),
    changeShowTimeAxis(){
      this.showTimeAxis = !this.showTimeAxis
    },
    viewDetail(){
      this.set_imsiTrajectoryList(this.list)
      this.$router.push({path: `/trackDetails/${this.imsiResponse.imsi}`})
    },
     async onRefresh() {
      this.list = [];
      this.finished = false;
      this.pageIndex = 1;
      // await this.onLoad();
      this.refreshing = false;
    },
    async onLoad() {
      try {
        this.loading = true;
        const param = {
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
        }
        const res = await this.$axios.post('/app/trajectory/get/search', {...param, ...this.trajectoryQuery})
        const {success, data, info} = res
        if (success) {
          const list = data.trajectory || []
          this.list.push(...list);
          // 数据全部加载完成
          if (data && data.trajectory && data.trajectory.length < this.pageSize) {
            this.finished = true;
          }
          console.log(this.list.length)
        } else {
          this.$toast(info || '接口失败')
        }
      } catch (error) {
        this.finished = true;
        this.$toast(error || '获取接口失败')
        console.log('trajectory/get/search_' + error)
      } finally {
        // 加载状态结束
        this.loading = false;
        this.pageIndex++;
      }
    },
  }
}
</script>

<style lang="less" scoped>
.track-results-popup {
  transition: height 0.5s;
  box-sizing: border-box;
  padding: 10px 20px;
  .person {
    .top {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      font-size: 20px;
      font-family: PingFangSC, PingFangSC-Semibold;
      font-weight: 600;
      color: #23243f;
      line-height: 28px;
    }
    .icon {
      display: inline-block;
      margin-left: 10px;
      width: 18px;
      height: 18px;
      background: #2d4bba;
      color: #fff;
      line-height: 18px;
      text-align: center;
      font-weight: 600;
      font-family: monospace;
    }
    .times {
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      color: #616163;
      line-height: 17px;
    }
  }
  .pull-scroll-wrap {
    height: calc(100% - 106px);
    overflow-y: scroll;
  }
  .time-axis {
    max-height: calc(100% - 116px);
    overflow-y: scroll;
    box-sizing: border-box;
    border-top: 1px solid #f0f1f1;
    margin-top: 9px;
    padding-top: 15px;
    .item {
      display: flex;
      position: relative;
      &.have-line::after {
        content: '';
        display: block;
        position: absolute;
        left: 7px;
        top: 37px;
        width: 0;
        height: calc(100% - 28px - 8px);
        border-right: 1px dashed #2d4bba;
      }
      .left {
        width: 15px;
        margin-right: 10px;
      }
      .img {
        margin-top: 9px;
        display: inline-block;
        width: 15px;
        height: 22px;
      }
      .right {
        flex: 1;
      }
      .name {
        font-family: PingFangSC, PingFangSC-Semibold;
        font-size: 14px;
        font-weight: 600;
        color: #23243f;
        line-height: 20px;
      }
      .time {
        margin-top: 4px;
        margin-bottom: 20px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-size: 12px;
        color: #616163;
        line-height: 17px;
      }
    }
  }
}
</style>
<style lang="less">
.page-result .page-content {
  padding: 0;
}
.track-results {
  height: 100%;
  .map-content {
    height: calc(100% - 142px);
    .bm-view {
      height: 100%;
    }
  }
}
</style>