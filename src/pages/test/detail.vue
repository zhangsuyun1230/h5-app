<template>
  <div>
    <p>detail:</p>
    <p>data: {{data}}</p>
    <p @click="jump">去列表</p>
  </div>
</template>
<script>
export default {
  data(){
    return {
      data: 0
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