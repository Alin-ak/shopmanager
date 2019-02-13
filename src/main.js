// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// 导入第三方组件文件
import ElementUI from 'element-ui'
// 导入样式文件
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/reset.css'
import App from './App'
import router from './router'
// 导入axios
import axios from 'axios'
// 设置基础url
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// Vue原型上添加axios属性
Vue.prototype.$http = axios

Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
