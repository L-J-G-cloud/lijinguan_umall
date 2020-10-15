<template>
  <el-container class="index">
    <!-- 侧边导航栏 -->
    <el-aside width="200px" class="left">
      <el-menu
        default-active="/"
        background-color="#20222a"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
        unique-opened
      >
        <el-menu-item index="/">
          <i class="el-icon-menu"></i>
          <span slot="title">首页</span>
        </el-menu-item>

        <!-- 动态侧边栏 -->
        <div v-for="item in userInfo.menus" :key="item.id">
          <el-submenu :index="item.id+''" v-if="item.children">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.title}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item v-for="i in item.children" :key="i.id" :index="i.url">{{i.title}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-menu-item v-else :index="item.url">{{item.title}}</el-menu-item>
          
        </div>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 头部导航栏 -->
      <el-header class="header">
         <div class="box">
           <h3>用户名:{{userInfo.username}}</h3>
           <el-button type="danger" @click="logOut">退出登录</el-button>
         </div>
      </el-header>
      <!-- main导航栏 -->
      <el-main class="con">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.name }}</el-breadcrumb-item>
        </el-breadcrumb>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: [],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({ userInfo: "userInfo" }),
  },
  methods: {
    ...mapActions({ changeUserInfoAction: "changeUserInfoAction" }),
    logOut(){
      this.changeUserInfoAction({});
      this.$router.push('/login');
    }
  },
  mounted() {},
};
</script>
<style scoped>
.index {
  height: 100vh;
}
.el-menu {
  border-right: none;
}
.left {
  background: #20222a;
}
.header {
  background: #b3c0d1;
}
.con {
  padding-top: 20px;
}
.box {
  float: right;
  /* width: 180px; */
  line-height: 60px;
}
.box h3{
   float: left;
}
.box .el-button{
  padding: 10px;
  margin-top: 12px;
  float: left;
}
</style>