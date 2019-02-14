<template>
 <el-container class="container">
  <el-header class="header">
      <el-row>
         <el-col :span="4">
              <img src="@/assets/logo.png" alt="">
         </el-col>
         <el-col :span="19" class="middle">
              <h2>电商后台管理系统</h2>
        </el-col>
         <el-col :span="1">
              <a class="exit" href="#">退出</a>
        </el-col>
      </el-row>
  </el-header>
  <el-container>
    <el-aside class="aside" width="200px">Aside</el-aside>
    <el-main class="main">Main</el-main>
  </el-container>
</el-container>
</template>

<script>
export default {

}
</script>

<style>
.container{
    background-color: pink;
    height: 100%;
}
.aside{
    background-color: brown;
}
.main{
    background-color: blueviolet;
}
.header{
    background-color: #B3C0D1
}
.middle{
    line-height: 59px;
    text-align: center;
    color: #ddd;
}
.exit{
    text-decoration: none;
    line-height: 59px;
}
</style>
