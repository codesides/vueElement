<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      ></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeTabsName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button :disabled="tabBtnsDisabled" type="primary" size="mini"
            >添加参数</el-button
          >
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button :disabled="tabBtnsDisabled" type="primary" size="mini"
            >添加属性</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      cateList: [],
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      selectedCateKeys: [],
      activeTabsName: "many",
      manyTableData: [],
      onlyTableData: []
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品数据列表失败！");
      }
      this.cateList = res.data;
    },
    handleChange() {
      if (this.selectedCateKeys.length !== 3) {
        return (this.selectedCateKeys = []);
      }
      this.getParamsData();
    },
    handleTabClick() {
      this.getParamsData();
    },
    async getParamsData() {
      const { data: res } = await this.$http.get(
        `categories/${this.getCateId}/attributes`,
        {
          params: { sel: this.activeTabsName }
        }
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败！");
      }
      return;

      res.data.forEach(item => {
        //   通过三元表达式判断attr_vals是否为空
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];

        // 控制文本框的显示与隐藏
        item.inputVisible = false;
        // 文本框的输入值
        item.inputValue = "";
      });
      if (this.activeTabsName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    }
  },
  computed: {
    tabBtnsDisabled() {
      return this.selectedCateKeys.length !== 3;
    },
    getCateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    }
  }
};
</script>
<style scoped>
.cat_opt {
  margin: 15px 0px;
}
.el-cascader {
  width: 25%;
}
.el-tag {
  margin: 8px;
}
.input-new-tag {
  width: 90px;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
