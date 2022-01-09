import Vue from 'vue'
import Router from 'vue-router'
import config from './config'
// import store from '../store'
Vue.use(Router)
// 解决相同路由导致报错问题
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: config
})

//路由守卫 todo
// router.beforeEach((to, from, next) => {
//   const userData = store.state.UserPage.userData
//   if (!userData.name) {
//     console.log(userData.name, 22)
// //     // router.push()
// //     next('/login')
//   } else {
//     next()
//   }
// })
// router.afterEach((to, from) => {
//   console.log(to)
// })

export default router
