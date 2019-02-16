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
          <el-switch @change='currentState(scope.row)' v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="180">
        <template slot-scope="scope">
        <el-button
        @click='showEditUser(scope.row)' type="primary"  icon="el-icon-edit" circle size="mini"></el-button>
        <el-button
        @click='delUser(scope.row)' type="danger"  icon="el-icon-delete" circle size="mini"></el-button>
        <el-button
        @click='showRole(scope.row)' type="success" icon="el-icon-check" circle size="mini"></el-button>
        </template>

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
    <!-- 添加对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
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
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()" >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑弹框 -->
     <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input disabled v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click='editAddUser()' >确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
  <el-form :model="formdata" label-width="80px">
    <el-form-item label="用户名" >
      {{formdata.username}}
    </el-form-item>

    <!-- 下拉 -->
    <el-form-item label="角色">
      {{selectVal}}
      <el-select v-model="selectVal" placeholder="请选择角色">
         <el-option disabled label="请选择" :value="-1"></el-option>
        <!-- label控制能到的文本 -->
        <el-option v-for= "(item,i) in roles" :key="i" :label="item.roleName" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
    <el-button type="primary" @click="changeRole()" >确 定</el-button>
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
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      formdata: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      selectVal: -1,
      roles: [],
      userId: -1

    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 点击确定后分配角色 users/:id/role
    async changeRole () {
      const res = await this.$http.put(`users/${this.userId}/role`, {
        rid: this.selectVal
      })
      console.log(res)
      const {meta: {msg, status}} = res.data
      if (status === 200) {
        this.$message.success(msg)
      }
      this.dialogFormVisibleRole = false
    },
    // 点击对勾时弹出角色对话框
    async showRole (user) {
      this.userId = user.id
      this.dialogFormVisibleRole = true
      this.formdata = user
      // 获取数据 遍历角色数组
      const res = await this.$http.get(`roles`)
      // console.log(res)
      this.roles = res.data.data

      const res2 = await this.$http.get(`users/${user.id}`)
      // console.log(res2)
      this.selectVal = res2.data.data.rid
    },

    // switchevents 状态开关 change
    async currentState (user) {
      // 发送请求 获取用户状态 users/:uId/state/:type
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      const {meta: {msg, status}} = res.data
      if (status === 200) {
        this.$message.success(msg)
      }
    },
    // 点击对话框确定信息后修改数据
    async editAddUser () {
      const res = await this.$http.put(`users/${this.formdata.id}`)
      const {meta: {msg, status}} = res.data
      if (status === 200) {
        this.$message.success(msg)
        this.dialogFormVisibleEdit = false
      }
    },
    // 点击编辑时显示对话框
    showEditUser (user) {
      this.dialogFormVisibleEdit = true
      this.formdata = user
    },
    //   点击操作中的删除绑定事件
    delUser (user) {
      this.$confirm('确定要删除这条数据吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 进到这说明确定要删除 发送请求
          const res = await this.$http.delete(`users/${user.id}`)
          const {meta: {msg, status}} = res.data
          console.log(status)
          if (status === 200) {
            // 说明删除成功 重新渲染数据
            this.$message.success(msg)
            this.getTableData()
          }
        })
        .catch(() => {
          this.$message.info('取消删除')
        })
    },

    //   点击对话框确定添加用户
    async addUser () {
      const res = await this.$http.post(`users`, this.formdata)
      const {meta: {msg, status}} = res.data
      if (status === 201) {
        this.$message.success(msg)
        this.getTableData()
        this.formdata = {}
      }
      this.this.dialogFormVisibleAdd = false
    },

    //   点击添加用户弹出对话框
    showAddUser () {
      this.dialogFormVisibleAdd = true
    },
    // 当页数改变时触发事件
    handleCurrentChange (val) {
      //   页数改变事件
      this.pagenum = 1
      this.pagenum = val
      this.getTableData()
    },
    // 当条目改变时触发
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
