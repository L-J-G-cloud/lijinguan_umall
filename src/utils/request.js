import Vue from "vue"
import axios from "axios"
import qs from "qs"
import store from "../store"
import {warningAlert} from "./alert"
import router from "../router"
//开发环境下使用
Vue.prototype.$imgPre = "http://localhost:3000"
let baseUrl = "/api";


// 打包
// Vue.prototype.$imgPre=""
// let baseUrl = "";
// 请求拦截
axios.interceptors.request.use(req=>{
    if(req.url!=baseUrl+"/login"){
        req.headers.authorization = store.state.userInfo.token;
    }
    return req;
})
//响应拦截
axios.interceptors.response.use(res => {
    console.group("=====本次请求的路径是:" + res.config.url);
    console.log(res);
    console.groupEnd();

     //用户掉线了
     if(res.data.msg=='登录已过期或访问权限受限'){
        warningAlert(res.data.msg)
        router.push("/login")
    }

    return res
})
/*******登录*************************************************/
export const reqLogin = (params) => {
    console.log(params);
    return axios({
        url: baseUrl + '/api/userlogin',
        method: 'post',
        data: qs.stringify(params)
    })
}
/*******菜单管理*************************************************/
//添加
export const reqMenuAdd = (params) => {
    return axios({
        url: baseUrl + "/api/menuadd",
        method: "post",
        data: qs.stringify(params)
    })
}
//列表
export const reqMenuList = () => {
    return axios({
        url: baseUrl + "/api/menulist",
        method: "get",
        params: {
            istree: true
        }
    })
}
//一条
export const reqMenuInfo = (id) => {
    return axios({
        url: baseUrl + "/api/menuinfo",
        method: "get",
        params: {
            id
        }
    })
}
//编辑
export const reqMenuEdit = (params) => {
    return axios({
        url: baseUrl + "/api/menuedit",
        method: "post",
        data: qs.stringify(params)
    })
}
//删除
export const reqMenuDel = (id) => {
    return axios({
        url: baseUrl + "/api/menudelete",
        method: "post",
        data: qs.stringify({ id: id })
    })
}

/*******角色管理*************************************************/

//角色添加
export const reqRoleAdd = (params) => {
    return axios({
        url: baseUrl + "/api/roleadd",
        method: "post",
        data: qs.stringify(params)
    })
}
//角色列表
export const reqRoleList = () => {
    return axios({
        url: baseUrl + "/api/rolelist",
        method: "get",
    })
}

// 角色获取一条
export const reqRoleInfo = (id) => {
    return axios({
        url: baseUrl + "/api/roleinfo",
        method: "get",
        params: { id: id }
    })
}

// 角色修改
export const reqRoleEdit = (params) => {
    return axios({
        url: baseUrl + "/api/roleedit",
        method: "post",
        data: qs.stringify(params)
    })
}
//角色删除
export const reqRoleDel = (id) => {
    return axios({
        url: baseUrl + "/api/roledelete",
        method: "post",
        data: qs.stringify({ id: id })
    })
}

/*******管理员管理*************************************************/

// 管理员添加
export const reqUserAdd = (params) => {
    return axios({
        url: baseUrl + "/api/useradd",
        method: "post",
        data: qs.stringify(params)
    })
}

// 管理员总数（用于计算分页）

export const reqUserCount = () => {
    return axios({
        url: baseUrl + "/api/usercount",
        method: "get"
    })
}

// 管理员列表（分页）
//列表 params={page:1,size:10}
export const reqUserList = (params) => {
    return axios({
        url: baseUrl + "/api/userlist",
        method: "get",
        params: params
    })
}

// 管理员获取（一条）

export const reqUserInfo = (uid) => {
    return axios({
        url: baseUrl + "/api/userinfo",
        method: "get",
        params: { uid: uid }
    })
}

// 管理员修改

export const reqUserEdit = (params) => {
    return axios({
        url: baseUrl + "/api/useredit",
        method: "post",
        data: qs.stringify(params)
    })
}

// 管理员删除
export const reqUserDel = (uid) => {
    return axios({
        url: baseUrl + "/api/userdelete",
        method: "post",
        data: qs.stringify({ uid: uid })
    })
}

// 管理员登录
export const reqUserLogin = (params) => {
    return axios({
        url: baseUrl + '/api/userlogin',
        method: 'post',
        data: qs.stringify(params),
    })
}

/*******商品分类管理*************************************************/

// 商品分类添加

export const reqCateAdd = (params) => {
    var data = new FormData();
    for (let i in params) {
        data.append(i, params[i])
    }
    return axios({
        url: baseUrl + '/api/cateadd',
        method: 'POST',
        data: data,
    })
}

// 商品分类列表

export const reqCateList = (params) => {
    console.log(params);
    return axios({
        url: baseUrl + '/api/catelist',
        method: 'get',
        params: params,
    })
}

// 商品分类获取（一条）

export const reqCateInfo = (id) => {
    return axios({
        url: baseUrl + '/api/cateinfo',
        method: 'get',
        params: { id: id },
    })
}

// .商品分类修改

export const reqCateEdit = (params) => {
    var data = new FormData();
    for (let i in params) {
        data.append(i, params[i])
    }
    return axios({
        url: baseUrl + '/api/cateedit',
        method: 'post',
        data: data,
    })
}

// 商品分类删除

