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

// 自定义面包屑导航组件
import CusBread from '@/components/cusBread.vue'

// // 添加请求拦截器
// axios.interceptors.request.use(function (config) {
//   // 在发送请求之前做些什么
//   return config;
// }, function (error) {
//   // 对请求错误做些什么
//   return Promise.reject(error);
// });
// 导入封装好的Vue axios插件
import HttpServer from '@/http.js'

// 导入日期处理格式
import moment from 'moment'
Vue.component(CusBread.name, CusBread)
Vue.use(HttpServer)
// 注册过滤器
Vue.filter('frmdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
