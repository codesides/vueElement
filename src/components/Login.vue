<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="login_logo">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" status-icon class="login_form" :rules="rules" label-width="0">
        <!-- 名称 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入名称"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            show-password
            placeholder="请输入密码"
            prefix-icon="el-icon-search"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="formReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length > 15 || value.length < 6) {
        callback(new Error("密码是6到15位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    formReset() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        const {data: res} = await this.$http.post('login', this.loginForm)
        console.log(res);
        if (res.meta.status !== 200) return this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error'
        })
        this.$message.success('登录成功');
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('./home')
      })
    }
  }
};
</script>
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.login_logo {
  width: 130px;
  height: 130px;
  background-color: #fff;
  padding: 10px;
  border-radius: 50%;
  border: 1px solid #eee;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    height: 100%;
    background-color: #eee;
    border-radius: 50%;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>