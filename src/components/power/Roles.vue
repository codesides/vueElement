<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bbottom', i1 === 0 ? 'btop' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightsById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'btop']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="8">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightsById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightsById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="getRights(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="分配权限"
      :visible.sync="rightsDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        :data="rightsList"
        :props="rightsProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="deKeys"
        ref="rightsTreeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      rolesList: [],
      rightsDialogVisible: false,
      rightsList: [],
      rightsProps: {
        children: "children",
        label: "authName"
      },
      deKeys: [],
      roleId: ""
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      console.log(res);
      this.rolesList = res.data;
    },
    async removeRightsById(roles, rightsId) {
      const result = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
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
      const { data: res } = await this.$http.delete(
        `/roles/${roles.id}/rights/${rightsId}`
      );
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("权限删除失败");
      roles.children = res.data;
    },
    async getRights(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get("/rights/tree");
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取权限列表失败");
      this.getDefaultKeys(role, this.deKeys);
      this.rightsDialogVisible = true;
      this.rightsList = res.data;
    },
    getDefaultKeys(node, array) {
      if (!node.children) {
        return array.push(node.id);
      }
      node.children.forEach(element => {
        this.getDefaultKeys(element, array);
      });
    },
    setRightDialogClosed() {
      this.deKeys = [];
    },
    async allotRights() {
      let keys = [
        ...this.$refs.rightsTreeRef.getCheckedKeys(),
        ...this.$refs.rightsTreeRef.getHalfCheckedKeys()
      ];
      let idString = keys.join(",");
      // console.log(idString);
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idString }
      );
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("分配权限失败");
      this.$message.success("分配权限成功");
      this.rightsDialogVisible = false;
      this.getRolesList();
    }
  }
};
</script>
<style scoped>
.el-row {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 7px 5px 7px 0;
}
.bbottom {
  border-bottom: 1px solid #eee;
}
.btop {
  border-top: 1px solid #eee;
}
</style>
