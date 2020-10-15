export const state={
    userInfo:sessionStorage.getItem("userInfo")?JSON.parse(sessionStorage.getItem("userInfo")):{}
}
export const mutations={
    changeUserInfo(state,info){
        state.userInfo=info;
        if(info.id){
            sessionStorage.setItem("userInfo",JSON.stringify(info))
        }else{
            sessionStorage.removeItem("userInfo")
        }
    }
}
export const getters={
    userInfo(state){
        return state.userInfo;
    }
}