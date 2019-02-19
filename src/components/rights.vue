<template>
  <el-card>
     <!-- 面包屑导航 -->
    <CusBread lv1="权限管理" lv2="权限列表"></CusBread>

    <!-- 表格 -->
     <el-table class="mr" :data="list" style="width: 100%" border height="400">
      <el-table-column type="index" label="#" width="100"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column prop="level" label="层级" min-width="120">
        <template slot-scope="scope">
           <span v-if="scope.row.level==='0'">一级</span>
           <span v-if="scope.row.level==='1'">二级</span>
           <span v-if="scope.row.level==='2'">三级</span>
      
        </template>   
      </el-table-column>
       
      
      </el-table>

  </el-card>
</template>

<script>
export default {
  data () {
    return {
        list:[]
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
       console.log(data);
      if (status === 200) {
        //   将数据赋值给data中的数据
        this.list = data
      }
    }
  }
}
</script>

<style>
.mr{
  margin-top: 20px;
}
</style>
