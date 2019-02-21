<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <img src="@/assets/logo.png" alt>
        </el-col>
        <el-col :span="19" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <a class="exit" href="#" @click.prevent="exitHome()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <!-- 侧边栏导航 -->
        <el-menu router unique-opened default-active="2" class="el-menu-vertical-demo">
          <!-- 1 -->
          <el-submenu :index="item.order+''" v-for="(item,i) in list" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
              <el-menu-item :index="item1.path" v-for="(item1,i) in item.children" :key="item1.id">
                <i class="el-icon-menu"></i>
                <span>{{item1.authName}}</span>
              </el-menu-item>
           </el-submenu>
           <!-- 2 -->
            
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              <span>用户列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 2 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="1-2">
              <i class="el-icon-menu"></i>
              <span>角色列表</span>
            </el-menu-item>
            <el-menu-item index="1-2">
              <i class="el-icon-menu"></i>
              <span>权限列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 3 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="1-2">
              <i class="el-icon-menu"></i>
              <span>商品列表</span>
            </el-menu-item>
            <el-menu-item index="1-2">
              <i class="el-icon-menu"></i>
              <span>分类参数</span>
            </el-menu-item>
            <el-menu-item index="1-2">
              <i class="el-icon-menu"></i>
              <span>商品分类</span>
            </el-menu-item>
          </el-submenu>
          <!-- 4 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="1-2">
              <i class="el-icon-menu"></i>
              <span>订单列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 5 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="1-2">
              <i class="el-icon-menu"></i>
              <span>数据报表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <!-- users组件 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</el-container>
<!-- 哦 -->
</template>

<script>
export default {
  beforeMount () {
    
  },
  data(){
    return {
      list:[]
    }
  },
  created(){
    this.changeNav()
  },
  methods: {
    // 动态导航 获取当前用户权限 menus
    async changeNav(){
      const res = await this.$http.get(`menus`)
      const {data,meta:{status}} = res.data
      if(status === 200) {
        this.list = data
      }
    },

    exitHome () {
      if (confirm('确定要退出吗?')) {
        // 跳转到登陆页
        this.$router.push({
          name: 'login'
        })
        localStorage.clear()
        // 同时清空token
      }
    }
  }
}
</script>

<style>
.container {
  height: 100%;
}
/* .aside{
    background-color: brown;
}
.main{
    background-color: blueviolet;
} */
.header {
  background-color: #b3c0d1;
}
.middle {
  line-height: 59px;
  text-align: center;
  color: #fff;
}
.exit {
  text-decoration: none;
  line-height: 59px;
}
</style>
