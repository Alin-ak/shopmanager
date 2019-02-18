<template>
  <el-card>
    <CusBread lv1="权限管理" lv2="权限列表"></CusBread>
  </el-card>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 获取所有权限列表数据 rights/:type 值: list 或 tree , list列表显示权限, tree树状显示权限
    async getTableData () {
      const res = await this.$http.get(`rights/list`)
      const {
        data,
        meta: { status }
      } = res.data
      //   console.log(data);
      if (status === 200) {
        //   将数据赋值给data中的数据
      }
    }
  }
}
</script>

<style>
</style>
