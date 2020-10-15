<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="title" label="活动名称" sortable width="180">
      </el-table-column>
       
      <el-table-column  label="活动时间" sortable >
          <template slot-scope="scope">
          <span>{{ scope.row.begintime | filterTime }}---{{scope.row.endtime | filterTime}}</span>
        </template>
      </el-table-column>
     
      <el-table-column  label="状态" width="150">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 1" type="primary"
            >启用</el-button
          >
          <el-button v-else type="info">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <del-btn @confirm="dele(scope.row.id)"></del-btn>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../../utils/alert";
import {reqSkillDel} from "../../../utils/request"
export default {
  props: [],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "skill/list",
    }),
  },
  methods: {
    ...mapActions({
      reqListAction: "skill/reqListAction",
    }),
    edit(id) {
          this.$emit("edit",id)
    },
    dele(id) {
          //点了确定按钮
        reqSkillDel(id).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.reqListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {
    this.reqListAction();
  },
};
</script>
<style scoped>
img{
  width: 80px;
  height: 80px;
}
</style>