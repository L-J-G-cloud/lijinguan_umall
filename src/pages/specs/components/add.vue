<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '规格添加' : '规格编辑'"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form ref="form" :model="form" label-width="80px" >
        <el-form-item label="规格名称" required>
          <el-input v-model="form.specsname"></el-input>
        </el-form-item>

        <el-form-item
          label="规格属性"
          v-for="(item, index) in attrArr"
          :key="index"
          :span="21" 
          required
        >
          <el-row >
            <el-col :span="17" >
              <el-input v-model="item.value"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="addAttr" v-if="index == 0"
                >新增规格属性</el-button
              >
              <el-button type="danger" v-else @click="del(index)"
                >删除</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add()" v-if="info.isAdd"
          >添 加</el-button
        >
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../../utils/alert";
import {
  reqSpecsAdd,
  reqSpecsInfo,
  reqSpecsEdit,
} from "../../../utils/request";
import{validateNecessary} from "../../../utils/validate"
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      //规格属性数组
      attrArr: [{ value: "" }, { value: "" }],
      form: {
        specsname: "",
        attrs: this.attrArr,
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      roleList: "specs/list",
    }),
  },
  methods: {
    ...mapActions({
      reqSpecsList: "specs/reqListAction",
      reqTotalAction: "specs/reqTotalAction",
    }),
    //添加商品属性
    addAttr() {
      this.attrArr.push({ value: "" });
    },
    //删除
    del(index) {
      this.attrArr.splice(index, 1);
    },
    //取消
    cancel() {
      this.info.isshow = false;
    },
    //弹框消失完成
    close() {
      //如果是添加开的弹框，就什么都不做；如果是编辑开的弹框，就清除form
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    //数据重置
    empty() {
      this.attrArr = [{ value: "" }, { value: "" }];
      this.form = {
        specsname: "",
        attrs: "",
        status: 1,
      };
    },
    close() {
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    add() {
      this.form.attrs = JSON.stringify(this.attrArr.map((item) => item.value));

       if(this.form.specsname==''||!this.attrArr.every(item=>item.value)){
          warningAlert("请填写完成内容");
          return;
       }
      reqSpecsAdd(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqSpecsList();
          this.reqTotalAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    look(id) {
      reqSpecsInfo(id).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list[0];
          this.form.password = "******";
          this.attrArr = JSON.parse(this.form.attrs).map((item) => ({
            value: item,
          }));
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update() {
      this.form.attrs = JSON.stringify(this.attrArr.map((item) => item.value));
       if(this.form.specsname==''||!this.attrArr.every(item=>item.value)){
          warningAlert("请填写完成内容");
          return;
       }
      reqSpecsEdit(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqSpecsList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {},
};
</script>
<style scoped>
</style>