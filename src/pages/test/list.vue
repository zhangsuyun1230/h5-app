<template>
  <div id="list">
    <p class="fixed">list:</p>
    <p>data: {{data}}</p>
    <p @click="jumphome">去shouye</p>
    <p @click="jump">去详情</p>
    <p v-for="i in 30" :key="i + 1" >{{i}}</p>
  </div>
</template>
<script>
export default {
  data(){
    return {
      data: 0,
      fromPath: ''
    }
  },
  created(){
    console.log('created-list')
    this.data = 111
  },
  mounted(){
    this.$nextTick(() => {
      const dom = document.querySelector('#list')
      console.log(dom)
       dom.addEventListener('scroll', () => {
        console.log(dom.scrollTop)
      })
      window.addEventListener('scroll', () => {
        console.log(document.documentElement && document.documentElement.scrollTop)
      })
    })
  },
  beforeRouteEnter(to, from, next){
    console.log(to, from, 1)
    next(vm => {
      vm.fromPath = from.path
    });
  },

  activated(){
    console.log('activated-list') 
    if (this.fromPath.includes('detail')) {
      console.log('用缓存')
    } else {
      console.log('重新获取')
    }
  },
  deactivated(){
    console.log('deactivated-list')
  },
  methods: {
    jumphome(){
      this.$router.push({path: '/not'})
    },
    jump(){
      this.$router.push({path: '/detail'})
    }
  },
  beforeDestroy(){}
}
</script>

<style lang="less" scoped>
#list {
  
}
.fixed {
  position: fixed;
  top: 0;
}
</style>