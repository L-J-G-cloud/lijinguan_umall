import Vue from 'vue'
import Router from 'vue-router'
import store from "../store"

Vue.use(Router)

function checkPath(path, next) {
  if (store.state.userInfo.menus_url.includes(path)) {
    next()
  } else {
    next('/')
  }
}

export let indexRoutes = [
  {
    path: "menu",
    component: () => import("../pages/menu/menu.vue"),
    name: "菜单管理",
    beforeEnter(to, from, next) {
      checkPath('/menu', next)
    }
  },
  {
    path: "role",
    component: () => import("../pages/role/role.vue"),
    name: "角色管理",
    beforeEnter(to, from, next) {
      checkPath('/role', next);
    }

  },
  {
    path: "manage",
    component: () => import("../pages/manage/manage.vue"),
    name: "管理员管理",
    beforeEnter(to, from, next) {
      checkPath('/manage', next);
    }
  },
  {
    path: "cate",
    component: () => import("../pages/cate/cate.vue"),
    name: "商品分类",
    beforeEnter(to, from, next) {
      checkPath('/cate', next);
    }
  },
  {
    path: "specs",
    component: () => import("../pages/specs/specs.vue"),
    name: "商品规格",
    beforeEnter(to, from, next) {
      checkPath('/specs', next);
    }
  },
  {
    path: "goods",
    component: () => import("../pages/goods/goods.vue"),
    name: "商品管理",
    beforeEnter(to, from, next) {
      checkPath('/goods', next);
    }
  },
  {
    path: "member",
    component: () => import("../pages/member/member.vue"),
    name: "会员管理",
    beforeEnter(to, from, next) {
      checkPath('/member', next);
    }
  },
  {
    path: "banner",
    component: () => import("../pages/banner/banner.vue"),
    name: "轮播图管理",
    beforeEnter(to, from, next) {
      checkPath('/banner', next);
    }
  },
  {
    path: "seckill",
    component: () => import("../pages/sckill/sckill.vue"),
    name: "秒杀活动",
    beforeEnter(to, from, next) {
      checkPath('/seckill', next);
    }
  },
]

let router = new Router({
  routes: [
    {
      path: "/login",
      component: () => import("../pages/login/login.vue")
    },
    {
      path: "/",
      component: () => import("../pages/index/index.vue"),
      children: [
        {
          path: "",
          component: () => import("../pages/home/home.vue"),
        },
        ...indexRoutes
      ]
    },
  ]
})
// 登录拦截
router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    next()
    return;
  }

  if (store.state.userInfo.token) {
    next();
    return;
  }
  next("/login")
})

export default router