import axios from 'axios'
const HttpServer = {}
HttpServer.install = function (Vue) {
  // 1. 添加全局方法或属性
  // 2. 添加全局资源
  // 3. 注入组件
  // 4. 添加实例方法
  // 导入axios
  // 设置基础url
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  // 请求拦截器
  axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // console.log(config)
    if (config.url !== 'login') {
      // 如果请求的路径不是login 那么设置请求头
      const AUTH_TOKEN = localStorage.getItem('token')
      config.headers['Authorization'] = AUTH_TOKEN
    }
    return config
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  })
  // 设置token

  // Vue原型上添加axios属性
  Vue.prototype.$http = axios
}

export default HttpServer
