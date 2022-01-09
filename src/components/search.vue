<template>
  <div class="search">
    <input 
      v-model="value" 
      class="input" 
      type="text" 
      autocomplete="off" 
      :placeholder="placeholder"
      @keyup.enter="handleSearch" />
    <span class="input-prefix">
      <img class="search-icon" src="@/assets/svg/search_icon.svg" alt="">
    </span>
  </div>
</template>

<script>
export default {
  name: 'search',
  props: {
    placeholder: {
      type: String,
      default: '搜索'
    }
  },
  data(){
    return {
      value: ''
    }
  },
  methods: {
    handleSearch(){
      this.$emit('search', this.value)
    }
  },
}
</script>

<style lang="less" scoped>
.search {
  position: relative;
  display: inline-block;
  width: 100%;
}
.input {
  box-sizing: border-box;
  padding: 0 15px 0 34px;
  display: inline-block;
  height: 36px;
  width: 100%;
  background-color: #fff;
  background-image: none;
  border: 1px solid #fff;
  border-radius: 4px;
  color: #606266;
  font-size: inherit;
  outline: none;
  line-height: 36px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  &::-webkit-input-placeholder{
    color:#ccc;
  }
  &:focus {
  outline: none;
  border-color: #fff;
}
}
.input-prefix {
  position: absolute;
  left: 10px;
  height: 100%;
  text-align: center;
}

.search-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin: 10px 0 0;
}
</style>