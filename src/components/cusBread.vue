<template>
    <!-- 自定义封装面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="#">{{lv1}}</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{lv2}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
  name: 'CusBread',
  props: ['lv1', 'lv2']
}
</script>

<style>

</style>
