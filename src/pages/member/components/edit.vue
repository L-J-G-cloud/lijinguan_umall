<template>
  <div>
    <el-dialog :title="'会员修改'" :visible.sync="info.isshow" @closed="close">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>

        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password"></el-input>
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
        <el-button type="primary" @click="update('form')">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { indexRoutes } from "../../../router/index";
import { reqMemberInfo, reqMemberEdit } from "../../../utils/request";
import { warningAlert, successAlert } from "../../../utils/alert";
import { validateNecessary } from "../../../utils/validate";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      form: {
        nickname: "",
        phone: "",
        password: 1,
        status: 1,
      },
      rules: {
        nickname: [validateNecessary("请输入昵称")],
        phone: [validateNecessary("请输入手机号")],
        password: [validateNecessary("请输入密码")],
      },
    };
  },
  computed: {
    ...mapGetters({
      list: "member/list",
    }),
  },
  methods: {
    ...mapActions({
      reqListAction: "member/reqListAction",
    }),
    //取消
    cancel() {
      this.info.isshow = false;
    },
    close() {
      //如果是添加开的弹框，就什么都不做；如果是编辑开的弹框，就清除form
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    look(uid) {
      reqMemberInfo(uid).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.id = uid;
          this.form.password = "******";
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //修改了pid
    changePid() {
      if (this.form.pid == 0) {
        this.form.type = 1;
      } else {
        this.form.type = 2;
      }
    },
    //数据重置
    empty() {
      this.form = {
        uid: "",
        nickname: "",
        phone: "",
        password: 1,
        status: 1,
      };
    },
    update(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          reqMemberEdit(this.form).then((res) => {
            if (res.data.code == 200) {
              successAlert(res.data.msg);
              this.empty();
              this.cancel();
              this.reqListAction();
            } else {
              warningAlert(res.data.msg);
            }
          });
        }
      });
    },
  },
  mounted() {},
};
</script>
<style scoped>
</style>