<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加管理员' : '编辑管理员'"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属角色" prop="roleid">
          <el-select v-model="form.roleid" placeholder="请选择">
            <el-option label="请选择" value="shanghai" disabled></el-option>
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
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
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add('form')" v-if="info.isAdd"
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
import { reqUserAdd, reqUserInfo, reqUserEdit } from "../../../utils/request";
import{validateNecessary} from "../../../utils/validate"
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      form: {
        roleid: "",
        username: "",
        password: "",
        status: 1,
      },
      rules: {
        roleid: [validateNecessary("请选择所属角色")],
        username: [validateNecessary("请输入用户名")],
        password: [validateNecessary("请输入密码")],
      },
    };
  },
  computed: {
    ...mapGetters({
      roleList: "role/list",
    }),
  },
  methods: {
    ...mapActions({
      reqRoleListAction: "role/reqListAction",
      reqManageList: "manage/reqListAction",
      reqTotalAction: "manage/reqTotalAction",
    }),
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
      this.form = {
        roleid: "",
        username: "",
        password: "",
        status: 1,
      };
    },
    close() {
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    add(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          reqUserAdd(this.form).then((res) => {
            if (res.data.code == 200) {
              successAlert(res.data.msg);
              this.empty();
              this.cancel();
              this.reqManageList();
              this.reqTotalAction();
            } else {
              warningAlert(res.data.msg);
            }
          });
        }
      });
    },
    look(uid) {
      reqUserInfo(uid).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.password = "******";
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          reqUserEdit(this.form).then((res) => {
            if (res.data.code == 200) {
              successAlert(res.data.msg);
              this.empty();
              this.cancel();
              this.reqManageList();
            } else {
              warningAlert(res.data.msg);
            }
          });
        }
      });
    },
  },
  mounted() {
    //如果没有请求过角色管理的数据，就请求一次，如果请求过了，就不用请求了
    if (this.roleList.length == 0) {
      this.reqRoleListAction();
    }
  },
};
</script>
<style scoped>
</style>