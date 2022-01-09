<template>
  <div>
    <Page :label="$route.meta.title || ''" class="reset-page">
      <div class="content" v-if="showRefresh">
        <div class="page-top">
          <ProgressCanvas :width="214" :height="111" :lineWidth="8" :total="allNumber" :step="notNumber">
            <div class="rate">{{`${notNumber} / ${allNumber}`}}</div>
            <span class="label">数据统计</span>
          </ProgressCanvas>
          <div class="description">未读/全部预警</div>
        </div>

        <van-sticky :offset-top="54" class="sticky-con">
          <Search id="searchCon" class="search" placeholder="请输入imsi" @search="handleSearch" />
          <div class="tabs">
              <div 
                v-for="(tab, index) in tabs" 
                :key="index"
                class="tab"
                :class="{active: tab.type === activeTab}"
                @click="changeType(tab, index)"
                >
                <span class="name">{{tab.label}}</span>
                <span class="num">{{`(${tab.num})`}}</span>
              </div>
            </div>
        </van-sticky>

        <div class="lists">
          <div class="swipe-con">
            <van-swipe ref="swipe" :show-indicators="false" :touchable="false">
              <van-swipe-item v-for="(tab, index) in tabs" :key="index">
                <List :activeType="tab.type" :searchValue="searchValue" @changeTotal="changeTotal" />
              </van-swipe-item>
            </van-swipe>
          </div>
        </div>
      </div>
    </Page>
  </div>
</template>

<script>
import {alarmTypeList} from '@/config/index.js'
import Page from '@/components/page.vue'
import Search from '@/components/search.vue'
import List from './components/list.vue'
import ProgressCanvas from './components/progressCanvas.vue'
export default {
  name: 'warningList',
  components:{
    Page,
    Search,
    List,
    ProgressCanvas,
  },
  data(){
    return {
      showRefresh: false,
      fromPath: '',
      alarmTypeList,
      notNumber: 0,
      allNumber: 0,
      activeTab: 0,
      tabs: [],
      searchValue: ''
    }
  },
  computed:{
  },
  created(){},
  beforeRouteEnter(to, from, next){
    next(vm => {
      vm.fromPath = from.path
    });
  },
  activated(){
    if (this.fromPath.includes('warningDetail')) {
      console.log('用缓存')
    } else {
      console.log('重新获取')
      this.init()
      setTimeout(() => {
        this.showRefresh = true
        this.initTab()
      }, 50)
    }
  },
  mounted(){
  },
  beforeDestroy(){
  },
  methods: {
    init(){
      this.showRefresh = false
      this.notNumber = 0
      this.allNumber = 0
      this.activeTab = 0
      this.tabs = []
      this.searchValue = ''
    },
    initTab(){
      this.tabs = this.alarmTypeList.map(n => {
        n.num = 0
        return n
      })
      this.getInitNumber()
    },
    async getInitNumber(){
      try {
        const allType = this.tabs.filter(n => n.type !== 0).map(n => n.type)
        const res = await this.$axios.post('/app/alarm/get/statistics', {
          alarmTypeList: allType
        })
        const {success, data, info} = res
        if (success) {
          this.handleCanvasNumber(data)
          this.handleTagNumber(data, allType)
        } else {
          this.$toast(info || '接口失败')
        }
      } catch (error) {
        this.$toast(error || '接口失败')
        console.log('/app/alarm/get/statistics_' + error)
      }
    },
    handleCanvasNumber(data){
      const read = data.alarmReadStatisticsVos || []
      let readMap = {}
      let total = 0
      read.forEach(r => {
        readMap[r.alarmState] = parseInt(r.countNum || 0)
        total = total + parseInt(r.countNum || 0)
      })
      // 1已读0未读 2过期 上面canvas全部：已读+未读+过期
      this.notNumber = readMap[0] || 0
      this.allNumber = total
    },
    handleTagNumber(data, allType){
      const typeNum = data.alarmTypeStatisticsVos || []
      let typeNumMap = {}
      let allNum = 0
      typeNum.forEach(t => {
        typeNumMap[t.alarmType] = t.countNum
        if (allType.includes(t.alarmType)) {
          allNum = allNum + parseInt(t.countNum)
        }
      })
      this.tabs = this.tabs.map(n => {
        n.num = typeNumMap[n.type] || 0
        return n
      })
      this.tabs[0].num = allNum
    },
    handleSearch(value){
      console.log(value)
      this.searchValue = value
      if (value) {
        this.tabs = this.tabs.map(n => {
          n.num = '0'
          return n
        })
      } else {
        this.initTab()
      }
      this.changeType(this.tabs[0], 0)
    },
    changeTotal({type, total}){
      if (type === 0) {
        this.tabs[0].num = total
        this.$set(this.tabs, 0, this.tabs[0])
      }
    },
    changeType(tab, index){
      this.activeTab = tab.type
      this.$refs.swipe && this.$refs.swipe.swipeTo(index);
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .reset-page .page-content {
  padding: 0;
}
.content {
  padding: 10px 15px;
  background: linear-gradient(360deg,rgba(0,165,255,0.00), #0988e5 26%, #0d7ad9 38%, #2D4BBA 100%);
  background-repeat: no-repeat;
  background-size: 100% 318px;
}

/deep/ .sticky-con {
  .van-sticky--fixed {
    width: calc(100% - 30px);
    left: 15px;
  }
}
.page-top {
  padding-top: 10px;
  margin-bottom: 15px;
  color: #ffffff;
  .rate {
    margin-top: 53px;
    margin-bottom: 5px;
    font-family: DINCondensed, DINCondensed-Bold;
    font-size: 40px;
    font-weight: 700;
    line-height: 30px;
  }
  .label {
    border: 1px solid #bfcbf8;
    border-radius: 4px;
    padding: 1px 7px 0;
    font-family: PingFangSC, PingFangSC-Regular;
    font-size: 10px;
    line-height: 14px;
  }
}
.description {
  margin-top: 15px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  &::before, &::after {
    content: '';
    display: inline-block;
    width: 80px;
    height: 5px;
    vertical-align: middle;
  }
  &::before {
    margin-right: 10px;
    background: url('~@/assets/svg/left_divider.svg') no-repeat;
    background-size: 80px 5px;
  }
  &::after {
    margin-left: 10px;
    background: url('~@/assets/svg/right_divider.svg') no-repeat;
    background-size: 80px 5px;
  }
}
.search {
  margin-bottom: 5px;
}
.lists {
  padding: 15px;
  padding-top: 0;
  background: #ffffff;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
.tabs {
  padding: 15px 15px 10px;
  border-bottom: 1px solid #eeeff4;
  height: 28px;
  white-space: nowrap;
  overflow-x: scroll;
  font-family: PingFangHK, PingFangHK-Semibold;
  font-weight: 600;
  line-height: 22px;
  background: #ffffff;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  
}
.tab {
  display: inline-block;
  margin-right: 10px;
  font-size: 14px;
  color: #b6b3c4;
  .name {
    margin-right: 8px;
    position: relative;
  }
  &.active {
    font-size: 16px;
    color: #21213b;
    .name::after {
      content: '';
      display: inline-block;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 24px;
      width: 20px;
      height: 4px;
      background: #0076ff;
      border-radius: 2px;
    }
  }
}
.swipe-con {
  overflow: hidden;
}
/deep/ .van-list__finished-text {
  line-height: 30px;
}
</style>