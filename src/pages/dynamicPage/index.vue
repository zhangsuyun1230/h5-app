<template>
  <div id="listPage">
    <div class="title">
      <div class="icon">
        <img class="img" src="@/assets/svg/search_icon.svg" alt="">
      </div>
      <span class="text1">预警信息</span>
      <!-- <span class="text2">{{notReadNumber}} 条未读</span> -->
    </div>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="true"
      >
      <div class="list">
        <p v-if="finished && list.length === 0">
        </p>
        <div v-else class="mar-top">
          <div class="item"
            v-for="(item, index) in list"
            :key="item.alarmId + index"
            @click="jumpToDetail(item)">
            <div class="left">
              <img class="img" src="@/assets/svg/icon2.svg" alt="">
            </div>
            <div class="right">
              <p class="top">
                <span class="name">{{item.alarmType | formatType}}</span>
                <span class="time">{{item.alarmTime || '--'}}</span>
              </p>
              <p class="msg">{{item.alarmContent || '--'}}</p>
            </div>
            <div class="read" :class="{'not': item.alarmState === 0}"></div>
          </div>
        </div>
      </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import {alarmTypeMap} from '@/config/index.js'
export default {
  name: 'dynamicPage',
  data(){
    return {
      fromPath: '',
      notReadNumber: 0,
      list: [],
      pageIndex: 1,
      pageSize: 10,
      loading: false,
      finished: false,
      refreshing: false,
    }
  },
  filters:{
    formatType(type) {
      return alarmTypeMap[type] || '--'
    }
  },
  created(){
  },
  beforeRouteEnter(to, from, next){
    next(vm => {
      vm.fromPath = from.path
    });
  },
  activated(){
    console.log('activated') 
    if (this.fromPath.includes('warningDetail')) {
      console.log('用缓存')
    } else {
      console.log('重新获取')
      this.onLoad()
    }
  },
  deactivated(){
    // const listScrollTop = document.getElementById('listPage').scrollTop
    console.log('deactivated')
  },
  mounted(){
    console.log('mounted')
    // const dom = document.querySelector('#listPage')
    // dom.addEventListener('scroll', () => {
    //   console.log(dom.scrollTop)
    // })
    window.addEventListener('scroll', () => {
      console.log(document.documentElement && document.documentElement.scrollTop)
    })
  },
  beforeDestroy(){
    console.log('beforeDestroy')
  },
  methods: {
    jumpToDetail(item){
      this.$router.push({path: `/warningDetail/${item.alarmId}`})
    },
    async onRefresh() {
      this.list = [];
      this.finished = false;
      this.pageIndex = 1;
      await this.onLoad();
      this.refreshing = false;
    },
    async onLoad() {
      try {
        this.loading = true;
        const param = {
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
        }
        const res = await this.$axios.post('/app/alarm/get/list', param)
        const {success, data, info} = res
        if (success) {
          const list = data.list || []
          this.list.push(...list);
          // 数据全部加载完成
          if (this.pageIndex === data.lastPage || data.lastPage === 0) {
            this.finished = true;
          }
        } else {
          this.$toast(info || '接口失败')
        }
      } catch (error) {
        this.finished = true;
        this.$toast(error || '获取列表失败')
        console.log('alarm/get/list_' + error)
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
.title {
  margin: 10px 0 15px;
  display: flex;
  align-items: center;
  .icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: linear-gradient(138deg,#3c9ffd 7%, #2062f9 97%);
    border-radius: 3px;
  }
  .img {
    display: inline-block;
    width: 8px;
    height: 10px;
  }
  .text1 {
    margin: 0 10px 0 5px;
    font-family: PingFangSC, PingFangSC-Semibold;
    font-size: 16px;
    font-weight: 600;
    color: #23243f;
    line-height: 22px;
  }
  .text2 {
    font-family: PingFangSC, PingFangSC-Regular;
    font-size: 14px;
    font-weight: 400;
    color: #8f8f92;
    line-height: 20px;
  }
}
.item {
  margin-bottom: 5px;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border-radius: 2px;
  .left {
    box-sizing: border-box;
    width: 39px;
    padding: 8px;
    background: linear-gradient(135deg,#f76987, #e13e50);
    .img {
      display: block;
      width: 23px;
      height: 23px;
    }
  }
  .right {
    margin-left: 10px;
    flex: 1;
    font-family: PingFangSC, PingFangSC-Regular;
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    overflow: hidden;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .read {
    margin-left: 10px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    &.not {
       background: #e44357;
    }
  }
  .name {
    font-family: PingFangSC, PingFangSC-Semibold;
    font-size: 14px;
    font-weight: 600;
    color: #23243f;
    line-height: 20px;
  }
  .time {
    color: #acb0b6;
  }
  .msg {
    width: 100%;
    margin-top: 3px;
    height: 17px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #808080;
    overflow: hidden;
  }
}
/deep/ .van-list__finished-text {
  line-height: 30px;
}
</style>