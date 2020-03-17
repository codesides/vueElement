<template>
  <el-container>
    <el-header>
      <div>
        <img src="@/assets/logo.png" alt />
        <span>管理后台</span>
      </div>
      <el-button @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-btn" @click="toggleMenu">|||</div>
        <el-menu
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          :default-active="navActive"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavActive('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      menuList: [],
      isCollapse: false,
      navActive: ""
    };
  },
  created() {
    this.getMenuList();
    this.navActive = window.sessionStorage.getItem("navPath");
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("./login");
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    toggleMenu() {
      this.isCollapse = !this.isCollapse;
    },
    saveNavActive(path) {
      // let path = this.$route.path;
      window.sessionStorage.setItem("navPath", path);
      // this.navActive = path;
    }
  }
};
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    > img {
      width: 60px;
      height: 60px;
      margin-right: 10px;
    }
  }
}

.el-aside {
  background-color: #545c64;
  color: #333;
  text-align: center;
  .toggle-btn {
    color: #fff;
    font-size: 14px;
    letter-spacing: 0.2em;
    padding: 10px;
  }
  .el-menu {
    border: none;
    .el-submenu {
      text-align: left;
    }
  }
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}
</style>
