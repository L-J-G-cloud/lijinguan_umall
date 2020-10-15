<template>
  <div>
   <v-list @edit="edit"></v-list>
   <v-edit :info="info" ref="edit"></v-edit>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vEdit from "./components/edit"
import vList from "./components/list"
export default {
  props: [],
  components: {
    vEdit,
    vList
  },
  data() {
    return {
      info:{
         isshow:false,
         isAdd:true
      }
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    willAdd(){
       this.info.isshow=true;
    },
    edit(uid){
       this.info.isshow=true;
       this.info.isAdd=false;
       //让edit组件发起获取详情的请求
       this.$refs.edit.look(uid)
    }
  },
  mounted() {},
};
</script>
<style scoped>
</style>