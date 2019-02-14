<template>
    <div class="login-wrap">
        <el-form class="login-form" label-position="top" label-width="80px" :model="formdata">
        <h2>用户登录</h2>
        <el-form-item label="用户名">
            <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-button
        @click=handleLogin()
        class="login-btn" type="primary">登录</el-button>
        </el-form>
    </div>
</template>

<script>
export default {
  data () {
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin () {
      // async await 让异步代码看着跟同步一样 好处：没有函数嵌套
      // 在异步操作的前面加await 在离异步操作最近的函数前加async
      const res = await this.$http.post(`login`, this.formdata)

      const {data: {data: {token}, meta: {msg, status}}} = res
      if (status === 200) {
        // 成功让其跳转 并将token保存到 localStorage中 存值
        localStorage.setItem('token', token)
        // 取值    const adminT = localStorage.getItem("token")
        this.$router.push({
          name: 'home'
        })
      } else {
        // 失败提示框
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style>
    .login-wrap{
        height: 100%;
        background-color: #324152;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .login-form{
        background-color: #fff;
        border-radius: 5px;
        width: 400px;
        padding: 30px;
    }
    .login-btn{
        width: 100%;
    }
</style>
