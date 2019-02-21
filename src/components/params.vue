<template>
  <el-card class="box">
    <cus-bread lv1="商品管理" lv2="商品列表"></cus-bread>
    <el-alert title="注意，只允许为第三级分类参数" type="warning" show-icon class="mr" :closable="false"></el-alert>

    <el-form label-position="left" :model="form" class="form" label="请添加分类">
      <el-form-item label="请选择商品分类">
        <!-- 级联选择器 -->
        <el-cascader
          :show-all-levels="false"
          :props="defaultProp"
          expand-trigger="hover"
          :options="options"
          v-model="selectedOptions"
          @change="handleChange"
          clearable
        ></el-cascader>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
    data () {
        
    },
    methods : {

        handleChange () {

        }
    }
};
</script>

<style>
.box {
  height: 100%;
}
.mr {
  margin: 15px 0;
}
</style>
