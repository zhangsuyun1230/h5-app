<template>
  <div class="select-personnel">
    <div class="person" @click="showPopup = true">
      <div v-if="personNember" class="number-wrap">
        <span>{{personNember}}</span>
        <img src="@/assets/svg/clear_icon.svg" alt="" @click.stop="clearPerson">
      </div>
      <span v-else class="tip">请输入号码（必填）</span>
      <van-icon class="right-icon" name="arrow" />
    </div>

    <van-popup 
      v-model="showPopup" 
      position="bottom"
      class="person-popup"
      >
      <Arrow
        class="arrow-top"
        @change="changeShowPopup" 
        :showContent="showPopup" 
      />
      <p class="title">手动输入号码</p>
      <van-field 
        class="field border-bottom" 
        v-model="inputVal" 
        placeholder="请输入号码"
        clearable
        />
      <p class="title mar">选择重点人员</p>
      <van-collapse 
        v-if="types.length"
        class="collapse"
        v-model="activeLabelType"
        @change="changeCollapse"
        accordion>
        <van-collapse-item 
          v-for="item in types"
          :key="item.id"
          :name="item.id"
          :title="item.tagName" 
          :disabled="inputVal !== ''"
        >
          <van-loading text-color="#0094ff" v-show="item.loading" />
          <div
            v-show="!item.loading && item.list && item.list.length"
            class="item"
            v-for="person in item.list"
            :class="{active: selectVal === person}"
            :key="person.id"
            @click="changeSelectVal(item, person)"
            >
            {{person.name ? `${person.name}（${person.imsi}）` : person.imsi}}
          </div>
          <div v-show="!item.loading && item.list && item.list.length===0" class="item">暂无数据</div>
        </van-collapse-item>
      </van-collapse>
      <div class="btn" @click="confirm"><span class="text">确定</span></div>
    </van-popup>
  </div>
</template>

<script>
import Arrow from "@/components/arrow.vue"
export default {
  name: 'SelectPersonnel',
  components:{
    Arrow
  },
  data(){
    return {
      personNember: '',
      showPopup: false,
      inputVal: '', // todo 460138490300383 // todo:460001394273364
      selectVal: null,
      activeLabelType: null,
      types: [],
    }
  },
  created(){
    this.getTag()
  },
  watch:{
    personNember(value){
      this.$emit('change', value)
    }
  },
  methods: {
    async getTag(){
      try {
        const res = await this.$axios.post('/app/personnelFiles/get/getTag', {})
        const {success, data, info} = res
        if (success) {
          this.types = data || []
        } else {
          this.$toast(info || '接口失败')
        }
      } catch (error) {
        this.$toast(error || '接口失败')
        console.log('getTag_' + error)
      }
    },
    changeCollapse(val){
      const item = this.types.find(n => n.id === val)
      const index = this.types.findIndex(n => n.id === val)
      if (item.list && item.list.length){
        return
      }
      this.getByTag(val, item, index)
    },
    async getByTag(val, item, index){
      try {
        item.loading = true
        const res = await this.$axios.post('/app/personnelFiles/get/getByTag', {tagId: val})
        const {success, data, info} = res
        if (success) {
          item.list = data.personnelFiles || []
        } else {
          this.$toast(info || '接口失败')
        }
        item.loading = false
        this.$set(this.types, index, item)
      } catch (error) {
        item.loading = false
        this.$toast(error || '接口失败')
        console.log('/getByTag_' + error)
      }
    },
    getData(){
      return this.personNember
    },
    clearPerson(){
      this.personNember = ''
      this.inputVal = ''
      this.selectVal = null
    },
    changeShowPopup(){
      this.showPopup = !this.showPopup
    },
    changeSelectVal(item, person){
      console.log(item, person)
      this.inputVal = ''
      this.selectVal = person
    },
    confirm(){
      let val = ''
      if (this.selectVal) {
        const person = this.selectVal
        val = person.name ? `${person.name}（${person.imsi}）` : person.imsi
      } else {
        val = this.inputVal
      }
      this.personNember = val
      this.showPopup = false
    }
  }
}
</script>

<style lang="less" scoped>
.border-bottom {
  border-bottom: 1px solid #f0f1f1;
}
.person {
  box-sizing: border-box;
  padding: 12px 0;
  font-size: 14px;
  line-height: 20px;
  border-bottom: 1px solid #f0f1f1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .right-icon {
    margin-left: 10px;
    color: #a1a1a4;
    font-size: 16px;
  }
  .number-wrap {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: PingFangSC, PingFangSC-Semibold;
    font-weight: 600;
    color: #23243f;
    img {
      display: block;
      width: 14px;
      height: 14px;
    }
  }
  .tip {
    font-family: PingFangSC, PingFangSC-Regular;
    color: #a1a1a4;
  }
}
.person-popup {
  box-sizing: border-box;
  max-height: calc(100% - 100px);
  padding: 10px 20px 20px;
  // .arrow-top {
  //   position: relative;
  // }
  .title {
    font-family: PingFangSC, PingFangSC-Semibold;
    font-size: 15px;
    font-weight: 600;
    color: #656567;
    line-height: 21px;
  }
  .mar {
    margin: 19px 0 9px;
  }
  .field {
    padding: 8px 0 10px;
    &::after {
      display: none;
    }
  }
  /deep/ .collapse {
    padding-bottom: 62px;
    .van-cell {
      padding: 12px 0;
      font-family: PingFangSC, PingFangSC-Semibold;
      font-size: 14px;
      font-weight: 600;
      color: #23243f;
      line-height: 20px;
    }
    &::after {
      border-color: #f0f1f1;
    }
    .van-collapse-item__content {
      padding: 0;
    }
    .van-collapse-item--border::after, .van-collapse-item__title::after {
      left: 0;
      right: 0;
      border-color: #f0f1f1;
    }
    .van-collapse-item__wrapper {
      width: calc(100% + 40px);
      margin-left: -20px;
    }
    .item {
      padding: 12px 20px 13px;
      background: #f3f5f8;
      font-family: PingFangSC, PingFangSC-Regular;
      font-size: 14px;
      color: #23243f;
      line-height: 20px;
      &.active {
        background: #e9ebee;
      }
    }
  }
  .btn {
    position: fixed;
    bottom: 0;
    padding-bottom: 20px;
    padding-top: 10px;
    width: 100%;
    left: 0;
    border-radius: 2px;
    font-family: PingFangSC, PingFangSC-Semibold;
    text-align: center;
    background: #fff;
    .text {
      display: inline-block;
      width: calc(100% - 40px);
      line-height: 42px;
      font-size: 17px;
      font-weight: 600;
      color: #ffffff;
      letter-spacing: 5px;
      background: #2d4bba;
    }
  }
}
</style>