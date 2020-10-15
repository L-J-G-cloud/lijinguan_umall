<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加角色' : '编辑角色'"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="form.rolename"></el-input>
        </el-form-item>

        <el-tree
          ref="tree"
          :data="menuList"
          show-checkbox
          node-key="id"
          :props="{ children: 'children', label: 'title' }"
        >
        </el-tree>

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
import { reqRoleAdd, reqRoleInfo, reqRoleEdit } from "../../../utils/request";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      form: {
        rolename: "",
        menus: "[]",
        status: 1,
      },
      rules: {
        rolename: [
          { required: true, message: "请选择所属角色", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  computed: {
    ...mapGetters({
      menuList: "menu/list",
    }),
  },
  methods: {
    ...mapActions({
      // 请求菜单的list
      reqMenuListAction: "menu/reqListAction",
      // 角色的list
      reqRoleList: "role/reqListAction",
    }),
    changePid() {},
    cancel() {
      this.info.isshow = false;
    },
    close() {
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    add(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
          reqRoleAdd(this.form).then((res) => {
            if (res.data.code == 200) {
              successAlert(res.data.msg);
              this.empty();
              this.cancel();
              this.reqRoleList();
            } else {
              warningAlert(res.data.msg);
            }
          });
        }
      });
    },
    empty() {
      this.form = {
        rolename: "",
        menus: "[]",
        status: 1,
      };
      //树形控件设置值
      this.$refs.tree.setCheckedKeys([]);
    },
    cancel() {
      this.info.isshow = false;
    },
    look(id) {
      reqRoleInfo(id).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.id = id;
          this.$refs.tree.setCheckedKeys(JSON.parse(this.form.menus));
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update() {
      this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      reqRoleEdit(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqRoleList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {
    if (this.menuList.length == 0) {
      this.reqMenuListAction();
    }
  },
};
</script>
<style scoped>
</style>