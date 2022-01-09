import Vue from 'vue'
import router from './router';
import store from './store';
import App from './App.vue'
import service from './utils/axios'
// import VConsole from 'vconsole/dist/vconsole.min.js';
// const vConsole = new VConsole();
// console.log(vConsole)

import { 
  Icon,
  List,
  PullRefresh,
  Sticky,
  Form,
  Field,
  Button,
  Swipe,
  SwipeItem,
  Popup,
  DatetimePicker,
  Collapse, CollapseItem,
  Toast,
  Loading,
  Empty,
} from 'vant';
import '@/assets/css/reset.css';
Vue.use(Icon);
Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Sticky);
Vue.use(Form);
Vue.use(Field);
Vue.use(Button);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Popup);
Vue.use(DatetimePicker);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Toast);
Vue.use(Loading);
Vue.use(Empty);

Vue.config.productionTip = false;
Vue.prototype.$axios = service

// 添加Fastclick移除移动端点击延迟
import FastClick from 'fastclick'
// //FastClick的ios点击穿透解决方案
// FastClick.prototype.focus = function (targetElement) {
//   let length;
//   if (targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
//       length = targetElement.value.length;
//       targetElement.focus();
//       targetElement.setSelectionRange(length, length);
//   } else {
//       targetElement.focus();
//   }
// };
// FastClick.attach(document.body)
// 解决移动端点击延迟200ms的问题
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body);
  }, false);
}

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
