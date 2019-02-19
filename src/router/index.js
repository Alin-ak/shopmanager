import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Home from '@/components/home'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
import { MessageBox, Message } from 'element-ui';
import Goods from '@/components/goods.vue'
import Goodsadd from '@/components/goodsadd.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        },
        {
          name: 'roles',
          path: '/roles',
          component: Roles
        },
        {
          name: 'goods',
          path: '/goods',
          component: Goods
        },
        {
          name: 'goodsadd',
          path: '/goodsadd',
          component: Goodsadd
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
// if (!localStorage.getItem('token')) {
//   // 让其跳转到登陆页
//   this.$router.push({
//     name: 'login'
//   })
//   // 提示用户登陆
//   this.$message.warning('请先登录')
// }
router.beforeEach((to, from, next) => {
    // 如果他要去登录，那么让他去
    if(to.name==="login") {
      next()
    }else{
      if (!localStorage.getItem('token')) {
        Message.success('滚去登录')
        router.push({
          name:'login'
        })
        return 
    }
    next()
  }
})
export default router