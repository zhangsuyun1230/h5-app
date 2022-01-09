<template>
  <div id="app">
    <keep-alive>
      <!-- 需要缓存的视图组件 --> 
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <!-- 不需要缓存的视图组件 -->
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  mounted(){
    // 解决移动端100vh问题
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    let vh = window.innerHeight * 0.01
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`)

    // We listen to the resize event
    window.addEventListener('resize', () => {
      // We execute the same script as before
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    })
  },
}
</script>

<style lang="less" scoped>
html, body, #app {
  width: 100%;
  height: 100%;
}
* { touch-action: none; }
</style>
