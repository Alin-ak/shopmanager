import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Home from '@/components/home'
import Users from '@/components/users.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children:[{
        name:'users',
        path:'/users',
        component:Users
      }]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
