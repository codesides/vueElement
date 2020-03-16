<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <el-table stripe border :data="userList">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeUserState(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-button
              @click="showEditDialog(scope.row.id)"
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              @click="deleteUserConfirm(scope.row.id)"
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="角色分配"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogClosed"
    >
      <!-- 表单区域 -->
      <el-form
        ref="dialogFormRef"
        :model="dialogForm"
        status-icon
        :rules="rules"
        label-width="70px"
      >
        <!-- 名称 -->
        <el-form-item prop="username" label="用户名">
          <el-input
            clearable
            v-model="dialogForm.username"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password" label="密码">
          <el-input
            clearable
            v-model="dialogForm.password"
            show-password
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item prop="email" label="邮箱">
          <el-input
            clearable
            v-model="dialogForm.email"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <!-- 手机 -->
        <el-form-item prop="mobile" label="手机">
          <el-input
            clearable
            v-model="dialogForm.mobile"
            placeholder="请输入手机"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDialog">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 表单区域 -->
      <el-form
        ref="editDialogFormRef"
        :model="editForm"
        status-icon
        :rules="rules"
        label-width="70px"
      >
        <!-- 名称 -->
        <el-form-item label="用户名">
          <el-input disabled v-model="editForm.username"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item prop="email" label="邮箱">
          <el-input
            clearable
            v-model="editForm.email"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <!-- 手机 -->
        <el-form-item prop="mobile" label="手机">
          <el-input
            clearable
            v-model="editForm.mobile"
            placeholder="请输入手机"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditDialog">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="角色分配"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="roleDialogClosed"
    >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
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
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      dialogForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }]
      },
      editDialogVisible: false,
      editForm: {},
      setRoleDialogVisible: false,
      userInfo: {},
      roleList: [],
      selectRoleId: ""
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    async changeUserState(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功");
    },
    dialogClosed() {
      this.$refs.dialogFormRef.resetFields();
    },
    submitDialog() {
      this.$refs.dialogFormRef.validate(async valid => {
        const { data: res } = await this.$http.post("users", this.dialogForm);
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.$message.success("添加用户成功");
        this.dialogVisible = false;
        this.getUserList();
      });
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("users/" + id);
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editDialogFormRef.resetFields();
    },
    submitEditDialog() {
      this.$refs.editDialogFormRef.validate(async valid => {
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          this.editForm
        );
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.editDialogVisible = false;
        this.getUserList();
        this.$message.success("修改用户信息成功");
      });
    },
    async deleteUserConfirm(id) {
      const result = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (result !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete("users/" + id);
      console.log(res);

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success("删除成功!");
      this.queryInfo.pagenum = 1;
      this.getUserList();
    },
    async setRole(role) {
      this.setRoleDialogVisible = true;
      this.userInfo = role;
      const { data: res } = await this.$http.get("roles");
      console.log(res);

      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.roleList = res.data;
    },
    async saveRoleBtn() {
      if (!this.selectRoleId) return this.$message.error("请选择角色权限");
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectRoleId
        }
      );
      if (res.meta.status !== 200)
        return this.$message.error("分配角色权限失败");
      this.$message.success("分配角色权限成功");
      this.getUserList();
      this.setRoleDialogVisible = false;
    },
    roleDialogClosed() {
      this.userInfo = {};
      this.selectRoleId = "";
    }
  }
};
</script>
<style scoped></style>
