<template>
  <div class="list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="true"
      >
      <div>
        <p v-if="finished && list.length === 0">
        </p>
        <div v-else class="mar-top">
           <ListItem v-for="item in list" :key="item.id" :itemData="item" />
        </div>
      </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ListItem from './listItem.vue'
import {mapMutations} from 'vuex'
export default {
  name: 'list',
  components: {
    ListItem
  },
  props: {
    activeType: {
      type: Number,
      default: 0
    },
    searchValue: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [],
      pageIndex: 1,
      pageSize: 10,
      loading: false,
      finished: false,
      refreshing: false,
    };
  },
  watch: {
    searchValue(){
      this.onRefresh()
    }
  },
  created(){
    this.onLoad()
  },
  methods: {
    ...mapMutations(['set_cache_page']),
    async onRefresh() {
      this.list = [];
      this.finished = false;
      this.pageIndex = 1;
      await this.onLoad(true);
      this.refreshing = false;
    },
    async onLoad(onlyAllType = false) {
      // onlyAllType 输入imsi查询时，只查‘全部’分类
      if (onlyAllType && this.activeType !== 0 && this.searchValue) {
        return
      }
      try {
        this.loading = true;
        let params = {
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
        }
        if (this.searchValue) {
          params.imsi = this.searchValue
        }
        if (this.activeType) {
          params.alarmTypeList = [this.activeType]
        }
        const res = await this.$axios.post('/app/alarm/get/list', params)
        const {success, data, info} = res
        if (success) {
          const list = data.list || []
          this.list.push(...list);
          // 数据全部加载完成
          if (this.pageIndex === data.lastPage || data.lastPage === 0) {
            this.finished = true;
          }
          if (onlyAllType && this.searchValue) {
            // 把搜索内容的全部分类总条数回显到统计数据中
            this.$emit('changeTotal', {type: this.activeType, total: data.total})
          }
        } else {
          this.$toast(info || '接口失败')
        }
      } catch (error) {
        this.finished = true;
        this.$toast(error || '接口失败')
        console.log('/app/alarm/get/list_' + error)
      } finally {
        // 加载状态结束
        this.loading = false;
        this.pageIndex++;
      }
    },
  },
}
</script>

<style lang="less" scoped>
.list {
  max-height: calc(100vh - 54px - 36px - 55px);
  max-height: calc(var(--vh, 1vh) * 100 - 54px - 36px - 55px);
  overflow-y: scroll;
}
.mar-top {
  margin-top: 10px;
}
</style>