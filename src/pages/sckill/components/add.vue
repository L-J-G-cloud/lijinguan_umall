<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加轮播图' : '编辑轮播图'"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="活动名称" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item label="活动期限" required>
          <el-date-picker
            v-model="value"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="一级分类" prop="first_cateid">
          <el-select
            v-model="form.first_cateid"
            placeholder="请选择"
            @change="changeFirst"
          >
            <el-option label="顶级菜单" :value="0"> </el-option>
            <el-option
              v-for="item in this.catelist"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="二级分类" prop="second_cateid">
          <el-select v-model="form.second_cateid" @change="getThreeList()">
            <el-option label="请选择" value="" disabled> </el-option>
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品" prop="goodsid">
          <el-select v-model="form.goodsid" placeholder="请选择">
            <el-option
              v-for="item in ThreeCateList"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            >
            </el-option>
          </el-select>
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
        <el-button type="primary" @click="update('form')" v-else
          >修 改</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { indexRoutes } from "../../../router/index";
import {
  reqSkillAdd,
  reqSkillInfo,
  reqSkillEdit,
} from "../../../utils/request";
import { warningAlert, successAlert } from "../../../utils/alert";
import { reqCateList, reqGoodsList } from "../../../utils/request";
import { validateNecessary } from "../../../utils/validate";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      value: [],
      form: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      },
      secondCateList: [],
      ThreeCateList: [],
      rules: {
        title: [validateNecessary("请输入活动名称")],
        first_cateid: [validateNecessary("请选择")],
        second_cateid: [validateNecessary("请选择")],
        goodsid: [validateNecessary("请选择")],
      },
    };
  },
  computed: {
    ...mapGetters({
      list: "skill/list",
      catelist: "cate/list",
    }),
  },
  methods: {
    ...mapActions({
      reqListAction: "skill/reqListAction",
      //请求商品分类list
      reqCateList: "cate/reqListAction",
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
    changeFirst() {
      //一级分类变了，二级分类的值应该置空
      this.form.second_cateid = "";
      this.getSecondList();
    },
    //获得二级分类list
    getSecondList() {
      reqCateList({ pid: this.form.first_cateid }).then((res) => {
        //二级分类list
        console.log(res);
        this.secondCateList = res.data.list;
      });
    },
    getThreeList() {
      reqGoodsList(this.form.second_cateid).then((res) => {
        this.ThreeCateList = res.data.list.filter(
          (item) => item.second_cateid == this.form.second_cateid
        );
      });
    },
    look(id) {
      reqSkillInfo(id).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.id = id;
          this.getSecondList();
          this.getThreeList();
          this.value = [
            new Date(parseInt(this.form.begintime)),
            new Date(parseInt(this.form.endtime)),
          ];
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
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      };
      this.value = [];
    },
    Time() {
      this.form.begintime = new Date(this.value[0]).getTime(this.value[0]);
      this.form.endtime = new Date(this.value[1]).getTime(this.value[1]);
    },
    add(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.Time();
          if(!this.form.begintime||!this.form.endtime){
            warningAlert("请选择活动期限");
            return;
          }
          reqSkillAdd(this.form).then((res) => {
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
    update(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.Time();
          reqSkillEdit(this.form).then((res) => {
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
  mounted() {
    if (this.catelist.length == 0) {
      this.reqCateList();
    }
  },
};
</script>
<style scoped>
</style>