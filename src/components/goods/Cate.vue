<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button @click="addCate" type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        show-index
        index-text="#"
        :data="cateList"
        :columns="columns"
        stripe
        border
        :selection-type="false"
        :expand-type="false"
      >
        <template v-slot:isok="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template v-slot:order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            type="success"
            >二级</el-tag
          >
          <el-tag size="mini" v-else type="warning">三级</el-tag>
        </template>
        <template v-slot:opt="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加分类"
      :visible.sync="setCateDialogVisible"
      width="50%"
    >
      <el-form
        :model="cateForm"
        :rules="cateRules"
        ref="cateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="cateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="cateParentValue"
            :options="cateParentList"
            :props="cateParentProps"
            @change="cateParentChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cateClosed">取 消</el-button>
        <el-button type="primary" @click="cateSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "cate",
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok"
        },
        {
          label: "排序",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "opt"
        }
      ],
      setCateDialogVisible: false,
      cateParentList: [],
      cateForm: {
        cat_name: "",
        cat_level: 0,
        cat_pid: 0
      },
      cateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      cateParentValue: [],
      cateParentProps: {
        expandTrigger: "hover",
        checkStrictly: true,
        value: "cat_id",
        label: "cat_name",
        children: "children"
      }
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    async getGoodsCate() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取分类数据失败");
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsCate();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsCate();
    },
    addCate() {
      this.getCateParentList();
      this.setCateDialogVisible = true;
    },
    async getCateParentList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取分类列表失败");
      this.cateParentList = res.data;
    },
    cateParentChange(value) {
      console.log(value);
      if (value.length > 0) {
        this.cateForm.cat_level = value.length;
        this.cateForm.cat_pid = this.cateParentValue[value.length - 1];
      } else {
        this.cateForm.cat_level = 0;
        this.cateForm.cat_pid = 0;
      }
    },
    cateClosed() {
      this.$refs.cateFormRef.resetFields();
      this.cateForm.cat_level = 0;
      this.cateForm.cat_pid = 0;
      this.cateParentValue = [];
      this.setCateDialogVisible = false;
    },
    cateSubmit() {
      console.log(this.cateForm);
      this.$refs.cateFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.cateForm
        );
        console.log(res);

        if (res.meta.status !== 201) return this.$message.error("分类提交失败");
        this.$message.success("分类提交成功");
        this.getGoodsCate();
        this.cateClosed();
      });
    }
  }
};
</script>
<style scoped>
.el-row {
  margin-bottom: 15px;
}
</style>
