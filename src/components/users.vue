<template>
  <el-card>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="#">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 输入框 -->
    <el-row class="margin-T">
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" plain @click="showAddUser()">添加用户</el-button>
    </el-row>
    <!-- 表格    -->
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="id" label="#" width="100"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
      <el-table-column label="创建日期" width="180">
        <template slot-scope="scope">{{scope.row.create_time | frmdate}}</template>
      </el-table-column>
      <el-table-column prop="address" label="用户状态" width="180">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="180">
        <el-button type="primary" icon="el-icon-edit" circle size="mini"></el-button>
        <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>
        <el-button type="success" icon="el-icon-check" circle size="mini"></el-button>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[1,2,3,4]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      list: [],
      pagenum: 1,
      pagesize: 2,
      total: -1,
      dialogFormVisible: false,
      formdata: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      }
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    //   点击添加用户弹出对话框
    showAddUser () {
      this.dialogFormVisible = true
    },
    handleCurrentChange (val) {
      //   页数改变事件
      this.pagenum = 1
      this.pagenum = val
      this.getTableData()
    },
    handleSizeChange (val) {
      // 条数改变事件
      this.pagesize = 1
      this.pagesize = val
      this.getTableData(val)
    },
    // 获取数据
    async getTableData () {
      // 必须携带token
      const AUTH_TOKEN = localStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      )
      const {
        data,
        meta: { status }
      } = res.data
      console.log(data)
      if (status === 200) {
        // 说明有token 赋值给list
        this.list = data.users
        this.total = data.total
      }
    }
  }
}
</script>

<style>
.input-with-select {
  width: 400px;
}
.margin-T {
  margin-top: 20px;
}
</style>