export const reqCateDel = (id) => {
    return axios({
        url: baseUrl + '/api/catedelete',
        method: 'post',
        data: qs.stringify({ id: id }),
    })
}


/*******商品规格管理*************************************************/
// 商品规格添加
export const reqSpecsAdd = (params) => {
    return axios({
        url: baseUrl + '/api/specsadd',
        method: 'POST',
        data: qs.stringify(params),
    })
}
// 商品规格总数（用于计算分页）

export const reqSpecsCount = () => {
    return axios({
        url: baseUrl + "/api/specscount",
        method: "get",
    })
}

// 商品规格列表(分页)
// {size :1,page:3}
export const reqSpecsList = (params) => {
    return axios({
        url: baseUrl + '/api/specslist',
        method: 'get',
        params: params,
    })
}

// 商品规格获取（一条）

export const reqSpecsInfo = (id) => {
    return axios({
        url: baseUrl + '/api/specsinfo',
        method: 'get',
        params: { id: id },
    })
}

// .商品规格修改

export const reqSpecsEdit = (params) => {
    return axios({
        url: baseUrl + '/api/specsedit',
        method: 'post',
        data: qs.stringify(params),
    })
}

// 商品规格删除

export const reqSpecsDel = (id) => {
    return axios({
        url: baseUrl + '/api/specsdelete',
        method: 'post',
        data: qs.stringify({ id: id }),
    })
}


/*******会员管理*************************************************/

// 会员列表**
export const reqMemberList = () => {
    return axios({
        url: baseUrl + '/api/memberlist',
        method: 'get',
    })
}

// 会员获取（一条）

export const reqMemberInfo = (uid) => {
    return axios({
        url: baseUrl + '/api/memberinfo',
        method: 'get',
        params: { uid: uid }
    })
}

// 会员修改

export const reqMemberEdit = (params) => {
    return axios({
        url: baseUrl + '/api/memberedit',
        method: 'post',
        data: qs.stringify(params),
    })
}
/*******商品管理*************************************************/
// 1.商品添加
export const reqGoodsAdd = (form) => {
    console.log(form);
    let data = new FormData()
    for (let i in form) {
        data.append(i, form[i])
    }
    return axios({
        url: baseUrl + "/api/goodsadd",
        method: "post",
        data: data
    })
}

// 2.商品总数（用于计算分页）
export const reqGoodsCount=()=>{
    return axios({
        url:baseUrl+"/api/goodscount",
    })
}

// **3.商品列表（分页）** 
export const reqGoodsList=(params)=>{
    return axios({
        url:baseUrl+"/api/goodslist",
        method:"get",
        params:params
    })
}

// 4.商品获取（一条）
export const reqGoodsInfo=(id)=>{
    return axios({
        url:baseUrl+"/api/goodsinfo",
        params:{id:id}
    })
}

// 5.商品修改
export const reqGoodsEdit=(params)=>{
    let data = new FormData();
    for(let i in params){
        data.append(i,params[i]);
    }
    return axios({
        url:baseUrl+"/api/goodsedit",
        method:"post",
        data:data
    })
}

// 6.商品删除

export const reqGoodsDel=(id)=>{
    return axios({
        url:baseUrl+"/api/goodsdelete",
        method:"post",
        data:{id:id}
    })
}
/*******轮播图管理*************************************************/
// 轮播图添加** 

export const reqBannerAdd = (params) => {
    let data = new FormData();
    for (let i in params) {
        data.append(i, params[i])
    }
    return axios({
        url: baseUrl + '/api/banneradd',
        method: 'post',
        data: data,
    })
}

// 轮播图列表

export const reqBannerList = () => {
    return axios({
        url: baseUrl + '/api/bannerlist',
        method: 'get',
    })
}

// 轮播图获取（一条）

export const reqBannerInfo = (id) => {
    return axios({
        url: baseUrl + '/api/bannerinfo',
        method: 'get',
        params: { id: id },
    })
}

// 轮播图修改

export const reqBannerEdit = (params) => {
    let data = new FormData();
    for (let i in params) {
        data.append(i, params[i])
    }
    return axios({
        url: baseUrl + '/api/banneredit',
        method: 'post',
        data: data,
    })
}

// 轮播图删除

export const reqBannerDel = (id) => {
    return axios({
        url: baseUrl + '/api/bannerdelete',
        method: 'post',
        data: { id: id },
    })
}


/*******秒杀管理*************************************************/

// 秒杀添加** 

export const reqSkillAdd = (params) => {
    return axios({
        url: baseUrl +'/api/seckadd',
        method: 'post',
        data: qs.stringify(params),
    })
}

// 秒杀列表

export const reqSkillList = () => {
    return axios({
        url: baseUrl + '/api/secklist',
        method: 'get',
    })
}

// 秒杀获取（一条）

export const reqSkillInfo = (id) => {
    return axios({
        url: baseUrl + '/api/seckinfo',
        method: 'get',
        params: { id: id },
    })
}

// 秒杀修改

export const reqSkillEdit = (params) => {
    return axios({
        url: baseUrl + '/api/seckedit',
        method: 'post',
        data: qs.stringify(params),
    })
}

// 秒杀删除

export const reqSkillDel = (id) => {
    return axios({
        url: baseUrl + '/api/seckdelete',
        method: 'post',
        data: { id: id },
    })
}
