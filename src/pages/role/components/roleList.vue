<template>
  <div>
    <el-table
     :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="id" label="角色编号" sortable width="180">
      </el-table-column>
      <el-table-column prop="rolename" label="角色名称" sortable width="180">
      </el-table-column>
      <el-table-column prop="" label="状态">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 1" type="primary"
            >启用</el-button
          >
          <el-button v-else type="info">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <!-- <el-button type="primary" @click="del(scope.row.id)">删除</el-button> -->
          <del-btn @confirm="dele(scope.row.id)"></del-btn>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from '../../../utils/alert';
import {reqRoleDel} from "../../../utils/request"
export default {
  props: [],
  components: {},
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters({
        list:"role/list"
    }),
  },
  methods: {
    ...mapActions({
        reqListAction:"role/reqListAction"
    }),
    dele(id){
        reqRoleDel(id).then(res=>{
            if(res.data.code==200){
                successAlert(res.data.msg);
                this.reqListAction();
            }else{
                warningAlert(res.data.msg)
            }
        });
    },
    edit(id){
        this.$emit("edit",id)
    }
  },
  mounted() {
      this.reqListAction();
  },
};
</script>
<style scoped>
</style>