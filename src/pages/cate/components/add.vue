<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加商品' : '编辑商品'"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="上级分类">
          <el-select v-model="form.pid" placeholder="请选择">
            <el-option label="顶级菜单" :value="0" > </el-option>
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分类名称">
          <el-input v-model="form.catename"></el-input>
        </el-form-item>

        <el-form-item label="图片" v-if="form.pid!=0">
          <div class="my-upload">
            <h2>+</h2>
            <img class="img" :src="imgUrl" alt="" v-if="imgUrl" />
            <input  v-if="info.isshow" type="file" @change="getFile" class="my-input" />
          </div>
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
        <el-button type="primary" @click="add" v-if="info.isAdd"
          >添 加</el-button
        >
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { indexRoutes } from "../../../router/index";
import { reqCateAdd, reqCateInfo, reqCateEdit } from "../../../utils/request";
import { warningAlert, successAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      // 图片地址
      imgUrl: "",
      form: {
        pid: 0,
        catename: "",
        img: null,
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      list: "cate/list",
    }),
  },
  methods: {
    getFile(e) {
      let file = e.target.files[0];
      // console.log(file);
    //   1.大小不超过2M 
    if(file.size>2*1024*1024){
        warningAlert('文件的大小不能超过2M');
        return;
    }
    // 2.验证格式
    let imgExtArr=[".jpg",".png",".jpeg",".gif"];
    let extname=file.name.slice(file.name.lastIndexOf('.'));
    if(!imgExtArr.some(item=>item==extname)){
        warningAlert("格式不正确");
        return;
    }

    this.imgUrl = URL.createObjectURL(file);
    this.form.img = file;
    },
    ...mapActions({
      reqListAction: "cate/reqListAction",
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
    look(id) {
      reqCateInfo(id).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.id = id;
          this.imgUrl=this.$imgPre+this.form.img
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
      this.imgUrl="";
      this.form = {
        pid: 0,
        catename: "",
        img: null,
        status: 1,
      };
    },
    add() {
      reqCateAdd(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update() {
      reqCateEdit(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqListAction();
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
.my-upload {
  width: 150px;
  height: 150px;
  border: 1px dashed #ccc;
  position: relative;
}
.my-upload h2 {
  text-align: center;
  line-height: 150px;
  font-weight: 400;
}
.my-upload .my-input {
  position: absolute;
  width: 150px;
  height: 150px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
.img {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>