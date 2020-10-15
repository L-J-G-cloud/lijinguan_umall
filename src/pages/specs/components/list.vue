<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="id" label="规格编号" sortable width="180">
      </el-table-column>
      <el-table-column prop="specsname" label="规格名称" sortable width="180">
      </el-table-column>
      <el-table-column  label="规格属性" sortable width="180">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.attrs" :key="item">{{
            item
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 1" type="primary"
            >启用</el-button
          >
          <el-button v-else type="info">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)"
            >编辑</el-button
          >
          <del-btn @confirm="dele(scope.row.id)"></del-btn>
        </template>
      </el-table-column>
    </el-table>
     <!-- 分页组件 -->
    <!-- 
    total：设置总数 
    page-size：每页数量 
    有多少页，不用自己计算 

    current-change：当前页码发生了改变，就会触发，参数就是当前的页码
    -->
    <el-pagination background layout="prev, pager, next" :total="total" :page-size="size"
    @current-change="changePage"
    >
    </el-pagination>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from '../../../utils/alert';
import {reqSpecsDel}from "../../../utils/request"
export default {
  props: [],
  components: {},
  data() {
    return {
        
    };
  },
  computed: {
    ...mapGetters({
        list:"specs/list",
        total:"specs/total",
        size:"specs/size"
    }),
  },
  methods: {
    ...mapActions({
        reqListAction: "specs/reqListAction",
        reqTotalAction:"specs/reqTotalAction",
        changePageAction:"specs/changePageAction"
    }),
    dele(id){
      reqSpecsDel(id).then(res=>{
         if(res.data.code==200){
           successAlert(res.data.msg);
           this.reqListAction();
           this.reqTotalAction();
         }else{
             warningAlert(res.data.msg);
         }
      })
    },
    //编辑
    edit(id) {
      this.$emit("edit", id);
    },
    changePage(e){
      this.changePageAction(e)
    }
  },
  mounted() {
   this.reqListAction();
   this.reqTotalAction();
  },
};
</script>
<style scoped>
</style>