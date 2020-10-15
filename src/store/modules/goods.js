import { reqGoodsList, reqGoodsCount } from "../../utils/request"

const state = {
    //菜单的list
    list: [],
    //总数
    total: 0,
    //一页的数量
    size: 2,
    //页码
    page: 1
}
const mutations = {
    //    修改list
    changeList(state, arr) {
        state.list = arr
    },
    //修改总数
    changeTotle(state, num) {
        state.total = num;
    },
    //修改页码
    changePage(state, page) {
        state.page = page
    }

}

const actions = {
    reqListAction(context) {
        reqGoodsList({ page: context.state.page, size: context.state.size }).then(res => {
            let list = res.data.list ? res.data.list : []
            //如果取到的数据是null,并且不是第一页，那么就页码减1，重新请求list
            if (context.state.page > 1 && list.length == 0) {
                context.commit("changePage", context.state.page - 1)
                context.dispatch("reqListAction")
                return;
            }
            context.commit("changeList", list)
        })
    },
    reqTotalAction(context) {
        reqGoodsCount().then(res => {
            context.commit("changeTotle", res.data.list[0].total)
        })
    },
    //组件修改了页码
    changePageAction(context, page) {
        //修改页码
        context.commit("changePage", page)
        //发起list请求
        context.dispatch('reqListAction')
    }
}

const getters = {
    list(state) {
        return state.list;
    },
    size(state) {
        return state.size
    },
    total(state) {
        return state.total;
    }
}

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true
}