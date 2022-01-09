<template>
  <div class="not">
    <p>not:</p>
    <p @click="jump">去列表</p>
  </div>
</template>
<script>
export default {
  data(){
    return {
    }
  },
  created(){
    
  },
  mounted(){

  },
  methods: {
    jump(){
      this.$router.push({path: '/list'})
    }
  },
  beforeDestroy(){}

}
</script>

<style lang="less" scoped>
.not {
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
}
</style>